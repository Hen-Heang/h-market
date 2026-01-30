import { Suspense } from "react";
import SignUpCard from "@/components/auth/SignUpCard";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,_rgba(16,185,129,0.14),_transparent_45%),_radial-gradient(circle_at_90%_0%,_rgba(6,182,212,0.14),_transparent_40%),_linear-gradient(180deg,_#f8fafc_0%,_#ffffff_45%,_#ecfeff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <Suspense
          fallback={<div className="h-80 w-full max-w-5xl rounded-3xl bg-white/70" />}
        >
          <SignUpCard />
        </Suspense>
      </div>
    </main>
  );
}
