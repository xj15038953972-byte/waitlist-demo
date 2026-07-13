"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthNavProps = {
  username?: string;
};

export function AuthNav({ username }: AuthNavProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
      <Link href="/" className="text-sm font-medium text-violet-200">
        WaitLess-waitlist
      </Link>

      <div className="flex items-center gap-3 text-sm">
        {username ? (
          <>
            <span className="text-zinc-400">
              Signed in as{" "}
              <span className="font-medium text-zinc-200">{username}</span>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 transition hover:bg-zinc-800"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 transition hover:bg-zinc-800"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-white transition hover:bg-violet-500"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
