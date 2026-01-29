import LoginCard from "@/components/auth/LoginCard";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(16,185,129,0.12),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(249,115,22,0.12),transparent_40%),linear-gradient(180deg,#f8fafc_0%,#ffffff_45%,#ecfeff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <LoginCard />
      </div>
    </main>
  );
}
