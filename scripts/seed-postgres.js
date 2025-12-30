require("dotenv").config({ path: ".env.local" });

const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("Seeding database...");

    // Create admin user
    const hashedPassword = await argon2.hash("admin123", {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const user = await prisma.user.upsert({
      where: { email: "iffatsamina@gmail.com" },
      update: {},
      create: {
        email: "iffatsamina@gmail.com",
        name: "Admin",
        passwordHash: hashedPassword,
      },
    });

    console.log(`✓ Admin user created/updated: ${user.email}`);
    console.log("✓ Seeding completed successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
