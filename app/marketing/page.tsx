import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import HowItWorks from "@/components/marketing/HowItWorks";
import Footer from "@/components/marketing/Footer";

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-cyan-50/40">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
}
