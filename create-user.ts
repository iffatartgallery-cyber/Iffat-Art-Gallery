import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

const db = new Database("./dev.db");

async function main() {
  try {
    const email = "iffatsamina@gmail.com";
    const password = "admin.123";
    const passwordHash = await bcrypt.hash(password, 10);
    const id = randomBytes(16).toString("hex");

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO "User" (id, email, name, "passwordHash", "createdAt", "updatedAt")
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    stmt.run(id, email, "Admin", passwordHash);
    console.log("✓ Created user:", email);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    db.close();
  }
}

main();
