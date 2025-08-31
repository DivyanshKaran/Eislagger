import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendAuditLog } from "../kafka/kafka.ts";

const prisma = new PrismaClient();

/**
 * @description Get all shops.
 * @param req
 * @param res
 */
export const getAllShops = async (req: Request, res: Response) => {
  try {
    const shops = await prisma.shop.findMany();
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: "Error getting shops", error });
  }
};

/**
 * @description Create a new shop.
 * @param req
 * @param res
 */
export const createShop = async (req: Request, res: Response) => {
  const { name, location } = req.body;
  try {
    const newShop = await prisma.shop.create({
      data: {
        name,
        location,
      },
    });
    res.status(201).json(newShop);
  } catch (error) {
    res.status(500).json({ message: "Error creating shop", error });
  }
};

/**
 * @description Get details for a specific retail shop.
 * @param req
 * @param res
 */
export const getShop = async (req: Request, res: Response) => {
  const { shopId } = req.params;
  try {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });
    if (shop) {
      res.json(shop);
    } else {
      res.status(404).json({ message: "Shop not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting shop", error });
  }
};

/**
 * @description Update a shop.
 * @param req
 * @param res
 */
export const updateShop = async (req: Request, res: Response) => {
  const { shopId } = req.params;
  const { name, location } = req.body;
  try {
    const updatedShop = await prisma.shop.update({
      where: { id: shopId },
      data: {
        name,
        location,
      },
    });
    res.json(updatedShop);
  } catch (error) {
    res.status(500).json({ message: "Error updating shop", error });
  }
};

/**
 * @description Delete a shop.
 * @param req
 * @param res
 */
export const deleteShop = async (req: Request, res: Response) => {
  const { shopId } = req.params;
  try {
    await prisma.shop.delete({
      where: { id: shopId },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting shop", error });
  }
};

/**
 * @description Get the publicly visible menu with prices for patrons.
 * @param req
 * @param res
 */
export const getShopMenu = async (req: Request, res: Response) => {
  const { shopId } = req.params;
  try {
    const stock = await prisma.shopStock.findMany({
      where: { shopId },
      select: {
        flavorName: true,
        pricePerUnit: true,
      },
    });
    if (stock.length > 0) {
      res.json(stock);
    } else {
      res.status(404).json({ message: "Menu not found for this shop" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting shop menu", error });
  }
};

/**
 * @description Get the detailed internal inventory for a clerk.
 * @param req
 * @param res
 */
export const getShopInventory = async (req: Request, res: Response) => {
  const { shopId } = req.params;
  try {
    const stock = await prisma.shopStock.findMany({
      where: { shopId },
    });
    if (stock.length > 0) {
      res.json(stock);
    } else {
      res.status(404).json({ message: "Inventory not found for this shop" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error getting shop inventory", error });
  }
};

/**
 * @description Process a new sale from the Point of Sale system.
 * @param req
 * @param res
 */
export const createPosTransaction = async (req: Request, res: Response) => {
  const { shopId } = req.params;
  const { items, clerkId, patronId } = req.body; // items: [{ flavorId: string, quantity: number }]

  try {
    const transaction = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      for (const item of items) {
        const stockItem = await tx.shopStock.findFirst({
          where: {
            shopId,
            flavorId: item.flavorId,
          },
        });

        if (!stockItem || stockItem.quantity < item.quantity) {
          throw new Error(`Not enough stock for ${item.flavorName}`);
        }

        await tx.shopStock.update({
          where: {
            id: stockItem.id,
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });

        totalAmount += Number(stockItem.pricePerUnit) * item.quantity;
      }

      const newTransaction = await tx.posTransaction.create({
        data: {
          shopId,
          clerkId,
          patronId,
          totalAmount,
          items: {
            create: items.map((item) => ({
              flavorId: item.flavorId,
              flavorName: item.flavorName, // You might want to fetch this from the stock item
              quantity: item.quantity,
              unitPrice: item.unitPrice, // You might want to fetch this from the stock item
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return newTransaction;
    });

    res.status(201).json({ message: "Transaction successful", transaction });

    const auditLog = {
      eventType: "POS_SALE_COMPLETED",
      timestamp: new Date().toISOString(),
      sourceService: "SalesService",
      userId: clerkId,
      details: {
        shopId,
        transactionId: transaction.id,
        items: transaction.items,
        totalAmount: transaction.totalAmount,
      },
    };

    await sendAuditLog(auditLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @description (Inter-service) Create a purchase order to request stock from the Inventory Service.
 * @param req
 * @param res
 */
export const createPurchaseOrder = async (req: Request, res: Response) => {
  const { shopId } = req.params;
  const { items, clerkId } = req.body; // items: [{ flavorId: string, quantity: number, unit: string }]

  try {
    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        shopId,
        clerkId,
        items: {
          create: items.map((item) => ({
            flavorId: item.flavorId,
            flavorName: item.flavorName,
            quantity: item.quantity,
            unit: item.unit,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json(purchaseOrder);

    // TODO: Emit a KAFKA event to notify the Inventory Service
  } catch (error) {
    res.status(500).json({ message: "Error creating purchase order", error });
  }
};

/**
 * @description Allow a patron to submit feedback or a review.
 * @param req
 * @param res
 */
export const createFeedback = async (req: Request, res: Response) => {
  const { shopId, patronId, rating, comment } = req.body;

  try {
    const feedback = await prisma.feedback.create({
      data: {
        shopId,
        patronId,
        rating,
        comment,
      },
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Error creating feedback", error });
  }
};
