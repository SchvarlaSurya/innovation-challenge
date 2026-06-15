/**
 * app/layout.tsx — Root layout
 * Wraps every route. PublicLayout owns nav + footer.
 * Auth-required /admin routes are protected by proxy.ts and use the
 * AdminSidebar/AdminTopBar from @/components/admin/AdminLayoutComponents
 * via app/admin/layout.tsx — but RootLayout still wraps everything.
 *
 * To avoid double nav on /admin, we strip the global PublicLayout chrome
 * on /admin/* paths and let app/admin/layout.tsx handle the chrome.
 */
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { headers } from 'next/headers';
import PublicLayout from '@/components/PublicLayout';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SitaanKu — Sistem Manajemen Sitaan & Kebersihan',
  description:
    'Platform digital untuk divisi kebersihan OSIS dalam mengelola sitaan dan penilaian kebersihan kelas.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const pathname = h.get('x-invoke-path') || h.get('x-pathname') || '';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="id" className={`${plusJakartaSans.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-on-background font-sans">
        {isAdmin ? (
          <main className="flex flex-1 flex-col">{children}</main>
        ) : (
          <PublicLayout>{children}</PublicLayout>
        )}
      </body>
    </html>
  );
}
