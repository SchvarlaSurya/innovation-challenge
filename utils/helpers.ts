/**
 * utils/helpers.ts
 *
 * Utility functions for SitaanKu:
 * - Fine calculation (warning vs fine logic)
 * - Indonesian Rupiah formatting
 * - Status badge mapping
 */

/** IDR currency formatter */
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/** Map a status string to its display label + icon */
export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'warning':
      return { label: 'Peringatan', icon: '⚠️', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    case 'fined':
      return { label: 'Denda Aktif', icon: '🔴', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' };
    case 'resolved':
      return { label: 'Selesai', icon: '✅', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' };
    default:
      return { label: status, icon: '', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800' };
  }
};

/** Rank badge for cleanliness leaderboard */
export const getRankBadge = (rank: number): string => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

/** Format date to Indonesian locale */
export const formatDateIndo = (date: string): string => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/** Format date to short Indonesian locale */
export const formatDateShort = (date: string): string => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
