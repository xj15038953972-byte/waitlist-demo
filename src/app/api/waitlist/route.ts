import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in to join the waitlist." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const email =
      typeof body.email === "string" ? normalizeEmail(body.email) : "";

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    const existingEntry = await prisma.waitlistEntry.findUnique({
      where: { userId: user.id },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "Your account is already on the waitlist." },
        { status: 409 },
      );
    }

    await prisma.waitlistEntry.create({
      data: {
        email,
        userId: user.id,
      },
    });

    return NextResponse.json({
      message: "You're on the list! We'll be in touch soon.",
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 },
      );
    }

    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
