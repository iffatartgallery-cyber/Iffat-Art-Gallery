import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import path from "path";
import { randomUUID } from "crypto";

const dbPath = path.join(process.cwd(), "dev.db");
const db = new Database(dbPath);

async function main() {
  try {
    const hashedPassword = await bcrypt.hash("admin.123", 10);
    const id = randomUUID();

    db.prepare(
      `
      INSERT OR REPLACE INTO "User" (id, email, name, "passwordHash", "createdAt", "updatedAt")
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `
    ).run(id, "iffatsamina@gmail.com", "Admin", hashedPassword);

    console.log("✓ User created:", {
      email: "iffatsamina@gmail.com",
      password: "admin.123",
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    db.close();
  }
}

main();
