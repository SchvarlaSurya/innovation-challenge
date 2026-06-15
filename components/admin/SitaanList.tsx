/**
 * components/admin/SitaanList.tsx
 * Client component: filters + list for confiscated items on /admin/sitaan.
 *
 * Receives pre-fetched items (joined with class) from the server, then
 * filters client-side using FilterBar's status chips.
 */
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import FilterBar from '@/components/admin/FilterBar';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatRupiah, getStatusLabel, formatDateIndo } from '@/utils/helpers';

interface ClassOpt {
  id: string;
  name: string;
  grade: string;
}

interface JoinedItem {
  id: string;
  class_id: string;
  item_type: string;
  quantity: number;
  photo_url: string | null;
  confiscated_at: string;
  status: 'warning' | 'fined' | 'resolved';
  fine_amount: number;
  notes: string | null;
  classes: Pick<ClassOpt, 'id' | 'name' | 'grade'> | null;
}

interface Props {
  items: JoinedItem[];
  classes: ClassOpt[];
}

export default function SitaanList({ items, classes }: Props) {
  const [filters, setFilters] = useState<{ status?: string; class_id?: string }>({});

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (filters.status && it.status !== filters.status) return false;
      if (filters.class_id && it.class_id !== filters.class_id) return false;
      return true;
    });
  }, [items, filters]);

  return (
    <div className="space-y-4">
      <FilterBar
        filters={filters}
        classes={classes}
        onFilterChange={setFilters}
        onClear={() => setFilters({})}
      />

      {filtered.length === 0 ? (
        <div className="material-card p-10 text-center text-on-surface-variant">
          Tidak ada data sitaan untuk filter ini.
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => {
            const meta = getStatusLabel(item.status);
            return (
              <Link
                key={item.id}
                href={`/admin/sitaan/${item.id}`}
                className="material-card group flex items-center gap-4 p-4 transition hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container">
                  <span className="material-symbols-outlined">inventory_2</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-on-surface">
                      {item.item_type}
                    </h3>
                    <StatusBadge status={item.status} label={meta.label} />
                  </div>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {item.classes ? `${item.classes.grade} • ${item.classes.name}` : '—'}
                    {' · '}
                    {item.quantity} unit
                    {' · '}
                    {formatDateIndo(item.confiscated_at)}
                  </p>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant">Denda</p>
                  <p className={`text-sm font-bold ${item.fine_amount > 0 ? 'text-error' : 'text-on-surface-variant'}`}>
                    {item.fine_amount > 0 ? formatRupiah(item.fine_amount) : '—'}
                  </p>
                </div>

                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">
                  chevron_right
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
