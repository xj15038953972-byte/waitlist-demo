import { AuthNav } from "@/components/AuthNav";
import { LoginForm } from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.25),_transparent_55%)]" />
      <AuthNav />
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <LoginForm />
      </main>
    </div>
  );
}
