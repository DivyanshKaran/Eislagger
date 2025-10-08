import { Kafka, Producer, Consumer } from "kafkajs";

const kafka = new Kafka({
  clientId: "analytics-service",
  brokers: [process.env.KAFKA_BROKERS || "localhost:9092"],
});

let producer: Producer;
let consumer: Consumer;

export const connectProducer = async () => {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    console.log("✅ Analytics Service Producer connected to Kafka");
  }
};

export const connectConsumer = async () => {
  if (!consumer) {
    consumer = kafka.consumer({ groupId: "analytics-service-group" });
    await consumer.connect();
    console.log("✅ Analytics Service Consumer connected to Kafka");

    // Subscribe to analytics-relevant topics
    await consumer.subscribe({ topics: [
      "POS_TRANSACTION",
      "STOCK_UPDATED", 
      "ORDER_CREATED",
      "USER_ACTIVITY",
      "REVENUE_GENERATED",
      "PRODUCTION_UPDATED",
      "BUDGET_ALLOCATION_UPDATED",
      "CONVERSATION_CREATED",
      "MESSAGE_SENT",
      "SALE_COMPLETED",
      "NOTIFICATION_CREATED"
    ]});

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const payload = JSON.parse(message.value?.toString() || "{}");
          
          console.log(`📊 [Analytics Service] Processing event: ${topic}`);
          
          switch (topic) {
            case "POS_TRANSACTION":
              await handlePOSTransaction(payload);
              break;
            case "STOCK_UPDATED":
              await handleStockUpdate(payload);
              break;
            case "ORDER_CREATED":
              await handleOrderCreated(payload);
              break;
            case "REVENUE_GENERATED":
              await handleRevenueGenerated(payload);
              break;
            case "PRODUCTION_UPDATED":
              await handleProductionUpdate(payload);
              break;
            case "MESSAGE_SENT":
              await handleMessageSent(payload);
              break;
            case "SALE_COMPLETED":
              await handleSaleCompleted(payload);
              break;
            default:
              console.log(`📊 [Analytics Service] Unknown topic: ${topic}`);
          }
        } catch (error) {
          console.error(`❌ Error processing Kafka message:`, error);
        }
      },
    });

    console.log("📊 Analytics Service Kafka consumer started");
  }
};

// Analytics event handlers
const handlePOSTransaction = async (payload: any) => {
  console.log("📊 Processing POS transaction for analytics:", payload);
  // Update sales analytics, revenue metrics, etc.
};

const handleStockUpdate = async (payload: any) => {
  console.log("📊 Processing stock update for analytics:", payload);
  // Update inventory analytics
};

const handleOrderCreated = async (payload: any) => {
  console.log("📊 Processing order creation for analytics:", payload);
  // Update order analytics
};

const handleRevenueGenerated = async (payload: any) => {
  console.log("📊 Processing revenue for analytics:", payload);
  // Update revenue analytics
};

const handleProductionUpdate = async (payload: any) => {
  console.log("📊 Processing production update for analytics:", payload);
  // Update production analytics
};

const handleMessageSent = async (payload: any) => {
  console.log("📊 Processing message sent for analytics:", payload);
  // Update communication analytics
};

const handleSaleCompleted = async (payload: any) => {
  console.log("📊 Processing sale completion for analytics:", payload);
  // Update sales completion metrics
};

export const disconnectProducer = async () => {
  if (producer) {
    await producer.disconnect();
    console.log("✅ Analytics Service Producer disconnected from Kafka");
  }
};

export const disconnectConsumer = async () => {
  if (consumer) {
    await consumer.disconnect();
    console.log("✅ Analytics Service Consumer disconnected from Kafka");
  }
};

export const sendEvent = async (event: { topic: string; message: any }) => {
  if (!producer) {
    await connectProducer();
  }
  
  try {
    await producer.send({
      topic: event.topic,
      messages: [
        {
          key: event.message.id || "analytics-event",
          value: JSON.stringify({
            ...event.message,
            timestamp: new Date().toISOString(),
            source: "analytics-service"
          }),
        },
      ],
    });
  } catch (error) {
    console.error("📊 Analytics Service failed to publish event:", error);
  }
};
