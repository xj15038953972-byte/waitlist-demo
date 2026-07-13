import { NextResponse } from "next/server";

import { createSession } from "@/lib/auth";
import {
  hashPassword,
  normalizeUsername,
  validatePassword,
  validateUsername,
} from "@/lib/password";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username =
      typeof body.username === "string" ? normalizeUsername(body.username) : "";
    const password = typeof body.password === "string" ? body.password : "";

    const usernameError = validateUsername(username);
    if (usernameError) {
      return NextResponse.json({ error: usernameError }, { status: 400 });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
      },
    });

    await createSession(user.id);

    return NextResponse.json({
      message: "Account created successfully.",
      user,
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Username is already taken." },
        { status: 409 },
      );
    }

    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
