
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const prisma = new PrismaClient();
  console.log('Start seeding...');

  const filePath = path.join(process.cwd(), '../../final_ice_cream_data.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const flavorsData = JSON.parse(fileContent);

  for (const flavorData of flavorsData) {
    try {
      console.log(`Processing flavor: ${flavorData.flavor}`);
      const categoryMap: { [key: string]: any } = {
        'choclate': 'Chocolate',
        'dairy free': 'Vegan',
        'Fruity': 'Classic',
        'International': 'International',
        'kids': 'Classic',
      };

      const category = categoryMap[flavorData.path] || 'Classic';

      await prisma.flavor.create({
        data: {
          name: flavorData.flavor,
          description: flavorData.short_description,
          longDescription: flavorData.long_description,
          category: category,
          baseFlavor: flavorData.flavors[0] || 'unknown',
          ingredients: flavorData.flavors,
          tags: flavorData.tags,
          basePrice: flavorData.price,
          productionCost: flavorData.price * 0.5,
          imageUrl: flavorData.images[0],
          images: flavorData.images,
        },
      });
    } catch (error) {
      console.error(`Error processing flavor: ${flavorData.flavor}`, error);
    }
  }

  console.log('Seeding finished.');
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
