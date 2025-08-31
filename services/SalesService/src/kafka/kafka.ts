import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
  clientId: "sales-service",
  brokers: ["localhost:9092"], // Replace with your Kafka broker address
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
let isConnected = false;

export const connectProducer = async () => {
  if (isConnected) return;
  await producer.connect();
  isConnected = true;
  console.log("Kafka producer connected");
};

export const sendAuditLog = async (logData: object) => {
  if (!isConnected) {
    throw new Error("Kafka producer is not connected.");
  }
  await producer.send({
    topic: "Audit_Logs",
    messages: [{ value: JSON.stringify(logData) }],
  });
  console.log("Audit log sent:", logData);
};

export const disconnectProducer = async () => {
  if (!isConnected) return;
  await producer.disconnect();
  isConnected = false;
  console.log("Kafka producer disconnected");
};
