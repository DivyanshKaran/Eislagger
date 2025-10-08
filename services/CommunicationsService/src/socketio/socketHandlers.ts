import { Server as SocketIOServer, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-that-is-long";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userName?: string;
  userRole?: string;
}

// Socket.IO authentication middleware
const authenticateSocket = async (socket: Socket): Promise<AuthenticatedSocket | null> => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log("Socket authentication failed: No token");
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded.id) {
      console.log("Socket authentication failed: Invalid token payload");
      return null;
    }

    const authenticatedSocket = socket as AuthenticatedSocket;
    authenticatedSocket.userId = decoded.id;
    authenticatedSocket.userName = decoded.name;
    authenticatedSocket.userRole = decoded.role;

    return authenticatedSocket;
  } catch (error) {
    console.log("Socket authentication failed:", error);
    return null;
  }
};

// Update USER_PRESENCE when connecting/disconnecting
const updateUserPresence = async (userId: string, userName: string, status: 'ONLINE' | 'OFFLINE', clientId?: string) => {
  try {
    const existingPresence = await prisma.userPresence.findUnique({
      where: { userId }
    });

    if (existingPresence) {
      if (status === 'ONLINE') {
        // Add to connected clients
        const connectedClients = [...existingPresence.connectedClientIds];
        if (clientId && !connectedClients.includes(clientId)) {
          connectedClients.push(clientId);
        }
        
        await prisma.userPresence.update({
          where: { userId },
          data: {
            status: 'ONLINE',
            lastSeenAt: new Date(),
            connectedClientIds: connectedClients,
          }
        });
      } else {
        // Remove from connected clients or set offline if no clients
        const connectedClients = existingPresence.connectedClientIds.filter(id => id !== clientId);
        
        await prisma.userPresence.upsert({
          where: { userId },
          update: {
            status: connectedClients.length === 0 ? 'OFFLINE' : existingPresence.status,
            lastSeenAt: new Date(),
            connectedClientIds: connectedClients,
          },
          create: {
            userId,
            userName,
            status: 'OFFLINE',
            lastSeenAt: new Date(),
            connectedClientIds: [],
          }
        });
      }
    } else if (status === 'ONLINE') {
      await prisma.userPresence.create({
        data: {
          userId,
          userName,
          status: 'ONLINE',
          lastSeenAt: new Date(),
          connectedClientIds: clientId ? [clientId] : [],
        }
      });
    }
  } catch (error) {
    console.error("Error updating user presence:", error);
  }
};

