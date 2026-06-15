import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createAuthClient } from '@/lib/supabase-server';
import { getAdminSummary } from '@/lib/queries';
import { formatRupiah } from '@/utils/helpers';

export default async function AdminDashboardPage() {
  const supabase = await createAuthClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  const summary = await getAdminSummary();

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1280px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-background">Dashboard</h2>
          <p className="text-sm text-on-surface-variant">Pantau kepatuhan dan kebersihan sekolah hari ini.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline text-on-surface font-semibold text-sm rounded-lg hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined text-sm">download</span>
            Ekspor Laporan
          </button>
          <Link href="/admin/sitaan/tambah" className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-sm">add</span>
            Input Sitaan
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sitaan Aktif */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-error-container text-error rounded-lg">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold">Sitaan Aktif</p>
          <h3 className="text-3xl font-bold text-on-background mt-1">{summary.activeConfiscations}</h3>
        </div>

        {/* Kelas Peringatan (Mapped to totalFines for now or keep static if no data) */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary-fixed text-tertiary rounded-lg">
              <span className="material-symbols-outlined">warning</span>
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold">Resolusi (Sudah diambil)</p>
          <h3 className="text-3xl font-bold text-on-background mt-1">{summary.resolvedConfiscations}</h3>
        </div>

        {/* Total Denda */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-fixed text-secondary rounded-lg">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-[10px] font-bold text-on-secondary-container bg-secondary-container px-2 py-1 rounded-full">Belum dibayar</span>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold">Total Denda</p>
          <h3 className="text-3xl font-bold text-on-background mt-1">{formatRupiah(summary.totalFines)}</h3>
        </div>

        {/* Selesai Hari Ini */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm group hover:border-primary transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">Hari Ini</span>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold">Kegiatan Hari Ini</p>
          <h3 className="text-3xl font-bold text-on-background mt-1">{summary.todaysConfiscations}</h3>
        </div>
      </div>

      {/* Content Row: 60/40 */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left: Menu Cepat (60%) */}
        <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h4 className="text-xl font-bold text-on-background">Menu Cepat</h4>
          </div>
          <div className="p-6 grid gap-4 sm:grid-cols-2">
            <QuickLink href="/admin/sitaan" icon="inventory_2" title="Kelola Sitaan" desc="Lihat & filter semua sitaan" />
            <QuickLink href="/admin/sitaan/tambah" icon="add_box" title="Tambah Sitaan" desc="Input sitaan baru" />
            <QuickLink href="/admin/nilai" icon="analytics" title="Input Nilai Kebersihan" desc="Beri skor per kelas" />
            <QuickLink href="/admin/laporan" icon="description" title="Laporan" desc="Statistik & riwayat" />
          </div>
        </div>

        {/* Right: Info Box (40%) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col">
          <div className="p-6 border-b border-outline-variant">
            <h4 className="text-xl font-bold text-on-background">Informasi</h4>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-primary-container text-on-primary-container rounded-lg border border-primary/20">
              <span className="material-symbols-outlined text-3xl">info</span>
              <div>
                <p className="text-sm font-bold">Peringatan Sistem</p>
                <p className="text-xs mt-1">Gunakan dashboard ini untuk memantau semua kegiatan sitaan dan kebersihan secara real-time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="text-center py-4 text-sm text-on-surface-variant border-t border-outline-variant mt-8">
        <p>© 2026 CleanProof Management System • Dibuat oleh Tim IT OSIS</p>
      </footer>
    </div>
  );
}

/** Internal quick-link card */
function QuickLink({ href, icon, title, desc }: { href: string; icon: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="flex gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 transition hover:border-primary hover:shadow-md group"
    >
      <div className="w-12 h-12 flex-shrink-0 bg-surface-container text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <div className="font-bold text-on-surface">{title}</div>
        <div className="text-xs text-on-surface-variant mt-1">{desc}</div>
      </div>
    </Link>
  );
}
