'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

export function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', icon: 'dashboard', label: 'Dashboard' },
    { href: '/admin/sitaan', icon: 'inventory_2', label: 'Sitaan' },
    { href: '/admin/nilai', icon: 'analytics', label: 'Nilai Kebersihan' },
    { href: '/admin/laporan', icon: 'description', label: 'Laporan' },
  ];

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
    window.location.href = '/login';
  }

  return (
    <aside className="hidden md:flex flex-col h-full w-64 bg-surface-container-lowest border-r border-outline-variant p-2 gap-2 shadow-md shrink-0">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-primary">CleanProof</h1>
        <p className="text-xs text-on-surface-variant">Management System</p>
      </div>
      <nav className="flex-1 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="text-sm font-semibold">{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-outline-variant pt-4 pb-2">
        <div className="flex items-center gap-3 px-4 mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container text-on-primary-container">
            <div className="w-full h-full flex items-center justify-center font-bold">O</div>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Admin OSIS</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">OSIS Core Team</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full mt-2 flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/40 rounded-full transition-colors font-bold"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export function AdminTopBar() {
  return (
    <header className="flex justify-between items-center px-6 py-2 w-full border-b border-outline-variant bg-surface sticky top-0 z-10 min-h-[64px]">
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">search</span>
          </span>
          <input
            className="pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary text-sm w-64 md:w-96 outline-none"
            placeholder="Cari data, kelas, atau barang..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-surface-container transition-all relative"
          aria-label="Notifikasi"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </button>
        <div className="h-8 w-px bg-outline-variant mx-1"></div>
        <div className="flex items-center gap-2">
          <span className="hidden md:block text-sm font-semibold text-on-surface">Admin Dashboard</span>
        </div>
      </div>
    </header>
  );
}