export const setupSocketHandlers = (io: SocketIOServer) => {
  io.use(async (socket, next) => {
    const authenticatedSocket = await authenticateSocket(socket);
    if (!authenticatedSocket) {
      next(new Error("Authentication failed"));
    } else {
      next();
    }
  });

  io.on("connection", async (socket: AuthenticatedSocket) => {
    const { userId, userName, userRole } = socket;
    
    console.log(`👤 User ${userName} (${userId}) connected on socket ${socket.id}`);

    // Join user to their personal room
    socket.join(`user:${userId}`);
    
    // Update user presence
    await updateUserPresence(userId!, userName!, 'ONLINE', socket.id);

    // Broadcast user online status to other users
    socket.broadcast.emit("USER_STATUS_CHANGE", {
      userId,
      userName,
      userRole,
      status: 'ONLINE',
      timestamp: new Date().toISOString(),
    });

    // --- Socket Event Handlers ---

    // Handle user going offline
    socket.on("USER_OFFLINE", async () => {
      await updateUserPresence(userId!, userName!, 'OFFLINE', socket.id);
      
      socket.broadcast.emit("USER_STATUS_CHANGE", {
        userId,
        userName,
        userRole,
        status: 'OFFLINE',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle joining a conversation
    socket.on("JOIN_CONVERSATION", async (data) => {
      const { conversationId } = data;
      
      try {
        // Verify user is participant
        const conversation = await prisma.conversation.findFirst({
          where: {
            id: conversationId,
            participants: {
              some: { userId }
            }
          }
        });

        if (conversation) {
          socket.join(`conversation:${conversationId}`);
          socket.to(`conversation:${conversationId}`).emit("USER_JOINED_CONVERSATION", {
            userId,
            userName,
            conversationId,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error joining conversation:", error);
      }
    });

    // Handle leaving a conversation
    socket.on("LEAVE_CONVERSATION", (data) => {
      const { conversationId } = data;
      socket.leave(`conversation:${conversationId}`);
      
      socket.to(`conversation:${conversationId}`).emit("USER_LEFT_CONVERSATION", {
        userId,
        userName,
        conversationId,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle typing indicators
    socket.on("TYPING_START", async (data) => {
      const { conversationId } = data;
      
      try {
        // Verify user is participant
        const conversation = await prisma.conversation.findFirst({
          where: {
            id: conversationId,
            participants: { some: { userId } }
          }
        });

        if (conversation) {
          // Update/insert typing indicator
          await prisma.typingIndicator.upsert({
            where: {
              conversationId_userId: {
                conversationId,
                userId: userId!,
              }
            },
            update: {
              isTyping: true,
              expiresAt: new Date(Date.now() + 10000), // 10 seconds
            },
            create: {
              conversationId,
              userId: userId!,
              userName: userName!,
              isTyping: true,
              expiresAt: new Date(Date.now() + 10000),
            }
          });

          // Broadcast typing indicator to other participants
          socket.to(`conversation:${conversationId}`).emit("TYPING_START", {
            userId,
            userName,
            conversationId,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error handling typing start:", error);
      }
    });

    socket.on("TYPING_STOP", async (data) => {
      const { conversationId } = data;
      
      try {
        await prisma.typingIndicator.updateMany({
          where: {
            conversationId,
            userId,
          },
          data: {
            isTyping: false,
          }
        });

        socket.to(`conversation:${conversationId}`).emit("TYPING_STOP", {
          userId,
          userName,
          conversationId,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error handling typing stop:", error);
      }
    });

    // Handle new messages
    socket.on("NEW_MESSAGE", async (data) => {
      const { conversationId, content, messageType, replyToMessageId } = data;
      
      try {
        // Verify user is participant
        const conversation = await prisma.conversation.findFirst({
          where: {
            id: conversationId,
            participants: { some: { userId } }
          },
          include: { participants: true }
        });

        if (!conversation) {
          socket.emit("MESSAGE_ERROR", {
            conversationId,
            error: "Conversation not found or access denied"
          });
          return;
        }

        // Create message
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: userId!,
            senderName: userName!,
            senderRole: userRole,
            content,
            messageType: messageType || 'TEXT',
            replyToMessageId,
            status: 'SENT',
          },
          include: {
            attachments: true,
          }
        });

        // Update conversation
        await prisma.conversation.update({
          where: { id: conversationId },
          data: {
            lastMessageId: message.id,
            lastActivityAt: new Date(),
          }
        });

        // Update last read for sender
        await prisma.conversationParticipant.updateMany({
          where: {
            conversationId,
            userId: userId!,
          },
          data: {
            lastReadAt: new Date(),
          }
        });

        // Broadcast message to conversation participants
        io.to(`conversation:${conversationId}`).emit("NEW_MESSAGE", {
          message,
          conversationId,
          timestamp: new Date().toISOString(),
        });

        // Notify other participants of new message (for notification purposes)
        conversation.participants.forEach(participant => {
          if (participant.userId !== userId) {
            io.to(`user:${participant.userId}`).emit("NEW_MESSAGE_NOTIFICATION", {
              conversationId,
              senderId: userId,
              senderName: userName,
              messagePreview: content.substring(0, 100),
              timestamp: new Date().toISOString(),
            });
          }
        });

      } catch (error) {
        console.error("Error handling new message:", error);
        socket.emit("MESSAGE_ERROR", {
          conversationId,
          error: "Failed to send message"
        });
      }
    });

    // Handle message read receipts
    socket.on("MESSAGE_READ", async (data) => {
      const { messageId } = data;
      
      try {
        const message = await prisma.message.update({
          where: { id: messageId },
          data: {
            status: 'READ',
          }
        });

        // Broadcast read receipt
        socket.to(`conversation:${message.conversationId}`).emit("MESSAGE_DELIVERED", {
          messageId,
          conversationId: message.conversationId,
          readerId: userId,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error handling message read:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`👤 User ${userName} (${userId}) disconnected from socket ${socket.id}`);
      
      // Update typing indicators
      await prisma.typingIndicator.updateMany({
        where: { userId },
        data: { isTyping: false }
      });
      
      // Update presence
      await updateUserPresence(userId!, userName!, 'OFFLINE', socket.id);
      
      // Broadcast offline status
      socket.broadcast.emit("USER_STATUS_CHANGE", {
        userId,
        userName,
        userRole,
        status: 'OFFLINE',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  // Clean up expired typing indicators periodically
  setInterval(async () => {
    try {
      await prisma.typingIndicator.deleteMany({
        where: {
          expiresAt: { lt: new Date() }
        }
      });
    } catch (error) {
      console.error("Error cleaning up typing indicators:", error);
    }
  }, 30000); // Every 30 seconds
};
