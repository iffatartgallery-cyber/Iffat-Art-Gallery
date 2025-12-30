import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const db = new Database(dbPath);

try {
  // Check if table exists
  const tables = db
    .prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='User'`
    )
    .all();
  console.log("Tables:", tables);

  // Get all users
  const users = db.prepare(`SELECT id, email, name FROM "User"`).all();
  console.log("Users in database:", users);

  // Get user by email
  const user = db
    .prepare(`SELECT id, email, name, passwordHash FROM "User" WHERE email = ?`)
    .get("iffatsamina@gmail.com");
  console.log("Specific user:", user);
} catch (error) {
  console.error("Database error:", error);
} finally {
  db.close();
}
