/**
 * app/layout.tsx — Root layout with navigation + Sitaanku branding
 */
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { PublicNav, PublicFooter } from "@/components/PublicLayout";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SitaanKu — Sistem Manajemen Sitaan & Kebersihan",
  description: "Platform digital untuk divisi kebersihan OSIS dalam mengelola sitaan dan penilaian kebersihan kelas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.className} h-full antialiased`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background font-sans">
        <PublicNav />
        <main className="flex flex-1 flex-col">{children}</main>
        {/* Footer */}
        <PublicFooter />
      </body>
    </html>
  );
}
