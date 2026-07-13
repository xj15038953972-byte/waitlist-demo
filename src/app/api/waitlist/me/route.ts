import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ entry: null }, { status: 200 });
  }

  const entry = await prisma.waitlistEntry.findUnique({
    where: { userId: user.id },
    select: { id: true, email: true, createdAt: true },
  });

  return NextResponse.json({ entry });
}

