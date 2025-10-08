import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import salesRoutes from "./routes/sales.routes.ts";
import { connectProducer, disconnectProducer, startInventoryConsumer, stopInventoryConsumer } from "./kafka/kafka.ts";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3004;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",     // Frontend dev server
    "http://localhost:3001",     // Admin service (if needed)
    "http://localhost:3002",     // Auth service (if needed)
    "http://localhost:3003",     // Inventory service (if needed)
    "http://localhost:3005",     // Communications service (if needed)
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EisLagger Sales Service is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: [
      "GET /api/v1/sales/shops",
      "POST /api/v1/sales/shops",
      "GET /api/v1/sales/shops/:shopId",
      "PUT /api/v1/sales/shops/:shopId",
      "DELETE /api/v1/sales/shops/:shopId",
      "GET /api/v1/sales/shops/:shopId/menu",
      "GET /api/v1/sales/shops/:shopId/inventory",
      "POST /api/v1/sales/shops/:shopId/pos-transactions",
      "POST /api/v1/sales/shops/:shopId/purchase-orders",
      "GET /api/v1/sales/shops/:shopId/transactions",
      "GET /api/v1/sales/shops/:shopId/orders",
      "GET /api/v1/sales/shops/:shopId/reviews",
      "POST /api/v1/sales/feedback",
      "GET /api/v1/sales/health"
    ]
  });
});

// API Routes
app.use("/api/v1/sales", salesRoutes);

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
    // 1. Connect to Kafka before the server starts listening for requests
    await connectProducer();
    console.log("✅ Kafka Producer is ready.");

    // 2. Start inventory consumer for flavor cache refresh
    await startInventoryConsumer();

    // 3. Start the Express server
    const server = app.listen(port, () => {
      console.log(`🚀 EisLagger Sales Service listening at http://localhost:${port}`);
      console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Kafka Brokers: ${process.env.KAFKA_BROKERS ? 'Configured' : 'Not configured'}`);
    });

    // 4. Set up graceful shutdown
    const shutdown = async () => {
      console.log("🛑 Shutting down Sales Service gracefully...");
      server.close(async () => {
        await stopInventoryConsumer();
        await disconnectProducer();
        console.log("✅ Kafka Producer disconnected.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown); // Catches Ctrl+C
    process.on("SIGTERM", shutdown); // Catches kill signals
  } catch (error) {
    console.error("❌ Failed to start Sales Service:", error);
    process.exit(1);
  }
};

startServer();