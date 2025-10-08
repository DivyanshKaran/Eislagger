import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import inventoryRoutes from "./routes/inventory.routes.ts";
import { connectConsumer, connectProducer, disconnectConsumer, disconnectProducer } from "./kafka/kafka.ts";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",     // Frontend dev server
    "http://localhost:3001",     // Admin service (if needed)
    "http://localhost:3002",     // Auth service (if needed)
    "http://localhost:3004",     // Sales service (if needed)
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
    message: "EisLagger Inventory Service is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: [
      "GET /api/v1/inventory/factories",
      "GET /api/v1/inventory/factories/:factoryId",
      "PUT /api/v1/inventory/factories/:factoryId/budget",
      "GET /api/v1/inventory/factories/:factoryId/analytics",
      "POST /api/v1/inventory/factories/:factoryId/stock-items",
      "GET /api/v1/inventory/data/:factoryId/stock-items",
      "PUT /api/v1/inventory/stock-items/:itemId",
      "DELETE /api/v1/inventory/stock-items/:itemId",
      "POST /api/v1/inventory/stock-items/:itemId/expiry",
      "GET /api/v1/inventory/flavors",
      "POST /api/v1/inventory/flavors",
      "GET /api/v1/inventory/flavors/:flavorId",
      "PUT /api/v1/inventory/flavors/:flavorId",
      "DELETE /api/v1/inventory/flavors/:flavorId",
      "POST /api/v1/inventory/invoices",
      "GET /api/v1/inventory/invoices/:invoiceId",
      "PUT /api/v1/inventory/invoices/:invoiceId/status",
      "GET /api/v1/inventory/invoices",
      "GET /api/v1/inventory/suppliers",
      "POST /api/v1/inventory/suppliers",
      "PUT /api/v1/inventory/suppliers/:supplierId",
      "GET /api/v1/inventory/health"
    ]
  });
});

// API Routes
app.use("/api/v1/inventory", inventoryRoutes);

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

    // 2. Start the Express server
    const server = app.listen(port, () => {
      console.log(`EisLagger Inventory Service listening at http://localhost:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Kafka Brokers: ${process.env.KAFKA_BROKERS ? 'Configured' : 'Not configured'}`);
    });

    // 3. Set up graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down Inventory Service gracefully...");
      server.close(async () => {
        await Promise.all([
          disconnectProducer(),
          disconnectConsumer(),
        ]);
        console.log("Kafka Producer and Consumer disconnected.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown); // Catches Ctrl+C
    process.on("SIGTERM", shutdown); // Catches kill signals
  } catch (error) {
    console.error("Failed to start Inventory Service:", error);
    process.exit(1);
  }
};

startServer();
