/**
 * components/admin/ScoreForm.tsx
 * Form to input weekly cleanliness score for a class.
 * Checklist: Lantai, Meja/Kursi, Jendela, Tempat Sampah, Papan Tulis.
 * Total skor: 5 aspek × bobot 20 = 100. Submit ke tabel cleanliness_scores.
 *
 * UI: Material 3 palette.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

interface ClassOpt {
  id: string;
  name: string;
  grade: number;
}

interface Props {
  classes: ClassOpt[];
  initial?: {
    class_id?: string;
    period?: string;
    scores?: Record<string, number>;
    notes?: string;
  };
  mode?: 'create' | 'edit';
}

const ASPECTS = [
  { key: 'lantai', label: 'Lantai' },
  { key: 'meja_kursi', label: 'Meja / Kursi' },
  { key: 'jendela', label: 'Jendela' },
  { key: 'tempat_sampah', label: 'Tempat Sampah' },
  { key: 'papan_tulis', label: 'Papan Tulis' },
];

function defaultScores() {
  return ASPECTS.reduce((acc, a) => ({ ...acc, [a.key]: 0 }), {} as Record<string, number>);
}

export default function ScoreForm({ classes, initial, mode = 'create' }: Props) {
  const router = useRouter();
  const [classId, setClassId] = useState<string>(initial?.class_id ?? classes[0]?.id ?? '');
  const [period, setPeriod] = useState<string>(initial?.period ?? getDefaultPeriod());
  const [scores, setScores] = useState<Record<string, number>>(initial?.scores ?? defaultScores());
  const [notes, setNotes] = useState<string>(initial?.notes ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = Object.values(scores).reduce((s, v) => s + (Number(v) || 0), 0);

  function setAspect(key: string, value: number) {
    setScores((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!classId) {
      setError('Pilih kelas terlebih dahulu.');
      return;
    }
    if (total < 0 || total > 100) {
      setError('Skor total harus 0–100.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const checklist_data = ASPECTS.map((a) => ({ key: a.key, label: a.label, score: scores[a.key] ?? 0 }));
      const { data: userData } = await supabase.auth.getUser();
      const scored_by = userData?.user?.id ?? null;

      const { error: insErr } = await supabase.from('cleanliness_scores').insert({
        class_id: classId,
        period,
        score: total,
        checklist_data,
        scored_by,
      });
      if (insErr) throw insErr;
      router.push('/admin/nilai');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan skor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="material-card-elevated space-y-6">
      <header className="border-b border-outline-variant pb-4">
        <h2 className="text-2xl font-bold text-on-surface">{mode === 'edit' ? 'Edit Skor' : 'Input Skor Kebersihan'}</h2>
        <p className="mt-1 text-sm text-on-surface-variant">Nilai tiap aspek 0–20, total maks 100.</p>
      </header>

      {error && (
        <div className="rounded-xl bg-error-container p-3 text-sm font-semibold text-on-error-container">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="class_id" className="material-label">Kelas</label>
          <select
            id="class_id"
            className="material-input"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          >
            <option value="" disabled>-- pilih kelas --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="period" className="material-label">Periode</label>
          <input
            id="period"
            type="text"
            className="material-input"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            placeholder="2026-06-W2"
            required
          />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="material-label">Checklist (0–20 per aspek)</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {ASPECTS.map((a) => (
            <div key={a.key} className="flex items-center gap-3">
              <label htmlFor={`score-${a.key}`} className="flex-1 text-sm font-medium text-on-surface">{a.label}</label>
              <input
                id={`score-${a.key}`}
                type="number"
                min={0}
                max={20}
                className="material-input w-20 text-center"
                value={scores[a.key] ?? 0}
                onChange={(e) => setAspect(a.key, Number(e.target.value))}
                required
              />
            </div>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="total" className="material-label">Total Skor</label>
        <div id="total" className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-2xl font-bold text-primary">
          {total} / 100
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="material-label">Catatan (opsional)</label>
        <textarea
          id="notes"
          className="material-input min-h-[80px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => router.back()} className="material-btn-text">Batal</button>
        <button type="submit" disabled={loading} className="material-btn-filled">
          {loading ? 'Menyimpan...' : 'Simpan Skor'}
        </button>
      </div>
    </form>
  );
}

function getDefaultPeriod(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = d.getDate();
  const onejan = new Date(y, 0, 1);
  const week = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  return `${y}-${m}-W${week}`;
}
