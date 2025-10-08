import { Kafka, Partitioners } from "kafkajs";
import { PrismaClient } from "@prisma/client";

const kafka = new Kafka({
  clientId: "sales-service",
  brokers: ["localhost:9092"], // Replace with your Kafka broker address
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
let isConnected = false;

const prisma = new PrismaClient();

const consumer = kafka.consumer({ groupId: "sales-service-inventory-consumers" });
let isConsumerConnected = false;

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

// Inventory flavor events consumer
export const startInventoryConsumer = async () => {
  if (isConsumerConnected) return;
  await consumer.connect();
  isConsumerConnected = true;
  await consumer.subscribe({ topic: "inventory.flavor.v1", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const value = message.value?.toString();
        if (!value) return;
        const event = JSON.parse(value);
        // Expected shape: { type: 'flavor.created' | 'flavor.updated', flavor: { id, name, description, category } }
        const type = event.type as string;
        const flavor = event.flavor as { id: string; name?: string; description?: string; category?: string };
        if (!flavor?.id) return;

        if (type === 'flavor.created' || type === 'flavor.updated') {
          await prisma.shopStock.updateMany({
            where: { flavorId: flavor.id },
            data: {
              flavorName: flavor.name ?? undefined,
              flavorDescription: flavor.description ?? undefined,
              category: flavor.category ?? undefined,
              updatedAt: new Date(),
            }
          });
          console.log(`ShopStock cache refreshed for flavor ${flavor.id}`);
        }
      } catch (err) {
        console.error("Inventory consumer error:", err);
      }
    }
  });
};

export const stopInventoryConsumer = async () => {
  if (!isConsumerConnected) return;
  await consumer.disconnect();
  isConsumerConnected = false;
};
