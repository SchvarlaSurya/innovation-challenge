/**
 * app/leaderboard/page.tsx — Public cleanliness leaderboard
 * Shows all classes ranked by latest cleanliness score.
 * Each row links to /kelas/[id] for details.
 */
import Link from 'next/link';
import { getLeaderboard } from '@/lib/data';

export default function LeaderboardPage() {
  const rows = getLeaderboard();

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Peringkat Mingguan
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Peringkat Kebersihan Kelas</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Diurutkan berdasarkan skor kebersihan periode <strong>2026-W23</strong>. Klik kelas
          untuk melihat rincian sitaan.
        </p>
      </header>

      {/* Top-3 podium */}
      <section className="grid gap-3 sm:grid-cols-3">
        {rows.slice(0, 3).map((row) => (
          <Link
            key={row.id}
            href={`/kelas/${row.id}`}
            className={
              'group flex items-center gap-3 rounded-2xl border border-outline-variant/40 p-4 transition ' +
              'bg-surface-container-low hover:border-primary/40 hover:shadow-md'
            }
          >
            <Podium rank={row.rank} medals={row.medals} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-bold">{row.name}</div>
              <div className="text-xs text-on-surface-variant">
                Kelas {row.grade} · {row.totalStudents} siswa
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{row.score}</div>
              <div className="text-[10px] uppercase tracking-wide text-on-surface-variant">skor</div>
            </div>
          </Link>
        ))}
      </section>

      {/* Full table */}
      <section className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
        <table className="w-full text-sm">
          <thead className="bg-surface-container text-left text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">Peringkat</th>
              <th className="px-4 py-3">Kelas</th>
              <th className="px-4 py-3">Wali Kelas</th>
              <th className="px-4 py-3 text-right">Skor</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-outline-variant/30 transition hover:bg-surface-container-low"
              >
                <td className="px-4 py-3">
                  <Podium rank={row.rank} medals={row.medals} compact />
                </td>
                <td className="px-4 py-3 font-semibold">{row.name}</td>
                <td className="px-4 py-3 text-on-surface-variant">{row.waliKelas}</td>
                <td className="px-4 py-3 text-right text-lg font-bold text-primary">{row.score}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/kelas/${row.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1.5 text-xs font-semibold text-on-secondary-container transition hover:brightness-110"
                  >
                    Detail
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Podium({
  rank,
  medals,
  compact = false,
}: {
  rank: number;
  medals: 'gold' | 'silver' | 'bronze' | null;
  compact?: boolean;
}) {
  const size = compact ? 'h-7 w-7 text-xs' : 'h-12 w-12 text-base';
  const medalStyle: Record<NonNullable<typeof medals>, string> = {
    gold:   'bg-yellow-100   text-yellow-700   dark:bg-yellow-900/50   dark:text-yellow-200',
    silver: 'bg-zinc-200     text-zinc-700     dark:bg-zinc-700/50     dark:text-zinc-200',
    bronze: 'bg-orange-100   text-orange-700   dark:bg-orange-900/50   dark:text-orange-200',
  };
  const cls = medals
    ? medalStyle[medals]
    : 'bg-surface-container text-on-surface-variant';
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full font-bold ${size} ${cls}`}>
      {medals ? <span className="material-symbols-outlined text-base">emoji_events</span> : rank}
    </div>
  );
}
