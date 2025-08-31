import type { Request, Response } from "express";

import prisma from "../prisma.ts";

/**
 * @description Get a factory's details, including its stock and budget.
 */
export const getFactory = async (req: Request, res: Response) => {
  try {
    const factoryId = req.params.factoryId;
    const factory = await prisma.factory.findUnique({
      where: { id: factoryId },
    });

    if (factory) {
      res.json({ message: "Factory found successfully", factory: factory });
    } else {
      res.status(404).json({ message: "Factory not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

/**
 * @description Allocate or update a factory's budget.
 */
export const updateFactoryBudget = async (req: Request, res: Response) => {
  try {
    const factoryId = req.params.factoryId;
    const { budget } = req.body;

    const updatedFactory = await prisma.factory.update({
      where: { id: factoryId },
      data: { budget: parseInt(budget) },
    });

    if (updatedFactory) {
      res.json(updatedFactory);
    } else {
      res.status(404).json({ message: "Factory not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

/**
 * @description Register newly produced ice cream stock.
 */
export const createFactoryStockItem = async (req: Request, res: Response) => {
  try {
    const factoryId = req.params.factoryId;
    const { batchId, expiryDate, flavorId, productionCost, quantity, unit } =
      req.body;

    const updatedFactory = await prisma.factory.findUnique({
      where: { id: factoryId },
    });

    if (!updatedFactory) {
      res.status(404).json({ message: "Factory not found" });
    }

    const newStockItem = await prisma.stockItem.create({
      data: {
        factoryId: factoryId,
        batchId,
        expiryDate: new Date(expiryDate),
        flavorId,
        productionCost,
        quantity,
        unit,
      },
    });

    res.status(200).json({ message: "Stock added to factory", newStockItem });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

/**
 * @description Get a list of all available flavors.
 */
export const getFlavors = async (req: Request, res: Response) => {
  try {
    const flavors = await prisma.flavor.findMany();
    res.json({ message: "Flavors obtained", flavors });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

/**
 * @description Create an invoice for a shop based on a purchase order.
 * To be implemented using Kafka Events
 * still left to be implemented
 */
export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { shopId, items } = req.body;
    const newInvoice = await prisma.invoice.create({
      data: {
        shopId: shopId,
        items: items, // Assuming 'items' is a JSON string or compatible type
      },
    });
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

/**
 * @description Retrieve details for a specific invoice.
 */
export const getInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.params.invoiceId;
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (invoice) {
      res.status(200).json({ message: "Invoice found successfully", invoice });
    } else {
      res.status(404).json({ message: "Invoice not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
