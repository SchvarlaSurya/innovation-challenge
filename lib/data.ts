/**
 * lib/data.ts — In-memory mock data + helpers for the public pages.
 * Will be replaced by Supabase queries when env vars are configured.
 */

export type ConfiscationStatus = 'warning' | 'fined' | 'resolved';

export interface ClassRecord {
  id: string;
  name: string;
  grade: number;
  totalStudents: number;
  waliKelas: string;
}

export interface ConfiscationRecord {
  id: string;
  classId: string;
  itemType: string;
  quantity: number;
  confiscatedAt: string; // ISO date
  status: ConfiscationStatus;
  fineAmount: number;
  notes?: string;
}

export interface CleanlinessScore {
  id: string;
  classId: string;
  period: string;
  score: number;
  scoredAt: string;
}

// ──────────────────────────────────────────────────────────
// Seed data (synthetic; in production this comes from Supabase)
// ──────────────────────────────────────────────────────────
export const classes: ClassRecord[] = [
  { id: 'c1',  name: 'X-A',   grade: 10, totalStudents: 32, waliKelas: 'Ibu Rina' },
  { id: 'c2',  name: 'X-B',   grade: 10, totalStudents: 30, waliKelas: 'Pak Doni' },
  { id: 'c3',  name: 'XI-1',  grade: 11, totalStudents: 31, waliKelas: 'Ibu Sari' },
  { id: 'c4',  name: 'XI-2',  grade: 11, totalStudents: 29, waliKelas: 'Pak Andi' },
  { id: 'c5',  name: 'XII-1', grade: 12, totalStudents: 30, waliKelas: 'Ibu Maya' },
  { id: 'c6',  name: 'XII-2', grade: 12, totalStudents: 28, waliKelas: 'Pak Hendra' },
  { id: 'c7',  name: 'X-C',   grade: 10, totalStudents: 31, waliKelas: 'Ibu Lina' },
  { id: 'c8',  name: 'XI-3',  grade: 11, totalStudents: 30, waliKelas: 'Pak Yusuf' },
  { id: 'c9',  name: 'XII-3', grade: 12, totalStudents: 27, waliKelas: 'Ibu Tika' },
  { id: 'c10', name: 'X-D',   grade: 10, totalStudents: 30, waliKelas: 'Pak Bagas' },
];

export const confiscations: ConfiscationRecord[] = [
  { id: 'i1',  classId: 'c1',  itemType: 'Topi',         quantity: 2, confiscatedAt: '2026-06-10', status: 'warning',  fineAmount: 0,      notes: 'Pelanggaran pertama' },
  { id: 'i2',  classId: 'c2',  itemType: 'Dasi',         quantity: 3, confiscatedAt: '2026-06-12', status: 'fined',    fineAmount: 15000, notes: 'Siswa kelas X-B' },
  { id: 'i3',  classId: 'c3',  itemType: 'Sepatu',       quantity: 1, confiscatedAt: '2026-06-13', status: 'fined',    fineAmount: 5000 },
  { id: 'i4',  classId: 'c4',  itemType: 'Sabuk',        quantity: 1, confiscatedAt: '2026-06-14', status: 'warning',  fineAmount: 0 },
  { id: 'i5',  classId: 'c5',  itemType: 'Topi',         quantity: 4, confiscatedAt: '2026-06-09', status: 'fined',    fineAmount: 20000, notes: 'Sudah pernah ditegur' },
  { id: 'i6',  classId: 'c6',  itemType: 'Dasi',         quantity: 2, confiscatedAt: '2026-06-08', status: 'resolved', fineAmount: 10000, notes: 'Sudah diambil kembali' },
  { id: 'i7',  classId: 'c7',  itemType: 'Kaos Kaki',    quantity: 5, confiscatedAt: '2026-06-15', status: 'fined',    fineAmount: 25000 },
  { id: 'i8',  classId: 'c8',  itemType: 'Baju Olah Raga', quantity: 1, confiscatedAt: '2026-06-11', status: 'warning', fineAmount: 0 },
  { id: 'i9',  classId: 'c9',  itemType: 'Topi',         quantity: 1, confiscatedAt: '2026-06-10', status: 'resolved', fineAmount: 5000, notes: 'Lunas' },
  { id: 'i10', classId: 'c10', itemType: 'Sepatu',       quantity: 2, confiscatedAt: '2026-06-14', status: 'warning',  fineAmount: 0 },
  { id: 'i11', classId: 'c2',  itemType: 'Dasi',         quantity: 1, confiscatedAt: '2026-06-15', status: 'fined',    fineAmount: 5000 },
  { id: 'i12', classId: 'c5',  itemType: 'Sabuk',        quantity: 1, confiscatedAt: '2026-06-15', status: 'warning',  fineAmount: 0, notes: 'Pelanggaran pertama' },
];

