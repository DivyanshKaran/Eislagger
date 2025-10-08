import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import winston from "winston";

import adminRoutes from "./routes/admin.routes.ts";
import { connectConsumer, connectProducer, disconnectConsumer, disconnectProducer } from "./kafka/kafka.ts";
import { auditLogger } from "./middleware/auditLogger.ts";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/admin-service-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/admin-service-combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Ensure logs directory exists
import { mkdirSync } from 'fs';
try {
  mkdirSync('logs', { recursive: true });
} catch (err) {
  // Directory might already exist
}

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",     // Frontend dev server
    "http://localhost:3002",     // Auth service
    "http://localhost:3003",     // Inventory service
    "http://localhost:3004",     // Sales service
    "http://localhost:3005",     // Communications service
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Audit logging middleware
app.use(auditLogger);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EisLagger Admin Service is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: [
      "GET /api/v1/admin/users",
      "PUT /api/v1/admin/users/:userId/role",
      "PUT /api/v1/admin/users/:userId/status",
      "DELETE /api/v1/admin/users/:userId",
      "GET /api/v1/admin/users/machines",
      "GET /api/v1/admin/system/health",
      "GET /api/v1/admin/system/metrics",
      "GET /api/v1/admin/system/logs",
      "POST /api/v1/admin/system/logs/clear",
      "GET /api/v1/admin/audit-logs",
      "POST /api/v1/admin/audit-logs/search",
      "GET /api/v1/admin/compliance/report",
      "GET /api/v1/admin/config",
      "PUT /api/v1/admin/config",
      "GET /api/v1/admin/config/themes",
      "POST /api/v1/admin/config/maintenance",
      "POST /api/v1/admin/broadcasts",
      "GET /api/v1/admin/broadcasts",
      "PUT /api/v1/admin/broadcasts/:id/status"
    ]
  });
});

// API Routes
app.use("/api/v1/admin", adminRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Global error handler:", err);
  
  // Audit the error
  logger.error("System error audit:", {
    action: 'ERROR',
    resource: 'SYSTEM',
    status: 'FAILURE',
    message: 'System error occurred',
    tags: ['ERROR', 'SYSTEM']
  });
  
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
        
    logger.info("✅ Kafka Producer and Consumer are ready");

    // 2. Start the Express server
    const server = app.listen(port, () => {
      logger.info(`🚀 EisLagger Admin Service listening at http://localhost:${port}`);
      logger.info(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📊 Kafka Brokers: ${process.env.KAFKA_BROKERS ? 'Configured' : 'Not configured'}`);
      
      // Log system startup
      logger.info("📈 System startup metrics", {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      });
    });

    // 3. Set up graceful shutdown
    const shutdown = async () => {
      logger.info("🛑 Shutting down Admin Service gracefully...");
      
      server.close(async () => {
        await Promise.all([
          disconnectProducer(),
          disconnectConsumer(),
        ]);
        
        logger.info("✅ Kafka Producer and Consumer disconnected");
        logger.end();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown); // Catches Ctrl+C
    process.on("SIGTERM", shutdown); // Catches kill signals
    
    // Graceful shutdown on uncaught exceptions
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", error);
      shutdown();
    });
    
    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection at:", promise, "reason:", reason);
      shutdown();
    });
    
  } catch (error) {
    logger.error("❌ Failed to start Admin Service:", error);
    process.exit(1);
  }
};

startServer();
