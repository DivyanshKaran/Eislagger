import express from "express";
import dotenv from "dotenv";

import salesRoutes from "./routes/sales.routes.ts";
import { connectProducer, disconnectProducer } from "./kafka/kafka.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Sales Service is running!");
});

app.use("/api/v1/sales", salesRoutes);

const startServer = async () => {
  try {
    // 1. Connect to Kafka before the server starts listening for requests
    await connectProducer();
    console.log("Kafka Producer is ready.");

    // 2. Start the Express server
    const server = app.listen(PORT, () => {
      console.log(`Sales Service is running on port ${PORT}`);
    });

    // 3. Set up graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down Sales Service gracefully...");
      server.close(async () => {
        await disconnectProducer();
        console.log("Kafka Producer disconnected.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown); // Catches Ctrl+C
    process.on("SIGTERM", shutdown); // Catches kill signals
  } catch (error) {
    console.error("Failed to start Sales Service:", error);
    process.exit(1);
  }
};

startServer();
