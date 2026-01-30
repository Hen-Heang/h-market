import { Suspense } from "react";
import LoginCard from "@/components/auth/LoginCard";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(16,185,129,0.14),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(6,182,212,0.14),transparent_40%),linear-gradient(180deg,#f8fafc_0%,#ffffff_45%,#ecfeff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <Suspense
          fallback={<div className="h-80 w-full max-w-5xl rounded-3xl bg-white/70" />}
        >
          <LoginCard />
        </Suspense>
      </div>
    </main>
  );
}
