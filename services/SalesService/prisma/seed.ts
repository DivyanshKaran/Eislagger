import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// These IDs would come from the Inventory Service in a real scenario.
// We are hardcoding them here for seeding purposes.
const FLAVOR_IDS = {
  CHOCOLATE: "d290f1ee-6c54-4b01-90e6-d701748f0851",
  VANILLA: "d290f1ee-6c54-4b01-90e6-d701748f0852",
  CARAMEL: "d290f1ee-6c54-4b01-90e6-d701748f0853",
};

// These IDs would come from the Auth Service (from a JWT).
const USER_IDS = {
  CLERK_BHOPAL: "clerk-bpl-01",
  CLERK_INDORE: "clerk-ind-01",
  PATRON_1: "patron-user-01",
};

async function main() {
  console.log("Start seeding Sales Service database...");

  // --- Create Shops ---
  console.log("Creating shops...");
  const shopBhopal = await prisma.shop.create({
    data: {
      name: "Scoops Ahoy",
      location: "Bhopal, Madhya Pradesh, India",
    },
  });

  const shopIndore = await prisma.shop.create({
    data: {
      name: "Creamy Corner",
      location: "Indore, Madhya Pradesh, India",
    },
  });

  // --- Create Shop Stock ---
  console.log("Creating initial shop stock...");
  await prisma.shopStock.createMany({
    data: [
      {
        shopId: shopBhopal.id,
        flavorId: FLAVOR_IDS.CHOCOLATE,
        flavorName: "Dark Choco Fudge",
        pricePerUnit: new Prisma.Decimal(120.0),
        quantity: 150,
        unit: "Scoops",
      },
      {
        shopId: shopBhopal.id,
        flavorId: FLAVOR_IDS.VANILLA,
        flavorName: "Classic Vanilla Bean",
        pricePerUnit: new Prisma.Decimal(100.0),
        quantity: 200,
        unit: "Scoops",
      },
      {
        shopId: shopIndore.id,
        flavorId: FLAVOR_IDS.CARAMEL,
        flavorName: "Cosmic Caramel Crunch",
        pricePerUnit: new Prisma.Decimal(150.0),
        quantity: 180,
        unit: "Scoops",
      },
    ],
  });

  // --- Create a Sample POS Transaction ---
  console.log("Creating a sample POS transaction...");
  await prisma.posTransaction.create({
    data: {
      shopId: shopBhopal.id,
      clerkId: USER_IDS.CLERK_BHOPAL,
      patronId: USER_IDS.PATRON_1,
      totalAmount: new Prisma.Decimal(240.0),
      items: {
        create: [
          {
            flavorId: FLAVOR_IDS.CHOCOLATE,
            flavorName: "Dark Choco Fudge",
            quantity: 2,
            unitPrice: new Prisma.Decimal(120.0),
          },
        ],
      },
    },
  });

  // --- Create Purchase Orders with different statuses ---
  console.log("Creating purchase orders...");
  // 1. A pending order
  await prisma.purchaseOrder.create({
    data: {
      shopId: shopBhopal.id,
      clerkId: USER_IDS.CLERK_BHOPAL,
      status: "Pending",
      items: {
        create: {
          flavorId: FLAVOR_IDS.VANILLA,
          flavorName: "Classic Vanilla Bean",
          quantity: 10,
          unit: "Liters",
        },
      },
    },
  });

  // 2. An accepted order with shipment data
  await prisma.purchaseOrder.create({
    data: {
      shopId: shopIndore.id,
      clerkId: USER_IDS.CLERK_INDORE,
      status: "Accepted",
      shipmentId: "shp-xyz-789", // Denormalized data from Logistics Service
      shipmentStatus: "InTransit",
      estimatedDeliveryDate: new Date("2025-09-02T18:00:00Z"),
      items: {
        create: {
          flavorId: FLAVOR_IDS.CARAMEL,
          flavorName: "Cosmic Caramel Crunch",
          quantity: 15,
          unit: "Liters",
        },
      },
    },
  });

  // 3. A rejected order
  await prisma.purchaseOrder.create({
    data: {
      shopId: shopBhopal.id,
      clerkId: USER_IDS.CLERK_BHOPAL,
      status: "Rejected",
      items: {
        create: {
          flavorId: "flavor-out-of-stock-id",
          flavorName: "Strawberry Surprise",
          quantity: 5,
          unit: "Liters",
        },
      },
    },
  });

  // --- Create a Sample Feedback ---
  console.log("Creating sample feedback...");
  await prisma.feedback.create({
    data: {
      shopId: shopIndore.id,
      patronId: USER_IDS.PATRON_1,
      rating: 5,
      comment:
        "The Cosmic Caramel Crunch is out of this world! Best ice cream in Indore.",
    },
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
