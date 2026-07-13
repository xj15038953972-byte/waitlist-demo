"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { buttonClassName, inputClassName } from "@/components/auth-styles";

type FormStatus = "idle" | "loading" | "success" | "error";

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Registration failed. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message);
      router.push("/");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-left">
      <h1 className="text-2xl font-semibold text-zinc-50">Create account</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Register with a username and password. Add your email when joining the
        waitlist.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm text-zinc-300">
            Username
          </label>
          <input
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
            disabled={status === "loading"}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm text-zinc-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
            disabled={status === "loading"}
            className={inputClassName}
          />
        </div>

        <button type="submit" disabled={status === "loading"} className={buttonClassName}>
          {status === "loading" ? "Creating account..." : "Create account"}
        </button>
      </form>

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

      <p className="mt-6 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="text-violet-300 hover:text-violet-200">
          Log in
        </Link>
      </p>
    </div>
  );
}
