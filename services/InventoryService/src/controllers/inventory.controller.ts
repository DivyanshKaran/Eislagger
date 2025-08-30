import type { Request, Response } from "express";

// Dummy data for factories
let factories = [
  {
    id: 1,
    name: "Factory A",
    stock: [
      { flavor: "chocolate", quantity: 100 },
      { flavor: "vanilla", quantity: 150 },
    ],
    budget: 5000,
  },
  {
    id: 2,
    name: "Factory B",
    stock: [
      { flavor: "strawberry", quantity: 120 },
      { flavor: "mint", quantity: 80 },
    ],
    budget: 7000,
  },
];

// Dummy data for flavors
const flavors = [
  "chocolate",
  "vanilla",
  "strawberry",
  "mint",
  "caramel",
  "pistachio",
];

// Dummy data for invoices
let invoices: any[] = [];

/**
 * @description Get a factory's details, including its stock and budget.
 * @param req
 * @param res
 */
export const getFactory = async (req: Request, res: Response) => {
  const factoryId = parseInt(req.params.factoryId);
  const factory = factories.find((f) => f.id === factoryId);

  if (factory) {
    res.json(factory);
  } else {
    res.status(404).json({ message: "Factory not found" });
  }
};

/**
 * @description Allocate or update a factory's budget.
 * @param req
 * @param res
 */
export const updateFactoryBudget = async (req: Request, res: Response) => {
  const factoryId = parseInt(req.params.factoryId);
  const { budget } = req.body;
  const factoryIndex = factories.findIndex((f) => f.id === factoryId);

  if (factoryIndex !== -1) {
    factories[factoryIndex].budget = budget;
    res.json(factories[factoryIndex]);
  } else {
    res.status(404).json({ message: "Factory not found" });
  }
};

/**
 * @description Register newly produced ice cream stock.
 * @param req
 * @param res
 */
export const createFactoryStockItem = async (req: Request, res: Response) => {
  const factoryId = parseInt(req.params.factoryId);
  const { flavor, quantity } = req.body;
  const factoryIndex = factories.findIndex((f) => f.id === factoryId);

  if (factoryIndex !== -1) {
    const stockIndex = factories[factoryIndex].stock.findIndex(
      (s) => s.flavor === flavor
    );
    if (stockIndex !== -1) {
      factories[factoryIndex].stock[stockIndex].quantity += quantity;
    } else {
      factories[factoryIndex].stock.push({ flavor, quantity });
    }
    res.status(201).json(factories[factoryIndex]);
  } else {
    res.status(404).json({ message: "Factory not found" });
  }
};

/**
 * @description Get a list of all available flavors.
 * @param req
 * @param res
 */
export const getFlavors = async (req: Request, res: Response) => {
  res.json(flavors);
};

/**
 * @description Create an invoice for a shop based on a purchase order.
 * @param req
 * @param res
 */
export const createInvoice = async (req: Request, res: Response) => {
  const { shopId, items } = req.body;
  const newInvoice = {
    id: invoices.length + 1,
    shopId,
    items,
    createdAt: new Date(),
  };
  invoices.push(newInvoice);
  res.status(201).json(newInvoice);
};

/**
 * @description Retrieve details for a specific invoice.
 * @param req
 * @param res
 */
export const getInvoice = async (req: Request, res: Response) => {
  const invoiceId = parseInt(req.params.invoiceId);
  const invoice = invoices.find((i) => i.id === invoiceId);

  if (invoice) {
    res.json(invoice);
  } else {
    res.status(404).json({ message: "Invoice not found" });
  }
};
