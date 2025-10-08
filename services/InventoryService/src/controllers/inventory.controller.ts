import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendEvent } from "../kafka/kafka.ts";

const prisma = new PrismaClient();

// Helper function for error handling
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Helper to generate invoice numbers
const generateInvoiceNumber = (): string => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `INV-${timestamp}-${random}`;
};

// --- FACTORY MANAGEMENT ---

export const getAllFactories = async (req: Request, res: Response) => {
  try {
    const { status, managerId, limit = 20, offset = 0 } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (managerId) where.managerId = managerId;

    const [factories, totalCount] = await Promise.all([
      prisma.factory.findMany({
        where,
        include: {
          stockItems: {
            select: {
              quantity: true,
              status: true,
            },
          },
          _count: {
            select: {
              stockItems: true,
              invoices: true,
            },
          },
        },
        skip: Number(offset),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.factory.count({ where }),
    ]);

    // Calculate factory metrics
    const factoriesWithMetrics = factories.map(factory => {
      const stockItems = factory.stockItems;
      const totalStock = stockItems.reduce((sum, item) => sum + item.quantity, 0);
      const approvedStock = stockItems.filter(item => item.status === 'Approved').length;

      return {
        ...factory,
        metrics: {
          totalStockItems: factory._count.stockItems,
          totalInvoices: factory._count.invoices,
          totalStockQuantity: totalStock,
          approvedItemsRatio: stockItems.length > 0 ? approvedStock / stockItems.length : 0,
        },
      };
    });

    res.json({
      success: true,
      factories: factoriesWithMetrics,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });
  } catch (error) {
    console.error("GetAllFactories error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting factories",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getFactory = async (req: Request, res: Response) => {
  try {
    const { factoryId } = req.params;

    const factory = await prisma.factory.findUnique({
      where: { id: factoryId },
      include: {
        stockItems: {
          include: {
            flavor: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!factory) {
      return res.status(404).json({
        success: false,
        error: {
          code: "FACTORY_NOT_FOUND",
          message: "Factory not found",
        },
      });
    }

    // Calculate factory statistics
    const totalActiveStock = factory.stockItems.filter(item => item.status !== 'Expired').length;
    const totalProductionValue = factory.stockItems.reduce((sum, item) => 
      sum + Number(item.quantity) * Number(item.cost), 0);
    const budgetUtilization = factory.budget > 0 ? 
      Math.min(100, (Number(totalProductionValue) / Number(factory.budget)) * 100) : 0;

    res.json({
      success: true,
      factory: {
        ...factory,
        statistics: {
          totalActiveStock,
          totalProductionValue,
          budgetUtilization: Math.round(budgetUtilization * 100) / 100,
        },
      },
    });
  } catch (error) {
    console.error("GetFactory error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting factory",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const updateFactoryBudget = async (req: Request, res: Response) => {
  try {
    const { factoryId } = req.params;
    const { budget } = req.body;

    const factory = await prisma.factory.update({
      where: { id: factoryId },
      data: {
        budget,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      factory,
      message: "Factory budget updated successfully",
    });

    // Send Kafka event
    await sendEvent({
      topic: "BUDGET_ALLOCATION_UPDATED",
      message: {
        factoryId,
        newBudget: budget,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("UpdateFactoryBudget error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating factory budget",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getFactoryAnalytics = async (req: Request, res: Response) => {
  try {
    const { factoryId } = req.params;
    const { period = 'month' } = req.query;

    const factory = await prisma.factory.findUnique({
      where: { id: factoryId },
    });

    if (!factory) {
      return res.status(404).json({
        success: false,
        error: {
          code: "FACTORY_NOT_FOUND",
          message: "Factory not found",
        },
      });
    }

    // Get date range based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get production analytics
    const stockItems = await prisma.stockItem.findMany({
      where: {
        factoryId,
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        flavor: true,
      },
    });

    // Calculate metrics
    const totalProduction = stockItems.reduce((sum, item) => sum + item.quantity, 0);
    const averageQuality = stockItems.length > 0 ? 
      stockItems.reduce((sum, item) => sum + item.qualityGrade.charCodeAt(0) - 64, 0) / stockItems.length : 0;
    
    // Popular flavors analysis
    const flavorCounts: Record<string, number> = {};
    stockItems.forEach(item => {
      const flavor = item.flavor.name;
      flavorCounts[flavor] = (flavorCounts[flavor] || 0) + item.quantity;
    });

    const topFlavors = Object.entries(flavorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    // Daily production trends
    const dailyProduction = stockItems.reduce((acc, item) => {
      const date = item.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      factoryId,
      period,
      analytics: {
        totalProduction,
        averageQualityGrade: String.fromCharCode(Math.round(averageQuality) + 64), // Convert to letter grade
        itemsProduced: stockItems.length,
        topFlavorsByVolume: topFlavors,
        dailyProductionTrends: dailyProduction,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("GetFactoryAnalytics error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting factory analytics",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- STOCK MANAGEMENT ---

export const createStockItem = async (req: Request, res: Response) => {
  try {
    const { factoryId } = req.params;
    const { 
      flavorId, 
      batchNumber, 
      quantity, 
      cost, 
      expiryDate,
      qualityGrade = 'A',
      notes 
    } = req.body;

    // Verify factory exists
    const factory = await prisma.factory.findUnique({
      where: { id: factoryId },
    });

    if (!factory) {
      return res.status(404).json({
        success: false,
        error: {
          code: "FACTORY_NOT_FOUND",
          message: "Factory not found",
        },
      });
    }

    // Verify flavor exists
    const flavor = await prisma.flavor.findUnique({
      where: { id: flavorId },
    });

    if (!flavor) {
      return res.status(404).json({
        success: false,
        error: {
          code: "FLAVOR_NOT_FOUND",
          message: "Flavor not found",
        },
      });
    }

    const stockItem = await prisma.stockItem.create({
      data: {
        factoryId,
        flavorId,
        batchNumber,
        quantity,
        cost,
        expiryDate: new Date(expiryDate),
        qualityGrade,
        notes,
        status: 'Produced',
      },
      include: {
        flavor: true,
        factory: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      stockItem,
      message: "Stock item created successfully",
    });

    // Send Kafka event
    await sendEvent({
      topic: "STOCK_REGISTERED",
      message: {
        stockItemId: stockItem.id,
        factoryId,
        flavorId,
        quantity,
        batchNumber,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("CreateStockItem error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error creating stock item",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getFactoryStockItems = async (req: Request, res: Response) => {
  try {
    const { factoryId } = req.params;
    const { status, qualityGrade, limit = 20, offset = 0 } = req.query;

    const where: any = { factoryId };
    if (status) where.status = status;
    if (qualityGrade) where.qualityGrade = qualityGrade;

    const [stockItems, totalCount] = await Promise.all([
      prisma.stockItem.findMany({
        where,
        include: {
          flavor: {
            select: {
              name: true,
              category: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: Number(offset),
        take: Number(limit),
      }),
      prisma.stockItem.count({ where }),
    ]);

    res.json({
      success: true,
      stockItems,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });
  } catch (error) {
    console.error("GetFactoryStockItems error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting stock items",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const updateStockItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;

    const stockItem = await prisma.stockItem.update({
      where: { id: itemId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
      include: {
        flavor: true,
        factory: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      stockItem,
      message: "Stock item updated successfully",
    });

    // Send Kafka event
    await sendEvent({
      topic: "STOCK_UPDATED",
      message: {
        stockItemId: itemId,
        updates,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("UpdateStockItem error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating stock item",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const deleteStockItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    await prisma.stockItem.delete({
      where: { id: itemId },
    });

    res.status(204).json({
      success: true,
      message: "Stock item deleted successfully",
    });

    // Send Kafka event
    await sendEvent({
      topic: "STOCK_DELETED",
      message: {
        stockItemId: itemId,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("DeleteStockItem error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error deleting stock item",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const updateStockItemExpiry = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { expiryDate, notificationSettings } = req.body;

    const stockItem = await prisma.stockItem.update({
      where: { id: itemId },
      data: {
        expiryDate: new Date(expiryDate),
        isExpired: new Date(expiryDate) < new Date(),
        updatedAt: new Date(),
      },
      include: {
        flavor: true,
      },
    });

    res.json({
      success: true,
      stockItem,
      message: "Stock item expiry updated successfully",
    });

    // Send Kafka event for expiry notification
    await sendEvent({
      topic: "EXPIRY_WARNING",
      message: {
        stockItemId: itemId,
        expiryDate: expiryDate,
        flavorName: stockItem.flavor.name,
        notificationSettings,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("UpdateStockItemExpiry error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating stock item expiry",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- FLAVOR CATALOG ---

export const getAllFlavors = async (req: Request, res: Response) => {
  try {
    const { category, isActive, manufacturerId, limit = 150, offset = 0 } = req.query;
    // const { category, isActive, manufacturerId } = req.query;
    
    const where: any = {};
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (manufacturerId) where.manufacturerId = manufacturerId;

    const [flavors, totalCount] = await Promise.all([
      prisma.flavor.findMany({
        where,
        orderBy: [
          { category: 'asc' },
          { name: 'asc' },
        ],
        skip: Number(offset),
        take: Number(limit),
      }),
      prisma.flavor.count({ where }),
    ]);

    res.json({
      success: true,
      flavors,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });
  } catch (error) {
    console.error("GetAllFlavors error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting flavors",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const createFlavor = async (req: Request, res: Response) => {
  try {
    const flavorData = req.body;

    const flavor = await prisma.flavor.create({
      data: {
        ...flavorData,
        manufacturerId: req.user?.id,
      },
    });

    res.status(201).json({
      success: true,
      flavor,
      message: "Flavor created successfully",
    });

  } catch (error) {
    console.error("CreateFlavor error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error creating flavor",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
}; 

export const getFlavor = async (req: Request, res: Response) => {
  try {
    const { flavorId } = req.params;

    const flavor = await prisma.flavor.findUnique({
      where: { id: flavorId },
      include: {
        stockItems: {
          select: {
            quantity: true,
            status: true,
            factoryId: true,
          },
        },
      },
    });

    if (!flavor) {
      return res.status(404).json({
        success: false,
        error: {
          code: "FLAVOR_NOT_FOUND",
          message: "Flavor not found",
        },
      });
    }

    // Calculate flavor statistics
    const totalStock = flavor.stockItems.reduce((sum, item) => sum + item.quantity, 0);
    const activeStock = flavor.stockItems.filter(item => item.status !== 'Expired').length;

    res.json({
      success: true,
      flavor: {
        ...flavor,
        statistics: {
          totalStockQuantity: totalStock,
          activeStockItems: activeStock,
          totalFactories: new Set(flavor.stockItems.map(item => item.factoryId)).size,
        },
      },
    });
  } catch (error) {
    console.error("GetFlavor error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting flavor",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const updateFlavor = async (req: Request, res: Response) => {
  try {
    const { flavorId } = req.params;
    const updates = req.body;

    const flavor = await prisma.flavor.update({
      where: { id: flavorId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      flavor,
      message: "Flavor updated successfully",
    });

  } catch (error) {
    console.error("UpdateFlavor error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating flavor",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const deleteFlavor = async (req: Request, res: Response) => {
  try {
    const { flavorId } = req.params;

    // Soft delete by setting isActive to false
    const flavor = await prisma.flavor.update({
      where: { id: flavorId },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      flavor,
      message: "Flavor archived successfully",
    });

  } catch (error) {
    console.error("DeleteFlavor error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error archiving flavor",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- INVOICE MANAGEMENT ---

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { shopId, items, dueDate, notes } = req.body;

    const invoiceNumber = generateInvoiceNumber();

    // Calculate totals
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const stockItem = await prisma.stockItem.findUnique({
        where: { id: item.stockItemId },
        include: { flavor: true },
      });

      if (!stockItem) {
        throw new Error(`Stock item ${item.stockItemId} not found`);
      }

      const itemTotal = Number(stockItem.cost) * item.quantity;
      subtotal += itemTotal;

      processedItems.push({
        stockItemId: item.stockItemId,
        flavorId: stockItem.flavorId,
        quantity: item.quantity,
        unitPrice: stockItem.cost,
        totalPrice: itemTotal,
      });
    }

    const taxAmount = subtotal * 0.08; // 8% tax
    const totalAmount = subtotal + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        shopId,
        factoryId: req.body.factoryId,
        subtotal,
        taxAmount,
        totalAmount,
        dueDate: new Date(dueDate),
        notes,
        items: {
          create: processedItems,
        },
      },
      include: {
        items: {
          include: {
            stockItem: {
              include: {
                flavor: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      invoice,
      message: "Invoice created successfully",
    });

    // Send Kafka event
    await sendEvent({
      topic: "INVOICE_GENERATED",
      message: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        shopId,
        totalAmount,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("CreateInvoice error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error creating invoice",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getInvoice = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        items: {
          include: {
            stockItem: {
              include: {
                flavor: true,
              },
            },
          },
        },
        factory: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: {
          code: "INVOICE_NOT_FOUND",
          message: "Invoice not found",
        },
      });
    }

    res.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("GetInvoice error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting invoice",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const updateInvoiceStatus = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.params;
    const { status } = req.body;

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status,
        paymentDate: status === 'Paid' ? new Date() : null,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      invoice,
      message: "Invoice status updated successfully",
    });

  } catch (error) {
    console.error("UpdateInvoiceStatus error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating invoice status",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const { status, factoryId, shopId, limit = 20, offset = 0 } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (factoryId) where.factoryId = factoryId;
    if (shopId) where.shopId = shopId;

    const [invoices, totalCount] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          factory: {
            select: {
              name: true,
            },
          },
          items: {
            select: {
              quantity: true,
              totalPrice: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: Number(offset),
        take: Number(limit),
      }),
      prisma.invoice.count({ where }),
    ]);

    res.json({
      success: true,
      invoices,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });
  } catch (error) {
    console.error("GetAllInvoices error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting invoices",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- SUPPLIER MANAGEMENT ---

export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const { specialties, isActive, limit = 20, offset = 0 } = req.query;
    
    const where: any = {};
    if (specialties) {
      where.specialties = {
        has: specialties as string,
      };
    }
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const [suppliers, totalCount] = await Promise.all([
      prisma.supplier.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: Number(offset),
        take: Number(limit),
      }),
      prisma.supplier.count({ where }),
    ]);

    res.json({
      success: true,
      suppliers,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });
  } catch (error) {
    console.error("GetAllSuppliers error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting suppliers",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const supplierData = req.body;

    const supplier = await prisma.supplier.create({
      data: supplierData,
    });

    res.status(201).json({
      success: true,
      supplier,
      message: "Supplier created successfully",
    });

  } catch (error) {
    console.error("CreateSupplier error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error creating supplier",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.params;
    const updates = req.body;

    const supplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      supplier,
      message: "Supplier updated successfully",
    });

  } catch (error) {
    console.error("UpdateSupplier error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating supplier",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Health check endpoint
export const healthCheck = (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Inventory Service is healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
};

// Removed unused Kafka consumer stub
