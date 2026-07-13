import { NextResponse } from "next/server";

import { createSession } from "@/lib/auth";
import { normalizeUsername, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username =
      typeof body.username === "string" ? normalizeUsername(body.username) : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "This username does not exist. Please register first." },
        { status: 404 },
      );
    }

    if (!(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    await createSession(user.id);

    return NextResponse.json({
      message: "Logged in successfully.",
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
