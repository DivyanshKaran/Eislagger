import { Kafka } from "kafkajs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const kafka = new Kafka({
  clientId: "admin-service",
  brokers: ["localhost:9092"], // Replace with your Kafka broker address
});

const consumer = kafka.consumer({ groupId: "admin-audit-group" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const auditLogFilePath = path.join(__dirname, "..", "data", "auditlogs-1.json");

const appendLogToFile = async (log: object) => {
  try {
    // Ensure the data directory exists
    await fs.mkdir(path.dirname(auditLogFilePath), { recursive: true });

    // Read existing logs
    let logs: object[] = [];
    try {
      const fileContent = await fs.readFile(auditLogFilePath, "utf-8");
      logs = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or is empty, start with an empty array
      if (error.code !== "ENOENT") throw error;
    }

    // Append the new log and write back to the file
    logs.push(log);
    await fs.writeFile(
      auditLogFilePath,
      JSON.stringify(logs, null, 2),
      "utf-8"
    );
    console.log("Successfully appended log to auditlogs.json");
  } catch (error) {
    console.error("Error writing to audit log file:", error);
  }
};

export const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "Audit_Logs", fromBeginning: true });
  console.log("Kafka consumer connected and subscribed to Audit_Logs");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;

      console.log(`Received message from topic ${topic}:`);
      const logData = JSON.parse(message.value.toString());
      console.log(logData);

      // Append the received log to the JSON file
      await appendLogToFile(logData);
    },
  });
};

export const disconnectConsumer = async () => {
  await consumer.disconnect();
  console.log("Kafka consumer disconnected");
};
