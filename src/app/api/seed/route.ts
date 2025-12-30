import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { NextResponse } from "next/server";

async function seedAdmin() {
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

  return user;
}

export async function GET() {
  try {
    const user = await seedAdmin();
    return NextResponse.json({
      success: true,
      message: "Admin user created/updated",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