export const scores: CleanlinessScore[] = [
  { id: 's1',  classId: 'c1',  period: '2026-W23', score: 92, scoredAt: '2026-06-14' },
  { id: 's2',  classId: 'c2',  period: '2026-W23', score: 78, scoredAt: '2026-06-14' },
  { id: 's3',  classId: 'c3',  period: '2026-W23', score: 85, scoredAt: '2026-06-14' },
  { id: 's4',  classId: 'c4',  period: '2026-W23', score: 88, scoredAt: '2026-06-14' },
  { id: 's5',  classId: 'c5',  period: '2026-W23', score: 70, scoredAt: '2026-06-14' },
  { id: 's6',  classId: 'c6',  period: '2026-W23', score: 95, scoredAt: '2026-06-14' },
  { id: 's7',  classId: 'c7',  period: '2026-W23', score: 75, scoredAt: '2026-06-14' },
  { id: 's8',  classId: 'c8',  period: '2026-W23', score: 89, scoredAt: '2026-06-14' },
  { id: 's9',  classId: 'c9',  period: '2026-W23', score: 90, scoredAt: '2026-06-14' },
  { id: 's10', classId: 'c10', period: '2026-W23', score: 82, scoredAt: '2026-06-14' },
];

// ──────────────────────────────────────────────────────────
// Public status metadata
// ──────────────────────────────────────────────────────────
export const STATUS_META: Record<
  ConfiscationStatus,
  { label: string; icon: string; chipClass: string }
> = {
  warning: {
    label: 'Peringatan',
    icon: 'warning',
    chipClass: 'bg-yellow-100   text-yellow-800  dark:bg-yellow-900/40  dark:text-yellow-200',
  },
  fined: {
    label: 'Denda Aktif',
    icon: 'gavel',
    chipClass: 'bg-red-100      text-red-800     dark:bg-red-900/40     dark:text-red-200',
  },
  resolved: {
    label: 'Selesai',
    icon: 'check_circle',
    chipClass: 'bg-emerald-100  text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  },
};

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
export function getClassById(id: string): ClassRecord | undefined {
  return classes.find((c) => c.id === id);
}

export function getConfiscationsForClass(classId: string): ConfiscationRecord[] {
  return confiscations
    .filter((c) => c.classId === classId)
    .sort((a, b) => b.confiscatedAt.localeCompare(a.confiscatedAt));
}

export function getClassSummary(classId: string) {
  const items = getConfiscationsForClass(classId);
  return {
    totalConfiscations: items.length,
    activeConfiscations: items.filter((i) => i.status !== 'resolved').length,
    unpaidFines: items.reduce(
      (sum, i) => (i.status === 'fined' ? sum + i.fineAmount : sum),
      0,
    ),
    resolvedCount: items.filter((i) => i.status === 'resolved').length,
  };
}

export function getLatestScoreForClass(classId: string): CleanlinessScore | undefined {
  return scores
    .filter((s) => s.classId === classId)
    .sort((a, b) => b.scoredAt.localeCompare(a.scoredAt))[0];
}

export function getLeaderboard(): Array<{
  id: string;
  name: string;
  grade: number;
  totalStudents: number;
  waliKelas: string;
  score: number;
  rank: number;
  medals: 'gold' | 'silver' | 'bronze' | null;
}> {
  return classes
    .map((c) => {
      const latest = getLatestScoreForClass(c.id);
      return {
        id: c.id,
        name: c.name,
        grade: c.grade,
        totalStudents: c.totalStudents,
        waliKelas: c.waliKelas,
        score: latest?.score ?? 0,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((row, idx) => ({
      ...row,
      rank: idx + 1,
      medals:
        idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : null,
    }));
}

export function getTotalStats() {
  const active = confiscations.filter((i) => i.status !== 'resolved').length;
  const unpaidFines = confiscations
    .filter((i) => i.status === 'fined')
    .reduce((sum, i) => sum + i.fineAmount, 0);
  const avgScore = scores.length === 0
    ? 0
    : Math.round(scores.reduce((s, r) => s + r.score, 0) / scores.length);
  return { totalActive: active, totalUnpaidFines: unpaidFines, avgScore };
}

// ──────────────────────────────────────────────────────────
// Formatting
// ──────────────────────────────────────────────────────────
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const DATE_FMT = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatDateIndo(iso: string): string {
  // Accept either ISO datetime or YYYY-MM-DD
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return DATE_FMT.format(d);
}
