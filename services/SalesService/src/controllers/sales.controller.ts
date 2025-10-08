import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendAuditLog } from "../kafka/kafka.ts";

const prisma = new PrismaClient();

// Helper function for error handling
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// Helper to generate transaction/order numbers
const generateNumber = (prefix: string): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// --- SHOP MANAGEMENT ---

export const getAllShops = async (req: Request, res: Response) => {
  try {
    const { status, managerId, limit = 10, offset = 0 } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (managerId) where.managerId = managerId;

    const [shops, totalCount] = await Promise.all([
      prisma.shop.findMany({
        where,
        include: {
          stock: true,
          transactions: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        skip: Number(offset),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.shop.count({ where }),
    ]);

    // Calculate average ratings for shops
    const shopsWithRatings = shops.map(shop => {
      const ratings = shop.reviews.map(r => r.rating);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

      return {
        ...shop,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: ratings.length,
      };
    });

    res.json({
      success: true,
      shops: shopsWithRatings,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });
  } catch (error) {
    console.error("GetAllShops error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting shops",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const createShop = async (req: Request, res: Response) => {
  try {
    const { name, location, address, phone, email, managerId, hours, services, capacity } = req.body;

    const shop = await prisma.shop.create({
      data: {
        name,
        location,
        address,
        phone,
        email,
        managerId,
        hours: hours || {},
        services: services || ["dine-in"],
        capacity: capacity || 50,
      },
    });

    res.status(201).json({
      success: true,
      shop,
      message: "Shop created successfully",
    });

    // Send audit log
    await sendAuditLog({
      eventType: "SHOP_CREATED",
      timestamp: new Date().toISOString(),
      sourceService: "SalesService",
      userId: managerId || req.user?.id,
      details: {
        shopId: shop.id,
        shopName: shop.name,
        location: shop.location,
      },
    });
  } catch (error) {
    console.error("CreateShop error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error creating shop",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getShop = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        stock: true,
        transactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            items: true,
          },
        },
        purchaseOrders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        error: {
          code: "SHOP_NOT_FOUND",
          message: "Shop not found)",
        },
      });
    }

    // Calculate shop statistics
    const totalRevenue = await prisma.posTransaction.aggregate({
      where: { shopId },
      _sum: { totalAmount: true },
    });

    const totalTransactions = await prisma.posTransaction.count({
      where: { shopId },
    });

    const averageRating = await prisma.review.aggregate({
      where: { shopId },
      _avg: { rating: true },
    });

    res.json({
      success: true,
      shop: {
        ...shop,
        statistics: {
          totalRevenue: totalRevenue._sum.totalAmount || 0,
          totalTransactions,
          averageRating: averageRating._avg.rating || 0,
          reviewCount: shop.reviews.length,
        },
      },
    });
  } catch (error) {
    console.error("GetShop error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting shop",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const updateShop = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const updates = req.body;

    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      shop,
      message: "Shop updated successfully",
    });

    // Store audit log
    await sendAuditLog({
      eventType: "SHOP_UPDATED",
      timestamp: new Date().toISOString(),
      sourceService: "SalesService",
      userId: req.user?.id,
      details: {
        shopId,
        updates,
      },
    });
  } catch (error) {
    console.error("UpdateShop error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: 'Error updating shop',
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const deleteShop = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;

    await prisma.shop.delete({
      where: { id: shopId },
    });

    res.status(204).json({
      success: true,
      message: "Shop deleted successfully",
    });

    // Store audit log
    await sendAuditLog({
      eventType: "SHOP_DELETED",
      timestamp: new Date().toISOString(),
      sourceService: "SalesService",
      userId: req.user?.id,
      details: { shopId },
    });
  } catch (error) {
    console.error("DeleteShop error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error deleting shop",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- ANALYTICS ---

export const getShopAnalytics = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const { period = 'month' } = req.query;

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        error: {
          code: "SHOP_NOT_FOUND",
          message: "Shop not found",
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

    // Get transaction analytics
    const transactions = await prisma.posTransaction.findMany({
      where: {
        shopId,
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        items: true,
      },
    });

    // Calculate metrics
    const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.totalAmount), 0);
    const transactionCount = transactions.length;
    const averageTransactionValue = transactionCount > 0 ? totalRevenue / transactionCount : 0;
    
    // Most popular items
    const itemCounts: Record<string, number> = {};
    transactions.forEach(transaction => {
      transaction.items.forEach(item => {
        const key = `${item.flavorName}-${item.flavorId}`;
        itemCounts[key] = (itemCounts[key] || 0) + item.quantity;
      });
    });

    const popularItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key, count]) => {
        const [name, id] = key.split('-');
        return { flavorId: id, flavorName: name, quantity: count };
      });

    // Daily revenue trends
    const dailyRevenue = transactions.reduce((acc, transaction) => {
      const date = transaction.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + Number(transaction.totalAmount);
      return acc;
    }, {} as Record<string, number>);

    const response = {
      success: true,
      shopId,
      period,
      metrics: {
        totalRevenue,
        transactionCount,
        averageTransactionValue,
      },
      popularItems,
      dailyRevenue,
      timestamp: new Date().toISOString(),
    };

    res.json(response);

    // Send audit log
    await sendAuditLog({
      eventType: "ANALYTICS_VIEWED",
      timestamp: new Date().toISOString(),
      sourceService: "SalesService",
      userId: req.user?.id,
      details: { shopId, period },
    });

  } catch (error) {
    console.error("GetShopAnalytics error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting shop analytics",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- MENU AND INVENTORY ---

export const getShopMenu = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;

    const menu = await prisma.shopStock.findMany({
      where: { 
        shopId,
        isAvailable: true,
      },
      select: {
        id: true,
        flavorId: true,
        flavorName: true,
        flavorDescription: true,
        category: true,
        pricePerUnit: true,
        unit: true,
        allergies: true,
        quantity: true,
      },
      orderBy: [
        { category: 'asc' },
        { flavorName: 'asc' },
      ],
    });

    res.json({
      success: true,
      menu,
      shopId,
    });
  } catch (error) {
    console.error("GetShopMenu error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting shop menu",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getShopInventory = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;

    const inventory = await prisma.shopStock.findMany({
      where: { shopId },
      include: {
        shop: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { category: 'asc' },
        { flavorName: 'asc' },
      ],
    });

    // Add stock level indicators
    const inventoryWithAlerts = inventory.map(item => ({
      ...item,
      stockLevel: item.quantity <= item.minQuantity ? 'low' : 
                  item.quantity >= item.maxQuantity ? 'high' : 'normal',
      isLowStock: item.quantity <= item.minQuantity,
      isOutOfStock: item.quantity <= 0,
    }));

    res.json({
      success: true,
      inventory: inventoryWithAlerts,
      shopId,
      summary: {
        totalItems: inventory.length,
        lowStockItems: inventoryWithAlerts.filter(item => item.isLowStock).length,
        outOfStockItems: inventoryWithAlerts.filter(item => item.isOutOfStock).length,
      },
    });
  } catch (error) {
    console.error("GetShopInventory error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting shop inventory",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const updateShopStock = async (req: Request, res: Response) => {
  try {
    const { shopId, stockId } = req.params;
    const { quantity, pricePerUnit, isAvailable, minQuantity, maxQuantity } = req.body;

    const stock = await prisma.shopStock.update({
      where: { id: stockId },
      data: {
        quantity,
        pricePerUnit,
        isAvailable,
        minQuantity,
        maxQuantity,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      stock,
      message: "Stock updated successfully",
    });

    // Send audit log
    await sendAuditLog({
      eventType: "STOCK_UPDATED",
      timestamp: new Date().toISOString(),
      sourceService: "SalesService",
      userId: req.user?.id,
      details: { shopId, stockId, updates: req.body },
    });

  } catch (error) {
    console.error("UpdateShopStock error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating stock",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- POS TRANSACTIONS ---

export const createPosTransaction = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const { 
      items, 
      clerkId, 
      patronId, 
      customerInfo = {},
      paymentMethod = 'cash',
      discountAmount = 0,
      taxRate = 0.08
    } = req.body;

    const transaction = await prisma.$transaction(async (tx) => {
      let subtotal = 0;

      // Process each item
      const processedItems = [];
      for (const item of items) {
        const stock = await tx.shopStock.findFirst({
          where: {
            shopId,
            flavorId: item.flavorId,
          },
        });

        if (!stock) {
          throw new Error(`Flavor ${item.flavorName} not available at this shop`);
        }

        if (stock.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.flavorName}. Available: ${stock.quantity}`);
        }

        const itemTotal = Number(stock.pricePerUnit) * item.quantity;
        subtotal += itemTotal;

        processedItems.push({
          stockId: stock.id,
          flavorId: stock.flavorId,
          flavorName: stock.flavorName,
          quantity: item.quantity,
          unitPrice: stock.pricePerUnit,
          totalPrice: itemTotal,
          customizations: item.customizations || [],
        });
      }

      // Calculate totals
      const taxAmount = subtotal * taxRate;
      const totalAmount = subtotal + taxAmount - discountAmount;

      // Generate transaction number
      const transactionNumber = generateNumber('TXN');

      // Create transaction
      const newTransaction = await tx.posTransaction.create({
        data: {
          shopId,
          transactionNumber,
          clerkId,
          patronId,
          subtotal,
          taxAmount,
          discountAmount,
          totalAmount,
          paymentMethod,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          items: {
            create: processedItems.map(item => ({
              stockId: item.stockId,
              flavorId: item.flavorId,
              flavorName: item.flavorName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              customizations: item.customizations,
            })),
          },
        },
        include: {
          items: true,
          shop: {
            select: {
              name: true,
              location: true,
            },
          },
        },
      });

      // Update stock levels
      for (const item of processedItems) {
        await tx.shopStock.update({
          where: { id: item.stockId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newTransaction;
    });

    res.status(201).json({
      success: true,
      transaction,
      message: "Transaction completed successfully",
    });

    // Send Kafka event
    await sendAuditLog({
      eventType: "POS_TRANSACTION_COMPLETED",
      timestamp: new Date().toISOString(),
      sourceService: "SalesService",
      userId: clerkId,
      details: {
        shopId,
        transactionId: transaction.id,
        transactionNumber: transaction.transactionNumber,
        items: transaction.items,
        totalAmount: transaction.totalAmount,
        clerkId,
        patronId,
      },
    });
  } catch (error) {
    console.error("CreatePosTransaction error:", error);
    res.status(400).json({
      success: false,
      error: {
        code: "TRANSACTION_FAILED",
        message: getErrorMessage(error),
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getShopTransactions = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const { limit = 20, offset = 0, dateFrom, dateTo } = req.query;

    const where: any = { shopId };
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
      if (dateTo) where.createdAt.lte = new Date(dateTo as string);
    }

    const [transactions, totalCount] = await Promise.all([
      prisma.posTransaction.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: Number(offset),
        take: Number(limit),
      }),
      prisma.posTransaction.count({ where }),
    ]);

    res.json({
      success: true,
      transactions,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });
  } catch (error) {
    console.error("GetShopTransactions error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting transactions",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- PURCHASE ORDERS ---

export const createPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const { items, clerkId, notes = '', priority = 'Normal' } = req.body;

    const purchaseOrder = await prisma.$transaction(async (tx) => {
      let subtotal = 0;

      // Process items
      const processedItems = [];
      for (const item of items) {
        const stock = await tx.shopStock.findFirst({
          where: {
            shopId,
            flavorId: item.flavorId,
          },
        });

        if (!stock) {
          throw new Error(`Flavor ${item.flavorName} not found at this shop`);
        }

        const itemCost = Number(stock.costPerUnit) * item.quantity;
        subtotal += itemCost;

        processedItems.push({
          stockId: stock.id,
          flavorId: stock.flavorId,
          flavorName: stock.flavorName,
          quantity: item.quantity,
          unit: item.unit,
          unitCost: stock.costPerUnit,
          totalCost: itemCost,
        });
      }

      // Generate order number
      const orderNumber = generateNumber('PO');

      // Create purchase order
      const newOrder = await tx.purchaseOrder.create({
      data: {
        shopId,
          orderNumber,
        clerkId,
          subtotal,
          shippingAmount: 0, // Would be calculated by logistics service
          totalAmount: subtotal,
          notes,
          priority,
        items: {
            create: processedItems.map(item => ({
              stockId: item.stockId,
            flavorId: item.flavorId,
            flavorName: item.flavorName,
            quantity: item.quantity,
            unit: item.unit,
              unitCost: item.unitCost,
              totalCost: item.totalCost,
            })),
          },
        },
        include: {
          items: true,
          shop: {
            select: {
              name: true,
              location: true,
            },
          },
        },
      });

      return newOrder;
    });

    res.status(201).json({
      success: true,
      purchaseOrder,
      message: "Purchase order created successfully",
    });

    // Send Kafka event to Inventory Service
    await sendAuditLog({
      eventType: "PURCHASE_ORDER_CREATED",
      timestamp: new Date().toISOString(),
      sourceService: "SalesService",
      userId: clerkId,
      details: {
        shopId,
        purchaseOrderId: purchaseOrder.id,
        orderNumber: purchaseOrder.orderNumber,
        items: purchaseOrder.items,
        totalAmount: purchaseOrder.totalAmount,
        priority,
      },
    });
  } catch (error) {
    console.error("CreatePurchaseOrder error:", error);
    res.status(400).json({
      success: false,
      error: {
        code: "ORDER_CREATION_FAILED",
        message: getErrorMessage(error),
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getShopOrders = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const { status, limit = 20, offset = 0 } = req.query;

    const where: any = { shopId };
    if (status) where.status = status;

    const [orders, totalCount] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: Number(offset),
        take: Number(limit),
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });
  } catch (error) {
    console.error("GetShopOrders error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting orders",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Submitted', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_STATUS",
          message: `Status must be one of: ${validStatuses.join(', ')}`,
        },
      });
    }

    const order = await prisma.purchaseOrder.update({
      where: { id: orderId },
      data: { 
        status,
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    res.json({
      success: true,
      order,
      message: "Order status updated successfully",
    });

    // Send audit log
    await sendAuditLog({
      eventType: "ORDER_STATUS_UPDATED",
      timestamp: new Date().toISOString(),
      sourceService: "SalesService",
      userId: req.user?.id,
      details: { orderId, status },
    });

  } catch (error) {
    console.error("UpdateOrderStatus error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating order status",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// --- REVIEWS AND FEEDBACK ---

export const createReview = async (req: Request, res: Response) => {
  try {
    const { 
      shopId, 
      patronId, 
      customerName, 
     customerEmail,
      rating, 
      title, 
      comment,
      service,
      quality,
      cleanliness,
    } = req.body;

    const review = await prisma.review.create({
      data: {
        shopId,
        patronId,
        customerName,
        customerEmail,
        rating,
        title,
        comment,
        service,
        quality,
        cleanliness,
      },
      include: {
        shop: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      review,
      message: "Review submitted successfully",
    });

    // Send Kafka event
    await sendAuditLog({
      eventType: "REVIEW_SUBMITTED",
      timestamp: new Date().toISOString(),
      sourceService: "SalesService",
      userId: patronId,
      details: {
        shopId,
        reviewId: review.id,
        rating,
        isVerified: review.isVerified,
      },
    });
  } catch (error) {
    console.error("CreateReview error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: 'Error creating review',
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const getShopReviews = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const { limit = 20, offset = 0, minRating } = req.query;

    const where: any = { shopId };
    if (minRating) where.rating = { gte: Number(minRating) };

    const [reviews, totalCount, averageRating] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          shop: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: Number(offset),
        take: Number(limit),
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where: { shopId },
        _avg: { rating: true },
      }),
    ]);

    res.json({
      success: true,
      reviews: reviews,
      shopId,
      averageRating: averageRating._avg.rating || 0,
      totalReviews: totalCount,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });
  } catch (error) {
    console.error("GetShopReviews error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error getting reviews",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const updates = req.body;

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
      include: {
        shop: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      review,
      message: "Review updated successfully",
    });

    // Send audit log
    await sendAuditLog({
      eventType: "REVIEW_UPDATED",
      timestamp: new Date().toISOString(),
      sourceService: "SalesService",
      userId: req.user?.id,
      details: { reviewId, updates },
    });

  } catch (error) {
    console.error("UpdateReview error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error updating review",
        details: process.env.NODE_ENV === "development" ? getErrorMessage(error) : undefined,
      },
    });
  }
};

// Health check endpoint
export const healthCheck = (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Sales Service is healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
};