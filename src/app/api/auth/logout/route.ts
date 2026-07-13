import { NextResponse } from "next/server";

import { deleteSession } from "@/lib/auth";

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json({ message: "Logged out successfully." });
  } catch (error: unknown) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
