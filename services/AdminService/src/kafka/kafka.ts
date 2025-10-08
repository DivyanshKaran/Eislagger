import {Kafka} from "kafkajs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Kafka client configuration
const kafkaClient = new Kafka({
  clientId: "admin-service",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
});

const producer = kafkaClient.producer();
const consumer = kafkaClient.consumer({ groupId: "admin-service-group" });

// Producer functions
export const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("✅ Kafka Producer connected to Admin Service");
  } catch (error) {
    console.error("❌ Failed to connect Kafka Producer:", error);
    throw error;
  }
};

export const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    console.log("✅ Kafka Producer disconnected from Admin Service");
  } catch (error) {
    console.error("❌ Failed to disconnect Kafka Producer:", error);
    throw error;
  }
};

export const sendEvent = async (event: { topic: string; message: any }) => {
  try {
    await producer.send({
      topic: event.topic,
      messages: [
        {
          key: event.message.userId || event.message.maintenanceId || event.message.broadcastId || 'general',
          value: JSON.stringify(event.message),
          timestamp: Date.now().toString(),
        },
      ],
    });
    console.log(`📤 Admin Service sent event to ${event.topic}:`, event.message);
  } catch (error) {
    console.error(`❌ Failed to send event to ${event.topic}:`, error);
    throw error;
  }
};

// Consumer functions
export const connectConsumer = async () => {
  console.log("🚀 Starting Kafka Consumer for Admin Service...");
  
  try {
    await consumer.connect();
    console.log("✅ Kafka Consumer connected to Admin Service");
    
    // Subscribe to topics that this service consumes for audit logging
    const topics = [
      "USER_REGISTERED",
      "USER_LOGIN",
      "USER_LOGOUT",
      "USER_ROLE_CHANGED",
      "POS_TRANSACTION",
      "STOCK_REGISTERED",
      "INVOICE_GENERATED",
      "SYSTEM_ERROR",
      "SECURITY_EVENT"
    ];
    
    await consumer.subscribe({ topics, fromBeginning: false });
    console.log(`✅ Admin Service subscribed to topics: ${topics.join(", ")}`);
    
    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const eventData = JSON.parse(message.value?.toString() || "{}");
          console.log(`📥 Admin Service received event from ${topic}:`, eventData);
          
          // Route events to audit log handler
          await handleAuditEvent(topic, eventData);
          
        } catch (error) {
          console.error(`❌ Error processing message from ${topic}:`, error);
        }
      },
    });
    
  } catch (error) {
    console.error("❌ Failed to connect Kafka Consumer:", error);
    throw error;
  }
};

export const disconnectConsumer = async () => {
  try {
    await consumer.disconnect();
    console.log("✅ Kafka Consumer disconnected from Admin Service");
  } catch (error) {
    console.error("❌ Failed to disconnect Kafka Consumer:", error);
    throw error;
  }
};

