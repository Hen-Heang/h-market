import { Suspense } from "react";

import ForgotPasswordCard from "./forgot-password-card";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,_rgba(16,185,129,0.12),_transparent_45%),_radial-gradient(circle_at_90%_0%,_rgba(59,130,246,0.12),_transparent_40%),_linear-gradient(180deg,_#f8fafc_0%,_#ffffff_45%,_#ecfeff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <Suspense
          fallback={
            <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white p-10 shadow-xl ring-1 ring-black/5">
              <div className="h-6 w-56 animate-pulse rounded bg-slate-200/80" />
              <div className="mt-6 h-10 w-full animate-pulse rounded bg-slate-200/80" />
              <div className="mt-3 h-10 w-full animate-pulse rounded bg-slate-200/80" />
              <div className="mt-6 h-10 w-40 animate-pulse rounded bg-slate-200/80" />
            </div>
          }
        >
          <ForgotPasswordCard />
        </Suspense>
      </div>
    </main>
  );
}
