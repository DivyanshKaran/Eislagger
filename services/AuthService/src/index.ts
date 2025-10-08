import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.ts";

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",     // Frontend dev server
    "http://localhost:3001",     // Admin service
    "http://localhost:3003",     // Inventory service
    "http://localhost:3004",     // Sales service
    "http://localhost:3005",     // Communications service
    "http://localhost:3006",     // Analytics service
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
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
    message: "EisLagger Auth Service is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: [
      "POST /api/v1/auth/register",
      "POST /api/v1/auth/login",
      "POST /api/v1/auth/logout",
      "GET /api/v1/auth/me",
      "POST /api/v1/auth/verify",
      "POST /api/v1/auth/refresh",
      "POST /api/v1/auth/forgot-password",
      "POST /api/v1/auth/reset-password",
      "PUT /api/v1/auth/profile",
      "PUT /api/v1/auth/change-password",
      "GET /api/v1/auth/users",
      "PUT /api/v1/auth/users/:userId/role",
      "DELETE /api/v1/auth/users/:userId"
    ]
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);

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

const startServer = () => {
  const server = app.listen(port, () => {
    console.log(`EisLagger Auth Service listening at http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`);
    console.log(`Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log("🛑 Shutting down Auth Service gracefully...");
    server.close(() => {
      console.log("✅ Auth Service disconnected.");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer();

