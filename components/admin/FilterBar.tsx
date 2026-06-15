/**
 * components/admin/FilterBar.tsx
 * Filter bar for confiscated-items lists.
 * Props: filters (status, class_id, classList), onChange, onClear.
 *
 * UI: Material 3 chips for status, Material 3 select for class.
 *
 * NOTE: Kelas dropdown is intentionally left commented out for now because the
 * `classes` type (id/name/grade) is not passed through. The filter currently
 * only supports filtering by `status`. To enable class-filtering in the future,
 * uncomment the section below and extend the props if needed.
 */
'use client';

import { useTransition } from 'react';

interface ClassOpt {
  id: string;
  name: string;
  grade: number;
}

interface Props {
  filters: { status?: string; class_id?: string };
  classes?: ClassOpt[];
  onFilterChange: (filters: { status?: string; class_id?: string }) => void;
  onClear: () => void;
}

type StatusFilter = 'warning' | 'fined' | 'resolved';

export default function FilterBar({
  filters,
  onFilterChange,
  onClear,
}: Props) {
  const [_, startTransition] = useTransition();

  function handleChange(key: string, value: string) {
    startTransition(() => {
      const updated: Record<string, string> = { ...filters };
      if (value) {
        updated[key] = value;
      } else {
        delete updated[key];
      }
      onFilterChange(updated);
    });
  }

  const statusLabels: Record<string, string> = {
    warning: 'Peringatan',
    fined: 'Denda Aktif',
    resolved: 'Selesai',
  };

  return (
    <div className="material-card space-y-4">
      {/* Status Chip Filter */}
      <div className="flex flex-wrap gap-2">
        <div
          className={`chip-rounded ${filters.status === undefined || filters.status === "" ? "chip-active" : "chip-default"}`}
          onClick={() => handleChange("status", "")}
          tabIndex={0}
          role="button"
          aria-pressed={filters.status === undefined || filters.status === ""}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleChange("status", ""); }}
        >
          Semua
        </div>
        {(["warning", "fined", "resolved"] as StatusFilter[]).map((s) => (
          <div
            key={s}
            className={`chip-rounded ${filters.status === s ? "chip-active" : "chip-default"}`}
            onClick={() => handleChange("status", s)}
            tabIndex={0}
            role="button"
            aria-pressed={filters.status === s}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleChange("status", s); }}
          >
            {statusLabels[s]}
          </div>
        ))}
      </div>

      {/* Class Filter (commented out intentionally — see module doc) */}
      {/*
      <div className="flex items-center gap-4">
        <label className="material-label">Kelas</label>
        <select
          className="material-input"
          value={filters.class_id ?? ""}
          onChange={(e) => handleChange("class_id", e.target.value)}
        >
          <option value="">Semua Kelas</option>
          {classes?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.grade !== undefined ? `Kelas ${c.grade}` : ""} {c.name}
            </option>
          ))}
        </select>
      </div>
      */}

      <div className="flex flex-col justify-between gap-3 pt-2 sm:flex-row sm:items-center">
        <p className="text-sm text-on-surface-variant">
          Total barang tertahan: <span className="font-bold">0</span>
        </p>
        <button
          type="button"
          onClick={onClear}
          className="btn-small text-sm font-semibold text-error hover:bg-error-container/10 rounded-lg px-3 py-1.5 transition"
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
}