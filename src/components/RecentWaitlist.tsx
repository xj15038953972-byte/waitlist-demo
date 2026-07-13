import { getRecentWaitlistEntries } from "@/lib/waitlist";

import { RecentWaitlistList } from "./RecentWaitlistList";

type RecentWaitlistProps = {
  currentUserId?: string | null;
};

export async function RecentWaitlist({
  currentUserId = null,
}: RecentWaitlistProps) {
  const entries = await getRecentWaitlistEntries(5);

  if (entries.length === 0) {
    return (
      <p className="mt-8 text-sm text-zinc-500">
        No one has joined yet. Be the first!
      </p>
    );
  }

  return (
    <RecentWaitlistList
      currentUserId={currentUserId}
      entries={entries.map((entry) => ({
        id: entry.id,
        email: entry.email,
        userId: entry.userId,
        username: entry.user.username,
        createdAt: entry.createdAt.toISOString(),
      }))}
    />
  );
}
