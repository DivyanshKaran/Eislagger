type KafkaEvent = {
  topic: string;
  message: Record<string, unknown>;
};

let isProducerConnected = false;
let isConsumerConnected = false;

export const connectProducer = async (): Promise<void> => {
  // Placeholder: integrate real Kafka client here
  isProducerConnected = true;
  console.log("[Kafka] Producer connected (stub)");
};

export const disconnectProducer = async (): Promise<void> => {
  isProducerConnected = false;
  console.log("[Kafka] Producer disconnected (stub)");
};

export const connectConsumer = async (): Promise<void> => {
  // Placeholder: integrate real Kafka consumer here
  isConsumerConnected = true;
  console.log("[Kafka] Consumer connected (stub)");
};

export const disconnectConsumer = async (): Promise<void> => {
  isConsumerConnected = false;
  console.log("[Kafka] Consumer disconnected (stub)");
};

export const sendEvent = async ({ topic, message }: KafkaEvent): Promise<void> => {
  if (!isProducerConnected) {
    console.warn("[Kafka] sendEvent called before producer connected; buffering not implemented. Logging only.");
  }
  console.log("[Kafka] Event", { topic, message });
};

// Removed unused default export; named exports are sufficient


