import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar - hidden on mobile, visible on md+ */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        {/* Main Content Area */}
        <div className="flex flex-col min-h-screen">
          {/* Topbar - sticky at top */}
          <Topbar sticky />
          
          {/* Page Content */}
          <section className="flex-1 bg-bg">{children}</section>
        </div>
      </div>
    </main>
  );
}
