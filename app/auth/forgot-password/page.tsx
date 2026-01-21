import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-blue-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-black/5">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Forgot password
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            This page is not implemented yet.
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              href="/auth/login"
              className="rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Back to Login
            </Link>
            <Link
              href="/"
              className="rounded-full border px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Back Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
