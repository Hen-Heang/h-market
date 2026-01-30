import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
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
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            expand={false}
            closeButton
            duration={2600}
            toastOptions={{
              className: "sonner-toast",
              classNames: {
                title: "sonner-title",
                description: "sonner-description",
                actionButton: "sonner-action",
                cancelButton: "sonner-cancel",
                closeButton: "sonner-close",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
