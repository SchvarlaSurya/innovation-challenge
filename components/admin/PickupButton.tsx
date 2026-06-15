/**
 * components/admin/PickupButton.tsx
 * Confirms the confiscated item has been picked up after the fine is paid.
 * Marks status=resolved and clears the unpaid fine from class_warnings.
 *
 * UI: Material 3 palette.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

interface Props {
  confiscationId: string;
}

export default function PickupButton({ confiscationId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmPickup() {
    if (!confirm('Konfirmasi: siswa telah membayar denda dan mengambil barang?')) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();

      const { data: row, error: fetchErr } = await supabase
        .from('confiscated_items')
        .select('class_id, fine_amount')
        .eq('id', confiscationId)
        .single();
      if (fetchErr) throw fetchErr;
      if (!row) throw new Error('Sitaan tidak ditemukan.');

      const { error: updateErr } = await supabase
        .from('confiscated_items')
        .update({ status: 'resolved' })
        .eq('id', confiscationId);
      if (updateErr) throw updateErr;

      const { data: warning } = await supabase
        .from('class_warnings')
        .select('total_unpaid_fine')
        .eq('class_id', row.class_id)
        .single();
      if (warning) {
        const newTotal = Math.max(0, (warning.total_unpaid_fine ?? 0) - (row.fine_amount ?? 0));
        const { error: warnErr } = await supabase
          .from('class_warnings')
          .update({ total_unpaid_fine: newTotal, last_updated: new Date().toISOString() })
          .eq('class_id', row.class_id);
        if (warnErr) throw warnErr;
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-3 rounded-xl bg-error-container text-on-error-container p-3 text-sm font-semibold">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={confirmPickup}
        disabled={loading}
        className="material-btn-filled"
      >
        {loading ? 'Memproses...' : '✅ Konfirmasi Pengembalian'}
      </button>
      <p className="mt-2 text-center text-xs text-on-surface-variant">
        Tombol ini menandai barang sudah diambil setelah siswa membayar denda.
      </p>
    </div>
  );
}
