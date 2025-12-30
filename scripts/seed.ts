import { prisma } from "@/lib/prisma";
import argon2 from "argon2";

async function main() {
  try {
    console.log("Seeding database...");

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

    console.log("Admin user created/updated:", user);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
