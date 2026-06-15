/**
 * app/admin/laporan/page.tsx — Reports & statistics (admin)
 * Shows confiscation history, fine totals, score trends, top offenders.
 * The parent app/admin/layout.tsx already provides the AdminSidebar + TopBar.
 */
import {
  getAllConfiscationsWithClass,
  getAllClasses,
  getAllWarnings,
} from '@/lib/queries';
import { formatRupiah } from '@/utils/helpers';
import type { ClassWarning, ConfiscatedItem, Class } from '@/types';

interface ConfiscationWithClass extends ConfiscatedItem {
  classes: Pick<Class, 'id' | 'name' | 'grade'> | null;
}

interface TopOffender {
  class: Class;
  offenseCount: number;
  unpaid: number;
}

export default async function LaporanPage() {
  const [items, classes, warnings] = await Promise.all([
    getAllConfiscationsWithClass(),
    getAllClasses(),
    getAllWarnings(),
  ]);

  // Build warnings map by class_id
  const warningMap = new Map<string, ClassWarning>(
    (warnings as ClassWarning[]).map((w) => [w.class_id, w]),
  );

  // Top offenders
  const topOffenders: TopOffender[] = (classes as Class[])
    .map((c) => ({
      class: c,
      offenseCount: warningMap.get(c.id)?.offense_count ?? 0,
      unpaid: warningMap.get(c.id)?.total_unpaid_fine ?? 0,
    }))
    .filter((row) => row.offenseCount > 0)
    .sort((a, b) => b.offenseCount - a.offenseCount)
    .slice(0, 5);

  // Status counts
  const statusCounts = {
    warning: items.filter((i: any) => i.status === 'warning').length,
    fined: items.filter((i: any) => i.status === 'fined').length,
    resolved: items.filter((i: any) => i.status === 'resolved').length,
  };

  // Last 30 days activity
  const last30 = new Date();
  last30.setDate(last30.getDate() - 30);
  const recentItems = (items as ConfiscationWithClass[]).filter(
    (i: any) => new Date(i.confiscated_at) >= last30,
  );

  // Last 7 days chart data
  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = items.filter(
      (it: any) => it.confiscated_at.slice(0, 10) === key,
    ).length;
    days.push({
      label: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
      count,
    });
  }
  const maxDaily = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Laporan & Statistik</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Ringkasan data sitaan dan kebersihan
        </p>
      </header>

      {/* Status summary */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-900 dark:bg-yellow-950/40">
          <div className="text-3xl">⚠️</div>
          <div className="mt-2 text-2xl font-bold">{statusCounts.warning}</div>
          <div className="text-sm text-zinc-500">Peringatan Aktif</div>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/40">
          <div className="text-3xl">🔴</div>
          <div className="mt-2 text-2xl font-bold">{statusCounts.fined}</div>
          <div className="text-sm text-zinc-500">Denda Aktif</div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
          <div className="text-3xl">✅</div>
          <div className="mt-2 text-2xl font-bold">{statusCounts.resolved}</div>
          <div className="text-sm text-zinc-500">Terselesaikan</div>
        </div>
      </section>

      {/* Last 7 days activity chart */}
      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold">Aktivitas 7 Hari Terakhir</h2>
        <div className="flex h-40 items-end gap-2">
          {days.map((d) => {
            const heightPct = (d.count / maxDaily) * 100;
            return (
              <div key={d.label} className="flex flex-1 flex-col items-center">
                <div className="text-xs text-zinc-500 mb-1">{d.count}</div>
                <div
                  className="w-full rounded-t-md bg-emerald-500 transition-all"
                  style={{ height: `${heightPct}%`, minHeight: '4px' }}
                />
                <div className="mt-1 text-xs text-zinc-500 truncate max-w-full">
                  {d.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top offenders */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Kelas dengan Pelanggaran Terbanyak</h2>
        {topOffenders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
            Belum ada data pelanggaran.
          </div>
        ) : (
          <div className="grid gap-3">
            {topOffenders.map((row, idx) => (
              <div
                key={row.class.id}
                className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold dark:bg-zinc-800">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{row.class.name}</div>
                  <div className="text-sm text-zinc-500">
                    {row.offenseCount} pelanggaran · {formatRupiah(row.unpaid)} belum dibayar
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent activity */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Aktivitas 30 Hari Terakhir ({recentItems.length})</h2>
        {recentItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
            Belum ada aktivitas dalam 30 hari terakhir.
          </div>
        ) : (
          <div className="grid gap-2">
            {recentItems.slice(0, 10).map((it: ConfiscationWithClass) => (
              <div
                key={it.id}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <span className="font-medium">{it.item_type}</span>
                  <span className="ml-2 text-zinc-500">×{it.quantity}</span>
                  <span className="ml-2 text-zinc-500">· {it.classes?.name}</span>
                </div>
                <span className="text-xs text-zinc-500">
                  {new Date(it.confiscated_at).toLocaleDateString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
