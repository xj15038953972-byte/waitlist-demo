import { AuthNav } from "@/components/AuthNav";
import { WaitlistForm } from "@/components/WaitlistForm";
import { getCurrentUser } from "@/lib/auth";
import { getUserWaitlistEntry } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();
  const userEntry = user ? await getUserWaitlistEntry(user.id) : null;

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_55%)]" />
      <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <AuthNav username={user?.username} />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-200">
          WaitLess-waitlist
        </div>

        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Spend less time waiting.
          <span className="block text-violet-300">Get early access.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Create an account, log in from any device, and join the waitlist once
          per account.
        </p>

        <div className="mt-10 w-full flex flex-col items-center">
          <WaitlistForm
            isLoggedIn={Boolean(user)}
            waitlistEmail={userEntry?.email ?? null}
            waitlistEntryId={userEntry?.id ?? null}
            hasJoined={Boolean(userEntry)}
          />
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          One waitlist entry per account. Log in anywhere to manage your signup.
        </p>
      </main>
    </div>
  );
}
