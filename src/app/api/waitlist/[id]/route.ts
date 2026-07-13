import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in to edit your waitlist entry." },
        { status: 401 },
      );
    }

    const { id } = await context.params;
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

    const entry = await prisma.waitlistEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    if (entry.userId !== user.id) {
      return NextResponse.json(
        { error: "You can only edit your own waitlist entry." },
        { status: 403 },
      );
    }

    const updatedEntry = await prisma.waitlistEntry.update({
      where: { id },
      data: { email },
    });

    return NextResponse.json({ entry: updatedEntry });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This email is already on the waitlist" },
        { status: 409 },
      );
    }

    console.error("Waitlist update error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in to delete your waitlist entry." },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    const entry = await prisma.waitlistEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    if (entry.userId !== user.id) {
      return NextResponse.json(
        { error: "You can only delete your own waitlist entry." },
        { status: 403 },
      );
    }

    await prisma.waitlistEntry.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Entry deleted" });
  } catch (error: unknown) {
    console.error("Waitlist delete error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
