import type { Request, Response } from "express";

// Mock data
const shops = [
  {
    id: 1,
    name: "Eisladen am Marktplatz",
    location: "Hauptstraße 1, 10115 Berlin",
  },
  { id: 2, name: "Gelato Fantastico", location: "Via Roma 1, 00184 Roma" },
];

const menus = {
  1: [
    { flavor: "chocolate", price: 2.5 },
    { flavor: "vanilla", price: 2.5 },
    { flavor: "strawberry", price: 2.8 },
  ],
  2: [
    { flavor: "pistachio", price: 3.0 },
    { flavor: "hazelnut", price: 3.0 },
    { flavor: "stracciatella", price: 2.8 },
  ],
};

const inventories = {
  1: [
    { flavor: "chocolate", quantity: 50 },
    { flavor: "vanilla", quantity: 45 },
    { flavor: "strawberry", quantity: 30 },
  ],
  2: [
    { flavor: "pistachio", quantity: 40 },
    { flavor: "hazelnut", quantity: 35 },
    { flavor: "stracciatella", quantity: 25 },
  ],
};

let feedback = [];

/**
 * @description Get details for a specific retail shop.
 * @param req
 * @param res
 */
export const getShop = async (req: Request, res: Response) => {
  const shopId = parseInt(req.params.shopId);
  const shop = shops.find((s) => s.id === shopId);
  if (shop) {
    res.json(shop);
  } else {
    res.status(404).json({ message: "Shop not found" });
  }
};

/**
 * @description Get the publicly visible menu with prices for patrons.
 * @param req
 * @param res
 */
export const getShopMenu = async (req: Request, res: Response) => {
  const shopId = parseInt(req.params.shopId);
  const menu = menus[shopId];
  if (menu) {
    res.json(menu);
  } else {
    res.status(404).json({ message: "Menu not found for this shop" });
  }
};

/**
 * @description Get the detailed internal inventory for a clerk.
 * @param req
 * @param res
 */
export const getShopInventory = async (req: Request, res: Response) => {
  const shopId = parseInt(req.params.shopId);
  const inventory = inventories[shopId];
  if (inventory) {
    res.json(inventory);
  } else {
    res.status(404).json({ message: "Inventory not found for this shop" });
  }
};

/**
 * @description Process a new sale from the Point of Sale system.
 * @param req
 * @param res
 */
export const createPosTransaction = async (req: Request, res: Response) => {
  const shopId = parseInt(req.params.shopId);
  const { items } = req.body; // items: [{ flavor: string, quantity: number }]

  const shopInventory = inventories[shopId];

  if (!shopInventory) {
    return res.status(404).json({ message: 'Inventory not found for this shop' });
  }

  // Check if there is enough stock for the transaction
  for (const item of items) {
    const inventoryItem = shopInventory.find(i => i.flavor === item.flavor);
    if (!inventoryItem || inventoryItem.quantity < item.quantity) {
      return res.status(400).json({ message: `Not enough stock for ${item.flavor}` });
    }
  }

  // Deduct the stock
  for (const item of items) {
    const inventoryItem = shopInventory.find(i => i.flavor === item.flavor);
    inventoryItem.quantity -= item.quantity;
  }

  console.log(`New sale at shop ${shopId}:`, items);
  res.status(201).json({ message: "Transaction successful" });
};

/**
 * @description (Inter-service) Create a purchase order to request stock from the Inventory Service.
 * @param req
 * @param res
 */
export const createPurchaseOrder = async (req: Request, res: Response) => {
  const shopId = parseInt(req.params.shopId);
  const { items } = req.body; // items: [{ flavor: string, quantity: number }]
  // In a real implementation, you would send a request to the Inventory Service
  console.log(`Purchase order from shop ${shopId}:`, items);
  res.status(201).json({ message: "Purchase order created" });
};

/**
 * @description Allow a patron to submit feedback or a review.
 * @param req
 * @param res
 */
export const createFeedback = async (req: Request, res: Response) => {
  const { shopId, rating, comment } = req.body;
  const newFeedback = {
    id: feedback.length + 1,
    shopId,
    rating,
    comment,
    createdAt: new Date(),
  };
  feedback.push(newFeedback);
  res.status(201).json(newFeedback);
};
