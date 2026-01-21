import RoleSelectCard from "@/components/auth/RoleSelectCard";

export default function ChooseRolePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-blue-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <RoleSelectCard />
      </div>
    </main>
  );
}
