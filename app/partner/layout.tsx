import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-cyan-50/50">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 gap-0 md:grid-cols-[260px_1fr]">
        {/* Sidebar - hidden on mobile, visible on md+ */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex min-h-screen flex-col bg-slate-50/70 backdrop-blur">
          {/* Topbar - sticky at top */}
          <Topbar sticky />

          {/* Page Content */}
          <section className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</section>
        </div>
      </div>
    </main>
  );
}