// Event handlers for incoming Kafka events (audit logging)
const handleAuditEvent = async (topic: string, eventData: any) => {
  try {
    let auditAction = '';
    let resource = '';
    let userId = '';
    let status = 'SUCCESS';
    let tags = ['KAFKA_EVENT'];
    let message = '';

    // Map topics to audit log structure
    switch (topic) {
      case "USER_REGISTERED":
        auditAction = 'CREATE';
        resource = 'USER';
        userId = eventData.userId;
        message = `User registered: ${eventData.email}`;
        tags.push('USER_REGISTRATION');
        break;
        
      case "USER_LOGIN":
        auditAction = 'LOGIN';
        resource = 'USER';
        userId = eventData.userId;
        message = `User logged in from ${eventData.ipAddress || 'unknown IP'}`;
        tags.push('AUTHENTICATION');
        break;
        
      case "USER_LOGOUT":
        auditAction = 'LOGOUT';
        resource = 'USER';
        userId = eventData.userId;
        message = 'User logged out';
        tags.push('AUTHENTICATION');
        break;
        
      case "USER_ROLE_CHANGED":
        auditAction = 'ROLE_CHANGE';
        resource = 'USER';
        userId = eventData.userId;
        message = `User role changed from ${eventData.oldRole} to ${eventData.newRole}`;
        tags.push('ADMIN_ACTION', 'USER_MANAGEMENT');
        break;
        
      case "POS_TRANSACTION":
        auditAction = 'CREATE';
        resource = 'POS_TRANSACTION';
        userId = eventData.clerkId;
        message = `POS transaction created for ${eventData.totalAmount} by shop ${eventData.shopId}`;
        tags.push('SALES', 'TRANSACTION');
        break;
        
      case "STOCK_REGISTERED":
        auditAction = 'CREATE';
        resource = 'STOCK_ITEM';
        userId = eventData.userId;
        message = `Stock item registered: ${eventData.quantity} units of ${eventData.flavorName}`;
        tags.push('INVENTORY', 'PRODUCTION');
        break;
        
      case "INVOICE_GENERATED":
        auditAction = 'CREATE';
        resource = 'INVOICE';
        userId = eventData.generatedBy;
        message = `Invoice generated for ${eventData.totalAmount} from factory ${eventData.factoryId}`;
        tags.push('INVENTORY', 'FINANCE');
        break;
        
      case "SYSTEM_ERROR":
        auditAction = 'ERROR';
        resource = 'SYSTEM';
        userId = eventData.userId;
        status = 'FAILURE';
        message = `System error: ${eventData.errorMessage}`;
        tags.push('SYSTEM_ERROR', 'ERROR_HANDLING');
        break;
        
      case "SECURITY_EVENT":
        auditAction = 'SECURITY_EVENT';
        resource = 'SECURITY';
        userId = eventData.userId;
        message = `Security event: ${eventData.eventType}`;
        tags.push('SECURITY', eventData.severity || 'MEDIUM');
        
        // Create security event record
        await prisma.securityEvent.create({
          data: {
            eventType: eventData.eventType as any,
            severity: eventData.severity as any || 'MEDIUM',
            userId: eventData.userId,
            ipAddress: eventData.ipAddress,
            userAgent: eventData.userAgent,
            description: message,
            endpoint: eventData.endpoint,
          },
        });
        break;
        
      default:
        auditAction = 'UNKNOWN_ACTION';
        resource = 'SYSTEM';
        message = `Unknown event type: ${topic}`;
        tags.push('UNKNOWN');
    }

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        userId,
        action: auditAction,
        resource,
        resourceId: eventData.id || eventData.userId || eventData.transactionId,
        status: status as any,
        message,
        tags,
        ipAddress: eventData.ipAddress,
        userAgent: eventData.userAgent,
        endpoint: eventData.endpoint,
        newValues: eventData,
        createdAt: new Date(eventData.timestamp || Date.now()),
      },
    });

    // Create system metric for high-level activity tracking
    await prisma.systemMetric.create({
      data: {
        service: 'ADMIN_SERVICE',
        metric: `${topic}_PROCESSED`,
        value: 1,
        tags: {
          eventType: topic,
          resourceType: resource,
          userId,
        },
      },
    });

    console.log(`✅ Audit logged for ${topic}: ${auditAction} on ${resource}`);

  } catch (error) {
    console.error(`❌ Error handling audit event ${topic}:`, error);
  }
};

// Metrics collection functions
export const collectSystemMetrics = async () => {
  try {
    // Collect memory usage
    const memoryUsage = process.memoryUsage();
    
    await prisma.systemMetric.createMany({
      data: [
        {
          service: 'ADMIN_SERVICE',
          metric: 'MEMORY_USAGE',
          value: memoryUsage.heapUsed / 1024 / 1024, // MB
          tags: { type: 'heap_used' },
        },
        {
          service: 'ADMIN_SERVICE',
          metric: 'MEMORY_USAGE',
          value: memoryUsage.heapTotal / 1024 / 1024, // MB
          tags: { type: 'heap_total' },
        },
        {
          service: 'ADMIN_SERVICE',
          metric: 'CPU_USAGE',
          value: process.cpuUsage().user / 1000000, // seconds
          tags: { type: 'cpu_user' },
        },
        {
          service: 'ADMIN_SERVICE',
          metric: 'SYSTEM_UPTIME',
          value: process.uptime(), // seconds
          tags: { type: 'uptime' },
        },
      ],
    });

    console.log("✅ System metrics collected");
  } catch (error) {
    console.error("❌ Error collecting system metrics:", error);
  }
};

// Start periodic metrics collection
setInterval(collectSystemMetrics, 60000); // Every minute

export default {
  connectProducer,
  disconnectProducer,
  sendEvent,
  connectConsumer,
  disconnectConsumer,
  collectSystemMetrics,
};

