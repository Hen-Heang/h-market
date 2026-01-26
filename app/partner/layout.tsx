import Sidebar from "@/components/partner/Sidebar";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 gap-0 md:grid-cols-[260px_1fr]">
        <Sidebar />
        <section className="bg-slate-50 px-6 py-8">{children}</section>
      </div>
    </main>
  );
}
