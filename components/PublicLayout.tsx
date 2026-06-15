/**
 * components/PublicLayout.tsx
 * Public-facing layout: sticky top bar + footer.
 * Navigation:
 *   🧹 SitaanKu (logo) → /
 *   Beranda          → /
 *   Peringkat        → /leaderboard
 *   Data Kelas       → /kelas (placeholder /kelas — handled by /kelas/[id] pages)
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/',             label: 'Beranda' },
  { href: '/leaderboard',  label: 'Peringkat' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      {/* Top app bar */}
      <header className="sticky top-0 z-30 border-b border-outline-variant/40 bg-surface-container/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-xl">cleaning_services</span>
            </span>
            <span className="text-lg">SitaanKu</span>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    'rounded-full px-4 py-2 text-sm font-semibold transition ' +
                    (active
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'text-on-surface-variant hover:bg-surface-container-high')
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-outline-variant/40 bg-surface-container-lowest">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-center text-xs text-on-surface-variant sm:px-6">
          © {new Date().getFullYear()} OSIS · Divisi Kebersihan · SitaanKu
        </div>
      </footer>
    </div>
  );
}
