import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import argon2 from "argon2"; // Changed to argon2 for password hashing
// @ts-ignore
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const libsql = createClient({ url: process.env.DATABASE_URL! });
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! }); // Corrected adapter initialization
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "iffatsamina@gmail.com";
  const password = "admin.123";
  const passwordHash = await argon2.hash(password); // Using argon2 to hash the password

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Admin",
      passwordHash,
    },
  });

  console.log("✓ Created user:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
