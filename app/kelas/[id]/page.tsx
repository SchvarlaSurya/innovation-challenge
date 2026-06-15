/**
 * app/kelas/[id]/page.tsx — Public class detail page
 * Shows cleanliness score, list of confiscations, and a summary.
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  classes,
  getClassById,
  getConfiscationsForClass,
  getClassSummary,
  getLatestScoreForClass,
  STATUS_META,
  formatRupiah,
  formatDateIndo,
  type ConfiscationStatus,
} from '@/lib/data';

export function generateStaticParams() {
  return classes.map((c) => ({ id: c.id }));
}

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const classData = getClassById(id);
  if (!classData) notFound();

  const items = getConfiscationsForClass(id);
  const summary = getClassSummary(id);
  const latest = getLatestScoreForClass(id);

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/leaderboard"
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Kembali ke Peringkat
      </Link>

      {/* Header card */}
      <header className="rounded-3xl bg-primary-container p-6 text-on-primary-container sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
              Kelas {classData.grade}
            </p>
            <h1 className="mt-1 text-3xl font-bold">{classData.name}</h1>
            <p className="mt-1 text-sm opacity-90">
              Wali Kelas: {classData.waliKelas} · {classData.totalStudents} siswa
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold leading-none">{latest?.score ?? '–'}</div>
            <div className="mt-1 text-xs uppercase tracking-wider opacity-80">
              Skor Kebersihan
            </div>
          </div>
        </div>
      </header>

      {/* Summary stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total Sitaan"     value={summary.totalConfiscations} icon="inventory_2" />
        <Stat label="Sitaan Aktif"     value={summary.activeConfiscations} icon="pending_actions" />
        <Stat label="Denda Belum Lunas" value={formatRupiah(summary.unpaidFines)} icon="payments" />
        <Stat label="Sudah Selesai"    value={summary.resolvedCount} icon="check_circle" />
      </section>

      {/* Confiscation list */}
      <section>
        <h2 className="mb-4 text-lg font-bold">Riwayat Sitaan</h2>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-low p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-emerald-500">verified</span>
            <p className="mt-2 font-semibold">Bersih!</p>
            <p className="text-sm text-on-surface-variant">
              Tidak ada catatan sitaan untuk kelas ini.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => {
              const meta = STATUS_META[item.status];
              return (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${statusBg(item.status)}`}
                  >
                    <span className="material-symbols-outlined">{meta.icon}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">
                      {item.itemType}{' '}
                      <span className="text-on-surface-variant">× {item.quantity}</span>
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {formatDateIndo(item.confiscatedAt)}
                      {item.notes ? ` · ${item.notes}` : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`chip ${meta.chipClass}`}>{meta.label}</div>
                    {item.fineAmount > 0 && (
                      <div className="mt-1 text-sm font-bold text-red-600 dark:text-red-400">
                        {formatRupiah(item.fineAmount)}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function statusBg(s: ConfiscationStatus): string {
  return s === 'warning' ? 'bg-yellow-500' : s === 'fined' ? 'bg-red-500' : 'bg-emerald-500';
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-4">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      <div className="mt-2 text-xl font-bold">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-on-surface-variant">{label}</div>
    </div>
  );
}
