const inputClassName =
  "h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-base text-zinc-100 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60";

const buttonClassName =
  "h-12 w-full rounded-xl bg-violet-600 text-base font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60";

export function AuthField({
  label,
  ...props
}: React.ComponentProps<"input"> & { label: string }) {
  return (
    <label className="block text-left text-sm text-zinc-300">
      <span className="mb-2 block">{label}</span>
      <input className={inputClassName} {...props} />
    </label>
  );
}

export function AuthSubmitButton({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading: boolean;
}) {
  return (
    <button type="submit" disabled={loading} className={buttonClassName}>
      {loading ? "Please wait..." : children}
    </button>
  );
}

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_55%)]" />

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-20">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm text-violet-300">WaitLess-waitlist</p>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-3 text-sm text-zinc-400">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
          {children}
        </div>
      </main>
    </div>
  );
}
