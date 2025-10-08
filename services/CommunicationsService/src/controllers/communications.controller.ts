import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

import { sendEvent } from "../kafka/kafka";

const prisma = new PrismaClient() as any;

const getAuthenticatedUser = (req: Request) => (req as any).user as
  | { id: string; name?: string; email?: string; role?: string }
  | undefined;

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper function for error handling
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// --- CHAT SYSTEM ---

export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUser(req)?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    const { limit = 20, offset = 0, type } = req.query;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId }
        },
        ...(type && { conversationType: type as any }),
        isActive: true,
      },
      include: {
        participants: {
          where: { isActive: true },
          select: {
            userId: true,
            userName: true,
            userRole: true,
            lastReadAt: true,
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            messageType: true,
            senderName: true,
            createdAt: true,
          }
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { lastActivityAt: 'desc' },
      skip: Number(offset),
      take: Number(limit),
    });

    res.json({
      success: true,
      conversations,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        hasMore: conversations.length === Number(limit),
      },
    });
  } catch (error) {
    console.error("GetConversations error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting conversations",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const createConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { participants, title, description, conversationType = 'DIRECT' } = req.body;

    if (!userId || !participants || !Array.isArray(participants)) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_REQUEST", message: "Invalid request parameters" }
      });
    }

    // Add current user to participants
    const allParticipants = [userId, ...participants];
    const uniqueParticipants = [...new Set(allParticipants)];

    // For direct conversations, ensure exactly 2 participants
    if (conversationType === 'DIRECT' && uniqueParticipants.length !== 2) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_PARTICIPANTS", message: "Direct conversation must have exactly 2 participants" }
      });
    }

    const conversation = await prisma.conversation.create({
      data: {
        title,
        description,
        conversationType: conversationType as any,
        participants: {
          create: uniqueParticipants.map(participantId => ({
            userId: participantId,
            userName: getAuthenticatedUser(req)?.name || 'Unknown User',
            userRole: getAuthenticatedUser(req)?.role,
          }))
        }
      },
      include: {
        participants: true,
      },
    });

    res.status(201).json({
      success: true,
      conversation,
      message: "Conversation created successfully",
    });

    // Send Kafka event
    await sendEvent({
      topic: "CONVERSATION_CREATED",
      message: {
        conversationId: conversation.id,
        creatorId: userId,
        participants: uniqueParticipants,
        type: conversationType,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("CreateConversation error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error creating conversation",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUser(req)?.id;
    const { id } = req.params;
    const { limit = 50, offset = 0, messageId } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    // Verify user is participant
    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        participants: { some: { userId } }
      }
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { code: "CONVERSATION_NOT_FOUND", message: "Conversation not found" }
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId: id,
        ...(messageId && { id: { gt: messageId as string } })
      },
      include: {
        attachments: true,
        replyToMessage: {
          select: {
            id: true,
            content: true,
            senderName: true,
          }
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: Number(offset),
      take: Number(limit),
    });

    res.json({
      success: true,
      messages,
      conversationId: id,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        hasMore: messages.length === Number(limit),
      },
    });

  } catch (error) {
    console.error("GetConversationMessages error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting messages",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUser(req)?.id;
    const { id } = req.params;
    const { content, messageType = 'TEXT', replyToMessageId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    // Verify user is participant
    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        participants: { 
          some: { 
            userId,
            canSendMessages: true 
          }
        }
      },
      include: { participants: true }
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: { code: "CONVERSATION_NOT_FOUND", message: "Conversation not found or access denied" }
      });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: userId,
        senderName: getAuthenticatedUser(req)?.name || 'Unknown User',
        senderRole: getAuthenticatedUser(req)?.role,
        content,
        messageType: messageType as any,
        replyToMessageId,
        status: 'SENT',
      },
      include: {
        attachments: true,
        replyToMessage: {
          select: {
            id: true,
            content: true,
            senderName: true,
          }
        },
      }
    });

    // Update conversation last activity
    await prisma.conversation.update({
      where: { id },
      data: {
        lastMessageId: message.id,
        lastActivityAt: new Date(),
      }
    });

    res.status(201).json({
      success: true,
      data: message,
      message: "Message sent successfully",
    });

    // Send Kafka event
    await sendEvent({
      topic: "MESSAGE_SENT",
      message: {
        messageId: message.id,
        conversationId: id,
        senderId: userId,
        content,
        messageType,
        recipientIds: conversation.participants.filter(p => p.userId !== userId).map(p => p.userId),
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("SendMessage error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error sending message",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUser(req)?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    // Find message and verify user is participant
    const message = await prisma.message.findFirst({
      where: {
        id,
        conversation: {
          participants: {
            some: { userId }
          }
        }
      },
      include: { conversation: true }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: { code: "MESSAGE_NOT_FOUND", message: "Message not found" }
      });
    }

    // Update message status
    await prisma.message.update({
      where: { id },
      data: {
        status: 'READ',
      }
    });

    // Update participant's last read time
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId: message.conversationId,
        userId,
      },
      data: {
        lastReadAt: new Date(),
      }
    });

    res.json({
      success: true,
      message: "Message marked as read",
    });

  } catch (error) {
    console.error("MarkMessageAsRead error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error marking message as read",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getOnlineUsers = async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.query;

    const onlineUsers = await prisma.userPresence.findMany({
      where: {
        status: { in: ['ONLINE', 'AWAY', 'BUSY'] } as any,
      },
      orderBy: { lastSeenAt: 'desc' },
      take: Number(limit),
    });

    res.json({
      success: true,
      onlineUsers,
      totalOnline: onlineUsers.length,
    });

  } catch (error) {
    console.error("GetOnlineUsers error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting online users",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- EMAIL SYSTEM ---

export const getAllEmails = async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUser(req)?.id;
    const { limit = 20, offset = 0, folder = 'inbox', search } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    const where: any = { recipientId: userId };
    
    // Filter by folder
    switch (folder) {
      case 'inbox':
        break; // Default: recipientId filter
      case 'sent':
        where.recipientId = null;
        where.senderId = userId;
        break;
      case 'starred':
        where.isStarred = true;
        break;
      case 'important':
        where.isImportant = true;
        break;
    }

    // Search filter
    if (search) {
      where.OR = [
        { subject: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [emails, totalCount] = await Promise.all([
      prisma.email.findMany({
        where,
        include: { attachments: true },
        orderBy: { createdAt: 'desc' },
        skip: Number(offset),
        take: Number(limit),
      }),
      prisma.email.count({ where }),
    ]);

    res.json({
      success: true,
      emails,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });

  } catch (error) {
    console.error("GetAllEmails error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting emails",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const senderId = getAuthenticatedUser(req)?.id;
    const { recipientId, recipientEmail, subject, content, priority = 'NORMAL' } = req.body;

    if (!senderId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    const email = await prisma.email.create({
      data: {
        senderId,
        senderName: getAuthenticatedUser(req)?.name || 'Unknown User',
        senderEmail: getAuthenticatedUser(req)?.email || 'no-email@example.com',
        recipientId,
        recipientName: 'Unknown User', // Would be fetched from Auth service
        recipientEmail,
        subject,
        content,
        plainText: content.replace(/<[^>]*>/g, ''), // Strip HTML tags
        status: 'QUEUED',
        priority: priority as any,
      },
    });

    // Send email via transporter
    try {
      await emailTransporter.sendMail({
        from: getAuthenticatedUser(req)?.email || process.env.SMTP_FROM,
        to: recipientEmail,
        subject: subject,
        html: content,
      });

      // Update email status
      await prisma.email.update({
        where: { id: email.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        }
      });

    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      await prisma.email.update({
        where: { id: email.id },
        data: { status: 'FAILED' }
      });
    }

    res.status(201).json({
      success: true,
      email,
      message: "Email sent successfully",
    });

  } catch (error) {
    console.error("SendEmail error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error sending email",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getEmail = async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUser(req)?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    const email = await prisma.email.findFirst({
      where: {
        id,
        OR: [
          { recipientId: userId },
          { senderId: userId }
        ]
      },
      include: { attachments: true }
    });

    if (!email) {
      return res.status(404).json({
        success: false,
        error: { code: "EMAIL_NOT_FOUND", message: "Email not found" }
      });
    }

    // Mark as read if recipient
    if (email.recipientId === userId && !email.isRead) {
      await prisma.email.update({
        where: { id },
        data: { isRead: true, readAt: new Date() }
      });
    }

    res.json({ success: true, email });

  } catch (error) {
    console.error("GetEmail error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting email",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const markEmailAsRead = async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUser(req)?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    const email = await prisma.email.updateMany({
      where: {
        id,
        recipientId: userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      }
    });

    res.json({
      success: true,
      message: "Email marked as read",
      updated: email.count > 0,
    });

  } catch (error) {
    console.error("MarkEmailAsRead error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error marking email as read",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const starEmail = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { starred } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    const email = await prisma.email.updateMany({
      where: {
        id,
        OR: [
          { recipientId: userId },
          { senderId: userId }
        ]
      },
      data: {
        isStarred: starred === true,
      }
    });

    res.json({
      success: true,
      message: `Email ${starred ? 'starred' : 'unstarred'}`,
      updated: email.count > 0,
    });

  } catch (error) {
    console.error("StarEmail error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating email star status",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const replyToEmail = async (req: Request, res: Response) => {
  try {
    const senderId = getAuthenticatedUser(req)?.id;
    const { id } = req.params;
    const { content } = req.body;

    if (!senderId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    // Get original email
    const originalEmail = await prisma.email.findFirst({
      where: {
        id,
        OR: [
          { recipientId: senderId },
          { senderId: senderId }
        ]
      }
    });

    if (!originalEmail) {
      return res.status(404).json({
        success: false,
        error: { code: "EMAIL_NOT_FOUND", message: "Email not found" }
      });
    }

    // Determine reply recipient
    const isOriginalSender = originalEmail.senderId === senderId;
    const replyRecipientId = isOriginalSender ? originalEmail.recipientId : originalEmail.senderId;
    const replyRecipientEmail = isOriginalSender ? originalEmail.recipientEmail : originalEmail.senderEmail;
    const replySubject = originalEmail.subject.startsWith('Re: ') ? originalEmail.subject : `Re: ${originalEmail.subject}`;

    const replyEmail = await prisma.email.create({
      data: {
        senderId,
        senderName: getAuthenticatedUser(req)?.name || 'Unknown User',
        senderEmail: getAuthenticatedUser(req)?.email || 'no-email@example.com',
        recipientId: replyRecipientId,
        recipientName: 'Unknown User',
        recipientEmail: replyRecipientEmail,
        subject: replySubject,
        content,
        plainText: content.replace(/<[^>]*>/g, ''),
        threadId: originalEmail.threadId || originalEmail.id,
        replyToEmailId: id,
        status: 'QUEUED',
      },
    });

    // Send reply
    try {
      await emailTransporter.sendMail({
        from: getAuthenticatedUser(req)?.email || process.env.SMTP_FROM,
        to: replyRecipientEmail,
        subject: replySubject,
        html: content,
      });

      await prisma.email.update({
        where: { id: replyEmail.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        }
      });

      // Update original email
      await prisma.email.update({
        where: { id },
        data: { repliedAt: new Date() }
      });

    } catch (emailError) {
      console.error("Reply sending failed:", emailError);
      await prisma.email.update({
        where: { id: replyEmail.id },
        data: { status: 'FAILED' }
      });
    }

    res.status(201).json({
      success: true,
      replyEmail,
      message: "Reply sent successfully",
    });

  } catch (error) {
    console.error("ReplyToEmail error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error sending reply",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- NOTIFICATIONS SYSTEM ---

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUser(req)?.id;
    const { limit = 20, offset = 0, unreadOnly = false } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    const where: any = { userId };
    if (unreadOnly === 'true') {
      where.readAt = null;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: Number(offset),
      take: Number(limit),
    });

    res.json({
      success: true,
      notifications,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        hasMore: notifications.length === Number(limit),
      },
    });

  } catch (error) {
    console.error("GetNotifications error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting notifications",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { userId, title, message, type = 'INFO', channels = ['IN_APP'], priority = 'MEDIUM', data, expiresAt } = req.body;

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: type as any,
        priority: priority as any,
        data,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        channels: {
          create: channels.map((channel: string) => ({
            channel: channel as any,
            status: 'PENDING',
          }))
        }
      },
      include: { channels: true }
    });

    res.status(201).json({
      success: true,
      notification,
      message: "Notification created successfully",
    });

    // Send Kafka event
    await sendEvent({
      topic: "NOTIFICATION_CREATED",
      message: {
        notificationId: notification.id,
        userId,
        title,
        message,
        type,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("CreateNotification error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error creating notification",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUser(req)?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    const notification = await prisma.notification.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        readAt: new Date(),
      }
    });

    res.json({
      success: true,
      message: "Notification marked as read",
      updated: notification.count > 0,
    });

  } catch (error) {
    console.error("MarkNotificationAsRead error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error marking notification as read",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = getAuthenticatedUser(req)?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    const deletedCount = await prisma.notification.deleteMany({
      where: {
        id,
        userId,
      }
    });

    res.json({
      success: true,
      message: "Notification deleted successfully",
      deleted: deletedCount.count > 0,
    });

  } catch (error) {
    console.error("DeleteNotification error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error deleting notification",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" }
      });
    }

    const updatedCount = await prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      }
    });

    res.json({
      success: true,
      message: "All notifications marked as read",
      updated: updatedCount.count,
    });

  } catch (error) {
    console.error("MarkAllNotificationsAsRead error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error marking all notifications as read",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Helper function to handle file uploads
export const handleChatAttachmentUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: "NO_FILE", message: "No file uploaded" }
      });
    }

    const { messageId } = req.body;

    const attachment = await prisma.messageAttachment.create({
      data: {
        messageId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      }
    });

    res.status(201).json({
      success: true,
      attachment,
      message: "File uploaded successfully",
    });

  } catch (error) {
    console.error("HandleChatAttachmentUpload error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error uploading file",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Removed unused default export; named exports are used by the router
