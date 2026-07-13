"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type WaitlistEntryItem = {
  id: string;
  email: string;
  userId: string;
  username: string;
  createdAt: string;
};

type RecentWaitlistListProps = {
  entries: WaitlistEntryItem[];
  currentUserId?: string | null;
};

function formatJoinedAt(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function RecentWaitlistList({
  entries,
  currentUserId = null,
}: RecentWaitlistListProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function startEdit(entry: WaitlistEntryItem) {
    setEditingId(entry.id);
    setEditEmail(entry.email);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditEmail("");
    setError("");
  }

  async function saveEdit(id: string) {
    setLoadingId(id);
    setError("");

    try {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: editEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to update entry.");
        return;
      }

      cancelEdit();
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteEntry(id: string) {
    if (!window.confirm("Delete this waitlist entry?")) {
      return;
    }

    setLoadingId(id);
    setError("");

    try {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to delete entry.");
        return;
      }

      if (editingId === id) {
        cancelEdit();
      }

      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="mt-8 w-full max-w-md text-left">
      <h2 className="mb-3 text-sm font-medium text-zinc-400">
        Recent joiners
      </h2>

      {error ? (
        <p className="mb-3 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900/50">
        {entries.map((entry) => {
          const isEditing = editingId === entry.id;
          const isLoading = loadingId === entry.id;
          const canManage = currentUserId === entry.userId;

          return (
            <li key={entry.id} className="px-4 py-3 text-sm">
              {isEditing ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.target.value)}
                    disabled={isLoading}
                    className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-zinc-100 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(entry.id)}
                      disabled={isLoading}
                      className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-500 disabled:opacity-60"
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={isLoading}
                      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-zinc-200">{entry.email}</p>
                    <p className="text-xs text-zinc-500">@{entry.username}</p>
                    <time
                      dateTime={entry.createdAt}
                      className="text-xs text-zinc-500"
                    >
                      {formatJoinedAt(entry.createdAt)}
                    </time>
                  </div>
                  {canManage ? (
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(entry)}
                        disabled={isLoading || editingId !== null}
                        className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-60"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteEntry(entry.id)}
                        disabled={isLoading || editingId !== null}
                        className="rounded-lg border border-red-900/60 px-2.5 py-1 text-xs text-red-400 transition hover:bg-red-950/40 disabled:opacity-60"
                      >
                        {isLoading ? "..." : "Delete"}
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
