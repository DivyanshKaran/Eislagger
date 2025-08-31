# Eislagger Microservices and Kafka

This document provides an overview of the microservices architecture in the Eislagger project and how Apache Kafka is used for inter-service communication.

## Microservices Overview

The Eislagger platform is built on a set of loosely coupled microservices. Each service is responsible for a specific business domain:

- **AuthService**: Handles user authentication and authorization.
- **AdminService**: Provides administrative functionalities.
- **SalesService**: Manages sales, shops, and customer interactions.
- **InventoryService**: Manages inventory, stock, and factories.
- **LogisticsService**: (To be implemented) Handles logistics and delivery.

## Kafka Integration

To enable communication and data flow between these services, we use Apache Kafka as an event bus. This creates an event-driven architecture where services can produce and consume events without being directly coupled to each other.

### Architecture

- **Producers**: Services that generate and send events to Kafka topics. For example, the `SalesService` produces a `pos-transaction` event whenever a sale is made.
- **Consumers**: Services that subscribe to Kafka topics and process the events. For example, the `InventoryService` consumes `pos-transaction` events to update its stock levels.
- **Topics**: Events are organized into topics. Each topic represents a specific type of event, such as `pos-transaction` or `purchase-order`.

### Setup

To run the Eislagger microservices with Kafka, you need to have a running Kafka instance. Follow these steps for a manual setup on Windows:

1.  **Download and Extract Kafka**:

    - Go to the official Apache Kafka downloads page: [https://kafka.apache.org/downloads](https://kafka.apache.org/downloads)
    - Download a binary release of Kafka.
    - Extract the contents of the downloaded archive to a directory on your machine (e.g., `C:\kafka`).

2.  **Update Environment Variables**:

    - Add the path to the Kafka `bin\windows` directory to your system's `PATH` environment variable (e.g., `C:\kafka\bin\windows`). This will allow you to run the Kafka scripts from any command prompt.

3.  **Start Zookeeper**:

    - Open a new command prompt.
    - Navigate to your Kafka installation directory.
    - Run the following command to start the Zookeeper server:

      ```bash
      zookeeper-server-start.bat .\config\zookeeper.properties
      ```

4.  **Start Kafka Server**:

    - Open another new command prompt.
    - Navigate to your Kafka installation directory.
    - Run the following command to start the Kafka server:

      ```bash
      kafka-server-start.bat .\config\server.properties
      ```

5.  **Configure the services:**

    In the `.env` file of each service that uses Kafka, set the `KAFKA_BROKERS` variable to `localhost:9092`.

### Usage

#### Producing Events

To produce an event, a service uses the `kafkajs` library to send a message to a specific topic. For example, in the `SalesService`, after a successful transaction, a message is sent to the `pos-transaction` topic.

**Steps to Produce an Event:**

1. Install KafkaJS:

   ```bash
   npm install kafkajs
   ```

2. Create a producer instance:

   ```javascript
   const { Kafka } = require("kafkajs");

   const kafka = new Kafka({
     clientId: "sales-service",
     brokers: ["localhost:9092"],
   });

   const producer = kafka.producer();

   const produceEvent = async () => {
     await producer.connect();
     await producer.send({
       topic: "pos-transaction",
       messages: [
         {
           key: "transactionId",
           value: JSON.stringify({
             id: "txn123",
             amount: 500,
             customer: "cust001",
           }),
         },
       ],
     });
     await producer.disconnect();
   };

   produceEvent().catch(console.error);
   ```

#### Consuming Events

To consume events, a service creates a Kafka consumer and subscribes to one or more topics. The consumer will then receive messages from the subscribed topics and can process them accordingly. For example, the `InventoryService` has a consumer that listens to the `pos-transaction` and `purchase-order` topics.

**Steps to Consume Events:**

1. Create a consumer instance:

   ```javascript
   const { Kafka } = require("kafkajs");

   const kafka = new Kafka({
     clientId: "inventory-service",
     brokers: ["localhost:9092"],
   });

   const consumer = kafka.consumer({ groupId: "inventory-group" });

   const consumeEvents = async () => {
     await consumer.connect();
     await consumer.subscribe({
       topic: "pos-transaction",
       fromBeginning: true,
     });

     await consumer.run({
       eachMessage: async ({ topic, partition, message }) => {
         console.log({
           partition,
           offset: message.offset,
           value: message.value.toString(),
         });
       },
     });
   };

   consumeEvents().catch(console.error);
   ```

With these producer and consumer setups, the Eislagger microservices can communicate asynchronously through Kafka topics.
