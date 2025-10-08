import{ Kafka} from "kafkajs";

// Kafka client configuration
const kafkaClient = new Kafka({
  clientId: "inventory-service",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
});

const producer = kafkaClient.producer();
const consumer = kafkaClient.consumer({ groupId: "inventory-service-group" });

// Producer functions
export const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("✅ Kafka Producer connected");
  } catch (error) {
    console.error("❌ Failed to connect Kafka Producer:", error);
    throw error;
  }
};

export const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    console.log("✅ Kafka Producer disconnected");
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
          key: event.message.stockItemId || event.message.factoryId || event.message.invoiceId || 'general',
          value: JSON.stringify(event.message),
          timestamp: Date.now().toString(),
        },
      ],
    });
    console.log(`📤 Event sent to ${event.topic}:`, event.message);
  } catch (error) {
    console.error(`❌ Failed to send event to ${event.topic}:`, error);
    throw error;
  }
};

// Consumer functions
export const connectConsumer = async () => {
  console.log("🚀 Starting Kafka Consumer...");
  
  try {
    await consumer.connect();
    console.log("✅ Kafka Consumer connected");
    
    // Subscribe to topics that this service consumes
    const topics = [
      "POS_TRANSACTION",
      "PURCHASE_ORDER_CREATED",
      "BUDGET_ALLOCATION_UPDATED"
    ];
    
    await consumer.subscribe({ topics, fromBeginning: false });
    console.log(`✅ Subscribed to topics: ${topics.join(", ")}`);
    
    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const eventData = JSON.parse(message.value?.toString() || "{}");
          console.log(`📥 Received event from ${topic}:`, eventData);
          
          // Route events to appropriate handlers
          await handleIncomingEvent(topic, eventData);
          
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
    console.log("✅ Kafka Consumer disconnected");
  } catch (error) {
    console.error("❌ Failed to disconnect Kafka Consumer:", error);
    throw error;
  }
};

// Event handlers for incoming Kafka events
const handleIncomingEvent = async (topic: string, eventData: any) => {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  
  try {
    switch (topic) {
      case "POS_TRANSACTION":
        await handlePosTransactionEvent(eventData, prisma);
        break;
        
      case "PURCHASE_ORDER_CREATED":
        await handlePurchaseOrderCreatedEvent(eventData, prisma);
        break;
        
      case "BUDGET_ALLOCATION_UPDATED":
        await handleBudgetAllocationUpdatedEvent(eventData, prisma);
        break;
        
      default:
        console.log(`⚠️ Unhandled event type: ${topic}`);
    }
  } catch (error) {
    console.error(`❌ Error handling ${topic} event:`, error);
  } finally {
    await prisma.disconnect();
  }
};

// Handle POS transaction events to update stock
const handlePosTransactionEvent = async (eventData: any, prisma: any) => {
  try {
    const { shopId, items, transactionId } = eventData;
    
    console.log(`📉 Processing stock reduction for transaction ${transactionId} at shop ${shopId}`);
    
    // Note: In a full implementation, this would update shop stock levels
    // by finding corresponding factory stock and marking it as shipped
    // For now, we'll just log the processing
    
    console.log("Stock items processed:", items);
    
    // Send acknowledgment event back to Sales Service
    await sendEvent({
      topic: "STOCK_UPDATED_AFTER_SALE",
      message: {
        transactionId,
        shopId,
        items,
        processedAt: new Date().toISOString(),
        status: "PROCESSED"
      }
    });
    
  } catch (error) {
    console.error("❌ Error processing POS transaction event:", error);
  }
};

// Handle purchase order events to create invoices
const handlePurchaseOrderCreatedEvent = async (eventData: any, prisma: any) => {
  try {
    const { shopId, items, clerkId, purchaseOrderId } = eventData;
    
    console.log(`🧾 Creating invoice for purchase order ${purchaseOrderId} from shop ${shopId}`);
    
    // Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
    
    // Calculate totals
    let subtotal = 0;
    const processedItems = [];
    
    for (const item of items) {
      // Find available stock items for this flavor
      const stockItems = await prisma.stockItem.findMany({
        where: {
          flavorId: item.flavorId,
          status: 'Approved',
          quantity: {
            gte: item.quantity
          }
        },
        orderBy: { createdAt: 'asc' }, // FIFO for expiring items first
        take: 1
      });
      
      if (stockItems.length === 0) {
        throw new Error(`No available stock for flavor ${item.flavorName}`);
      }
      
      const stockItem = stockItems[0];
      const itemTotal = Number(stockItem.cost) * item.quantity;
      subtotal += itemTotal;
      
      processedItems.push({
        stockItemId: stockItem.id,
        flavorId: item.flavorId,
        quantity: item.quantity,
        unitPrice: stockItem.cost,
        totalPrice: itemTotal,
      });
    }
    
    const taxAmount = subtotal * 0.08; // 8% tax
    const totalAmount = subtotal + taxAmount;
    
    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        factoryId: eventData.factoryId || 'default-factory',
        shopId,
        subtotal,
        taxAmount,
        totalAmount,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        notes: `Invoice for purchase order ${purchaseOrderId}`,
        items: {
          create: processedItems
        }
      },
      include: {
        items: {
          include: {
            stockItem: {
              include: {
                flavor: true
              }
            }
          }
        }
      }
    });
    
    console.log(`✅ Invoice ${invoiceNumber} created for purchase order ${purchaseOrderId}`);
    
    // Send invoice created event
    await sendEvent({
      topic: "INVOICE_GENERATED",
      message: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        purchaseOrderId,
        shopId,
        totalAmount,
        clerkId,
        timestamp: new Date().toISOString()
      }
    });
    
    // Update stock items status
    for (const item of processedItems) {
      await prisma.stockItem.update({
        where: { id: item.stockItemId },
        data: { 
          status: 'Shipped',
          updatedAt: new Date()
        }
      });
    }
    
  } catch (error) {
    console.error("❌ Error processing purchase order created event:", error);
  }
};

// Handle budget allocation updates
const handleBudgetAllocationUpdatedEvent = async (eventData: any, prisma: any) => {
  try {
    const { factoryId, newBudget, allocatedBy } = eventData;
    
    console.log(`💰 Updating budget allocation for factory ${factoryId} to ${newBudget}`);
    
    // Update factory budget
    await prisma.factory.update({
      where: { id: factoryId },
      data: {
        budget: newBudget,
        updatedAt: new Date()
      }
    });
    
    console.log(`✅ Budget updated for factory ${factoryId}`);
    
    // Send budget updated confirmation
    await sendEvent({
      topic: "BUDGET_UPDATED_CONFIRMATION",
      message: {
        factoryId,
        newBudget,
        allocatedBy,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error("❌ Error processing budget allocation event:", error);
  }
};

// Removed unused exported consumeEvent map and default export
