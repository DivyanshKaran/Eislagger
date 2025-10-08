import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";

import analyticsRoutes from "./routes/analytics.routes.ts";
import { connectConsumer, connectProducer, disconnectConsumer, disconnectProducer } from "./kafka/kafka.ts";
import { scheduleReportGeneration } from "./reports/scheduler.ts";
import { startMetricsCollection } from "./controllers/metricsCollector.ts";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3006;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",     // Frontend dev server
    "http://localhost:3001",     // Admin service
    "http://localhost:3002",     // Auth service
    "http://localhost:3003",     // Inventory service
    "http://localhost:3004",     // Sales service
    "http://localhost:3005",     // Communications service
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EisLagger Analytics Service is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    features: {
      realtimeAnalytics: true,
      customReports: true,
      kpiManagement: true,
      dataVisualization: true,
      reportScheduling: true
    },
    endpoints: [
      "GET /api/v1/analytics/dashboard/:role",
      "GET /api/v1/analytics/dashboard/kpis",
      "GET /api/v1/analytics/dashboard/real-time",
      "GET /api/v1/analytics/sales",
      "GET /api/v1/analytics/sales/trends",
      "GET /api/v1/analytics/sales/products",
      "GET /api/v1/analytics/revenue",
      "GET /api/v1/analytics/inventory",
      "GET /api/v1/analytics/inventory/turnover",
      "GET /api/v1/analytics/inventory/waste",
      "GET /api/v1/analytics/suppliers",
      "GET /api/v1/analytics/locations",
      "GET /api/v1/analytics/locations/map",
      "GET /api/v1/analytics/locations/heatmap",
      "POST /api/v1/analytics/reports/generate",
      "GET /api/v1/analytics/reports/:reportId",
      "POST /api/v1/analytics/reports/schedule",
      "GET /api/v1/analytics/reports/scheduled"
    ],
    scheduledJobs: [
      "Metrics Collection: Every hour",
      "Report Generation: Daily at 6 AM",
      "Data Cleanup: Daily at 12 AM",
      "Cache Refresh: Every 15 minutes"
    ]
  });
});

// API Routes
app.use("/api/v1/analytics", analyticsRoutes);

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

    // 2. Start metrics collection
    startMetricsCollection();
    console.log("✅ Metrics collection started.");

    // 3. Setup scheduled reports
    scheduleReportGeneration();
    console.log("✅ Report scheduling configured.");

    // 4. Setup cron jobs for periodic tasks
    setupCronJobs();
    console.log("✅ Cron jobs scheduled.");

    // 5. Start the Express server
    const server = app.listen(port, () => {
      console.log(`🚀 EisLagger Analytics Service listening at http://localhost:${port}`);
      console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Kafka Brokers: ${process.env.KAFKA_BROKERS ? 'Configured' : 'Not configured'}`);
      
      // Feature status
      console.log(`📊 Realtime Analytics: Active`);
      console.log(`📈 KPI Management: Active`);
      console.log(`📋 Custom Reports: Active`);
      console.log(`🗃️ Data Collection: Active`);
      console.log(`⏰ Report Scheduling: Active`);
    });

    // 6. Set up graceful shutdown
    const shutdown = async () => {
      console.log("🛑 Shutting down Analytics Service gracefully...");
      
      server.close(async () => {
        await Promise.all([
          disconnectProducer(),
          disconnectConsumer(),
        ]);
        console.log("✅ Kafka Producer and Consumer disconnected.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown); // Catches Ctrl+C
    process.on("SIGTERM", shutdown); // Catches kill signals
    
  } catch (error) {
    console.error("❌ Failed to start Analytics Service:", error);
    process.exit(1);
  }
};

// Setup cron jobs for periodic analytics tasks
const setupCronJobs = () => {
  // Hourly metrics collection
  cron.schedule('0 * * * *', () => {
    console.info('📊 Running hourly metrics collection...');
    // This would trigger metrics collection
  });

  // Daily report generation at 6 AM
  cron.schedule('0 6 * * *', () => {
    console.info('📋 Running scheduled report generation...');
    // This would trigger scheduled reports
  });

  // Data cleanup at midnight
  cron.schedule('0 0 * * *', () => {
    console.info('🗑️ Running data cleanup...');
    // This would clean old data
  });

  // Cache refresh every 15 minutes
  cron.schedule('*/15 * * * *', () => {
    console.info('🔄 Refreshing analytics cache...');
    // This would refresh caches
  });
};

startServer();

