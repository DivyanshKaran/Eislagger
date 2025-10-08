
import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const roles: Role[] = ['Executive', 'Manufacturer', 'Clerk', 'Patron'];

  for (let i = 0; i < 10; i++) {
    const fullName = faker.name.fullName();
    const email = faker.internet.email(fullName);
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 12);
    const role = roles[i % roles.length];

    await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
        profile: {
          create: {
            fullName,
          },
        },
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
