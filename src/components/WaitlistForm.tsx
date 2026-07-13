"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type WaitlistFormProps = {
  isLoggedIn: boolean;
  waitlistEmail?: string | null;
  waitlistEntryId?: string | null;
  hasJoined?: boolean;
};

type FormStatus = "idle" | "loading" | "success" | "error";

export function WaitlistForm({
  isLoggedIn,
  waitlistEmail = null,
  waitlistEntryId = null,
  hasJoined = false,
}: WaitlistFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message);
      setEmail("");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  async function handleLeave() {
    if (!waitlistEntryId) {
      setStatus("error");
      setMessage("Waitlist entry not found.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`/api/waitlist/${waitlistEntryId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Failed to leave the waitlist.");
        return;
      }

      setStatus("success");
      setMessage("You have left the waitlist.");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-5 text-sm text-zinc-300">
        <p>Please log in or create an account to join the waitlist.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-zinc-200 transition hover:bg-zinc-800"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-violet-600 px-4 py-2 text-white transition hover:bg-violet-500"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  if (hasJoined) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 px-4 py-4 text-sm text-emerald-300">
          <p>
            Your account is on the waitlist as{" "}
            <span className="font-medium text-emerald-200">{waitlistEmail}</span>.
          </p>
          <button
            type="button"
            onClick={handleLeave}
            disabled={status === "loading"}
            className="mt-4 h-11 w-full rounded-xl border border-emerald-800/60 bg-transparent text-sm font-medium text-emerald-200 transition hover:bg-emerald-900/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Leaving..." : "Leave waitlist"}
          </button>
        </div>

        {message ? (
          <p
            role="status"
            className={`mt-4 text-sm ${
              status === "success" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleJoin}
        className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-4"
      >
        <label htmlFor="waitlist-email" className="block text-sm text-zinc-300">
          Email for waitlist updates
        </label>
        <input
          id="waitlist-email"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          disabled={status === "loading"}
          className="mt-3 h-11 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-zinc-100 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-4 h-11 w-full rounded-xl bg-violet-600 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Joining..." : "Join waitlist"}
        </button>
      </form>

      {message ? (
        <p
          role="status"
          className={`mt-4 text-sm ${
            status === "success"
              ? "text-emerald-400"
              : "text-red-400"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
