import SignUpCard from "@/components/auth/SignUpCard";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,_rgba(16,185,129,0.12),_transparent_45%),_radial-gradient(circle_at_90%_0%,_rgba(249,115,22,0.12),_transparent_40%),_linear-gradient(180deg,_#f8fafc_0%,_#ffffff_45%,_#ecfeff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <SignUpCard />
      </div>
    </main>
  );
}
