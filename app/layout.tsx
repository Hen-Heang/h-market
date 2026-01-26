import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "H-Market",
  description: "H-Market connects partners and merchants for modern B2B commerce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${sora.variable} ${fraunces.variable} antialiased font-sans`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
