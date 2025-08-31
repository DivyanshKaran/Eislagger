import express from "express";
import dotenv from "dotenv";

import adminRoutes from "./routes/admin.routes.ts";
import { disconnectConsumer, runConsumer } from "./kafka/kafka.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Admin service is running!");
});

app.use("/api/v1/admin", adminRoutes);

const startServer = async () => {
  try {
    // 1. Start the Kafka consumer before the server starts listening
    await runConsumer();
    console.log("Kafka Consumer is running.");

    // 2. Start the Express server
    const server = app.listen(PORT, () => {
      console.log(`Admin Service is running on port ${PORT}`);
    });

    // 3. Set up graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down Admin Service gracefully...");
      server.close(async () => {
        await disconnectConsumer();
        console.log("Kafka Consumer disconnected.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start Admin Service:", error);
    process.exit(1);
  }
};

startServer();
