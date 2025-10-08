import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import multer from "multer";
import path from "path";
import fs from "fs";

import communicationsRoutes from "./routes/communications.routes";
import { setupSocketHandlers } from "./socketio/socketHandlers.ts";
import { connectConsumer, connectProducer, disconnectConsumer, disconnectProducer } from "./kafka/kafka";
import { setupFileUploadMiddleware } from "./middleware/fileUpload.ts";

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3005;

// Ensure upload directories exist
const uploadDirs = [
  path.join(process.cwd(), "uploads", "chat-attachments"),
  path.join(process.cwd(), "uploads", "profile-images"),
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Socket.IO setup with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      "http://localhost:3000",     // Frontend dev server
      "http://localhost:3001",     // Admin service
      "http://localhost:3002",     // Auth service
      "http://localhost:3003",     // Inventory service
      "http://localhost:3004",     // Sales service
    ],
    credentials: true,
    methods: ["GET", "POST"]
  },
  transports: ["websocket", "polling"]
});

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",     // Frontend dev server
    "http://localhost:3001",     // Admin service
    "http://localhost:3002",     // Auth service
    "http://localhost:3003",     // Inventory service
    "http://localhost:3004",     // Sales service
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload middleware
app.use(setupFileUploadMiddleware());

// Serve static files
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EisLagger Communications Service is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    features: {
      realtimeChat: true,
      emailSystem: true,
      notifications: true,
      fileUploads: true,
      websocket: true
    },
    endpoints: [
      "GET /api/v1/communications/chat/conversations",
      "POST /api/v1/communications/chat/conversations",
      "GET /api/v1/communications/chat/conversations/:id/messages",
      "POST /api/v1/communications/chat/conversations/:id/messages",
      "POST /api/v1/communications/chat/messages/:id/read",
      "GET /api/v1/communications/chat/online-users",
      "GET /api/v1/communications/emails",
      "POST /api/v1/communications/emails",
      "GET /api/v1/communications/emails/:id",
      "PUT /api/v1/communications/emails/:id/read",
      "PUT /api/v1/communications/emails/:id/star",
      "POST /api/v1/communications/emails/:id/reply",
      "GET /api/v1/communications/notifications",
      "POST /api/v1/communications/notifications",
      "PUT /api/v1/communications/notifications/:id/read",
      "DELETE /api/v1/communications/notifications/:id",
      "POST /api/v1/communications/notifications/mark-all",
      "POST /api/v1/communications/upload/chat-attachments"
    ],
    websocketEvents: [
      "USER_ONLINE", "USER_OFFLINE", "TYPING_START", "TYPING_STOP",
      "JOIN_CONVERSATION", "LEAVE_CONVERSATION", "NEW_MESSAGE",
      "MESSAGE_DELIVERED", "CONVERSATION_UPDATED", "USER_STATUS_CHANGE",
      "NOTIFICATION_RECEIVED", "SYSTEM_ANNOUNCEMENT"
    ]
  });
});

// API Routes
app.use("/api/v1/communications", communicationsRoutes);

// WebSocket connection endpoint
app.get("/socket", (req, res) => {
  res.json({
    message: "WebSocket connection available at /socket.io endpoint",
    instructions: "Connect to http://localhost:" + port + "/socket.io/",
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler:", err);
  
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: err.message || "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.stack : undefined
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "API endpoint not found",
      path: req.originalUrl
    },
    timestamp: new Date().toISOString()
  });
});

const startServer = async () => {
  try {
    // 1. Connect to Kafka producers and consumers
    await Promise.all([
      connectProducer(),
      connectConsumer(),
    ]);
    console.log("✅ Kafka Producer and Consumer are ready.");

    // 2. Setup Socket.IO handlers
    setupSocketHandlers(io);
    console.log("✅ Socket.IO handlers configured.");

    // 3. Start the HTTP server
    server.listen(port, () => {
      console.log(`🚀 EisLagger Communications Service listening at http://localhost:${port}`);
      console.log(`🔌 WebSocket server running at ws://localhost:${port}`);
      console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Kafka Brokers: ${process.env.KAFKA_BROKERS ? 'Configured' : 'Not configured'}`);
      
      // Connection stats
      console.log(`💬 Chat System: Active`);
      console.log(`📧 Email System: Active`);
      console.log(`🔔 Notification System: Active`);
      console.log(`📁 File Upload System: Active`);
    });

    // 4. Set up graceful shutdown
    const shutdown = async () => {
      console.log("🛑 Shutting down Communications Service gracefully...");
      server.close(async () => {
        await Promise.all([
          disconnectProducer(),
          disconnectConsumer(),
        ]);
        console.log("✅ Kafka Kafka Producer and Consumer disconnected.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown); // Catches Ctrl+C
    process.on("SIGTERM", shutdown); // Catches kill signals
  } catch (error) {
    console.error("❌ Failed to start Communications Service:", error);
    process.exit(1);
  }
};

startServer();
