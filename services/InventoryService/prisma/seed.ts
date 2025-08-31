import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // --- Create Factories ---
  console.log("Creating factories...");
  const factory1 = await prisma.factory.create({
    data: {
      name: "FrostyCreams Inc.",
      location: "Mumbai, India",
      budget: new Prisma.Decimal(50000.0),
    },
  });

  const factory2 = await prisma.factory.create({
    data: {
      name: "Arctic Delights",
      location: "Delhi, India",
      budget: new Prisma.Decimal(75000.0),
    },
  });

  // --- Create Flavors ---
  console.log("Creating flavors...");
  const vanilla = await prisma.flavor.create({
    data: {
      name: "Classic Vanilla Bean",
      description: "A timeless classic made with real vanilla beans.",
      dietaryTags: ["vegetarian", "gluten-free"],
    },
  });

  const chocolate = await prisma.flavor.create({
    data: {
      name: "Dark Choco Fudge",
      description: "Rich, decadent dark chocolate with fudge swirls.",
      dietaryTags: ["vegetarian"],
    },
  });

  const caramel = await prisma.flavor.create({
    data: {
      name: "Cosmic Caramel Crunch",
      description: "Creamy caramel ice cream with crunchy honeycomb pieces.",
      dietaryTags: ["vegetarian", "gluten-free"],
    },
  });

  // --- Create Stock Items ---
  console.log("Creating stock items...");
  await prisma.stockItem.createMany({
    data: [
      {
        factoryId: factory1.id,
        flavorId: vanilla.id,
        quantity: 100,
        unit: "Liters",
        productionCost: new Prisma.Decimal(250.0),
        expiryDate: new Date("2026-08-30"),
        batchId: "B-VANI-F1-001",
      },
      {
        factoryId: factory1.id,
        flavorId: chocolate.id,
        quantity: 80,
        unit: "Liters",
        productionCost: new Prisma.Decimal(320.0),
        expiryDate: new Date("2026-09-15"),
        batchId: "B-CHOC-F1-001",
      },
      {
        factoryId: factory2.id,
        flavorId: caramel.id,
        quantity: 120,
        unit: "Liters",
        productionCost: new Prisma.Decimal(350.0),
        expiryDate: new Date("2026-10-01"),
        batchId: "B-CARA-F2-001",
      },
    ],
  });

  // --- Create a Sample Invoice ---
  console.log("Creating a sample invoice...");
  await prisma.invoice.create({
    data: {
      purchaseOrderId: "po-shop-alpha-001", // Example ID from Sales Service
      shopId: "shop-alpha", // Example ID
      totalAmount: new Prisma.Decimal(4500.0),
      status: "Paid",
      items: {
        create: [
          {
            flavorName: "Classic Vanilla Bean",
            quantity: 10,
            unitPrice: new Prisma.Decimal(450.0),
            totalPrice: new Prisma.Decimal(4500.0),
          },
        ],
      },
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
// ---
// Step 3: Run the Seed Script

// Now, you can populate your database with a single command. Every time you run this, Prisma will execute the `prisma/seed.ts` file.

// ```bash
// npx prisma db seed
