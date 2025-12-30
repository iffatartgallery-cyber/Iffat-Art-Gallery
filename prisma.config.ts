import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Load envs from .env.local for Prisma CLI commands
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Use process.env directly to avoid errors on commands that don't need DB URL
  datasource: {
    url: process.env.DATABASE_URL ?? "",
    schemas: ["public"],
  },
});
