/**
 * app/page.tsx — Beranda (Public welcome page)
 * Leads user to leaderboard, kelas list, and explains the system.
 */
import Link from 'next/link';
import { getTotalStats, classes } from '@/lib/data';

export default function HomePage() {
  const stats = getTotalStats();
  const totalClasses = classes.length;

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl bg-primary-container text-on-primary-container">
        <div className="grid gap-6 p-6 sm:p-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest opacity-80">
              OSIS · Divisi Kebersihan
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Pantau Kebersihan & Sitaan Kelas secara Transparan
            </h1>
            <p className="mt-3 max-w-prose text-sm sm:text-base opacity-90">
              SitaanKu menampilkan status sitaan, denda, dan peringkat kebersihan setiap kelas
              di sekolah. Data dapat diakses oleh seluruh siswa tanpa login.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-sm transition hover:brightness-110"
              >
                <span className="material-symbols-outlined text-lg">leaderboard</span>
                Lihat Peringkat
              </Link>
              <Link
                href="/kelas/c1"
                className="inline-flex items-center gap-2 rounded-full bg-surface px-5 py-3 text-sm font-semibold text-primary shadow-sm transition hover:brightness-95"
              >
                <span className="material-symbols-outlined text-lg">school</span>
                Lihat Data Kelas
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total Kelas" value={totalClasses} icon="school" />
            <StatCard label="Sitaan Aktif" value={stats.totalActive} icon="inventory_2" />
            <StatCard label="Denda Belum Lunas" value={`Rp ${(stats.totalUnpaidFines / 1000).toFixed(0)}k`} icon="payments" />
            <StatCard label="Rata-rata Skor" value={stats.avgScore} icon="verified" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Cara Kerja Sistem</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Step
            step="1"
            title="Pelanggaran Pertama"
            body="Status: Peringatan. Tidak ada denda. Kelas mendapat kesempatan untuk tertib."
            tone="warning"
          />
          <Step
            step="2"
            title="Pelanggaran Berikutnya"
            body="Status: Denda Aktif. Denda otomatis dihitung: jumlah × Rp5.000."
            tone="fined"
          />
          <Step
            step="3"
            title="Pengambilan Barang"
            body="Setelah denda dibayar, OSIS mengonfirmasi. Status menjadi Selesai."
            tone="resolved"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-secondary-container p-6 text-on-secondary-container sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Cek status kelasmu sekarang</h2>
            <p className="mt-1 text-sm opacity-90">
              Pilih kelas di halaman peringkat untuk melihat rincian sitaan dan skor.
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-on-secondary shadow-sm transition hover:brightness-110"
          >
            Buka Peringkat
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-4 text-on-surface shadow-sm">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
}

function Step({
  step,
  title,
  body,
  tone,
}: {
  step: string;
  title: string;
  body: string;
  tone: 'warning' | 'fined' | 'resolved';
}) {
  const toneClass: Record<typeof tone, string> = {
    warning:  'bg-yellow-100  text-yellow-800  dark:bg-yellow-900/40  dark:text-yellow-200',
    fined:    'bg-red-100     text-red-800     dark:bg-red-900/40     dark:text-red-200',
    resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  };
  return (
    <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-5">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full font-bold ${toneClass[tone]}`}>
        {step}
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 text-sm text-on-surface-variant">{body}</p>
    </div>
  );
}
