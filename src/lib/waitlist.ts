import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function getRecentWaitlistEntries(limit = 5) {
  noStore();

  return prisma.waitlistEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      email: true,
      userId: true,
      createdAt: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}

export async function getUserWaitlistEntry(userId: string) {
  noStore();

  return prisma.waitlistEntry.findUnique({
    where: { userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
}
