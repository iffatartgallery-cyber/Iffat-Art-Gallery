require("dotenv").config({ path: ".env.local" });

const Database = require("better-sqlite3");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function migrate() {
  try {
    // Connect to SQLite database
    const dbPath = path.join(process.cwd(), "dev.db");
    const sqlite = new Database(dbPath);

    // Get all users from SQLite
    const users = sqlite.prepare('SELECT * FROM "User"').all();

    console.log(`Found ${users.length} users to migrate`);

    // Insert users into PostgreSQL
    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          id: user.id,
          email: user.email,
          name: user.name,
          passwordHash: user.passwordHash,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      });
    }

    console.log(`✓ Successfully migrated ${users.length} users to PostgreSQL`);
    sqlite.close();
    await prisma.$disconnect();
  } catch (error) {
    console.error("Migration failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

migrate();
