/**
 * components/admin/SummaryCard.tsx
 * Dashboard stat card with icon, color-coded accent.
 */
import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  subtitle: string;
  color: 'amber' | 'red' | 'blue' | 'emerald';
  icon: ReactNode;
}

const colorMap = {
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
};

export default function SummaryCard({ title, value, subtitle, color, icon }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[color]}`}>
          {icon}
        </span>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div className="mt-2">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</div>
      </div>
    </div>
  );
}
