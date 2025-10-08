import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const startMetricsCollection = () => {
  console.log("📊 Starting metrics collection service...");
  
  // Collect metrics every hour
  setInterval(async () => {
    console.log("🔄 Collecting metrics from other services...");
    
    try {
      await collectSalesMetrics();
      await collectInventoryMetrics();
      await collectLocationMetrics();
      await collectCommunicationMetrics();
      
      console.log("✅ Metrics collection completed");
    } catch (error) {
      console.error("❌ Metrics collection failed:", error);
    }
  }, 60 * 60 * 1000); // Every hour
};

const collectSalesMetrics = async () => {
  // Mock data - in real implementation, this would call other services
  const salesData = {
    metricKey: "revenue_today",
    metricName: "Today's Revenue",
    description: "Total revenue generated today",
    value: 15000.50,
    unit: "$",
    category: "SALES" as any,
    reportingPeriod: "DAILY" as any,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    dataSource: "sales-service"
  };

  await prisma.dashboardMetric.upsert({
    where: { metricKey: salesData.metricKey },
    update: salesData,
    create: salesData,
  });
};

const collectInventoryMetrics = async () => {
  const inventoryData = {
    metricKey: "stock_level_average",
    metricName: "Average Stock Level",
    description: "Average stock level across all products",
    value: 85.5,
    unit: "%",
    category: "INVENTORY" as any,
    reportingPeriod: "DAILY" as any,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    dataSource: "inventory-service"
  };

  await prisma.dashboardMetric.upsert({
    where: { metricKey: inventoryData.metricKey },
    update: inventoryData,
    create: inventoryData,
  });
};

const collectLocationMetrics = async () => {
  const locationData = {
    metricKey: "locations_active",
    metricName: "Active Locations",
    description: "Number of active retail locations",
    value: 12,
    unit: "locations",
    category: "LOCATION" as any,
    reportingPeriod: "DAILY" as any,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    dataSource: "locations-service"
  };

  await prisma.dashboardMetric.upsert({
    where: { metricKey: locationData.metricKey },
    update: locationData,
    create: locationData,
  });
};

const collectCommunicationMetrics = async () => {
  const commData = {
    metricKey: "messages_today",
    metricName: "Messages Today",
    description: "Total messages sent today",
    value: 285,
    unit: "messages",
    category: "OPERATIONAL" as any,
    reportingPeriod: "DAILY" as any,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    dataSource: "communications-service"
  };

  await prisma.dashboardMetric.upsert({
    where: { metricKey: commData.metricKey },
    update: commData,
    create: commData,
  });
};

