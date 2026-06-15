/**
 * components/admin/AddConfiscationForm.tsx
 * Form to add a new confiscation: class, item type, quantity, photo, notes.
 * Auto-calculates fine based on class offense count.
 */
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { calculateFine, FINE_PER_ITEM } from '@/utils/fines';
import { formatRupiah } from '@/utils/helpers';
import type { Class } from '@/types';

interface Props {
  classes: Class[];
}

export default function AddConfiscationForm({ classes }: Props) {
  const router = useRouter();
  const [classId, setClassId] = useState('');
  const [itemType, setItemType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!classId) {
      setError('Pilih kelas terlebih dahulu.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // 1. Read the class's current offense count from class_warnings
      const { data: warning } = await supabase
        .from('class_warnings')
        .select('offense_count, total_unpaid_fine')
        .eq('class_id', classId)
        .maybeSingle();

      const currentCount = warning?.offense_count ?? 0;
      const { status, fineAmount } = calculateFine(currentCount, quantity);

      // 2. Upload photo if present
      let photoUrl: string | null = null;
      if (photo) {
        const ext = photo.name.split('.').pop() || 'jpg';
        const fileName = `${classId}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('confiscated-item-photos')
          .upload(fileName, photo, { upsert: true });
        if (upErr) throw upErr;

        const { data: urlData } = supabase.storage
          .from('confiscated-item-photos')
          .getPublicUrl(fileName);
        photoUrl = urlData.publicUrl;
      }

      // 3. Insert confiscated_items row
      const { error: insertErr } = await supabase
        .from('confiscated_items')
        .insert({
          class_id: classId,
          item_type: itemType,
          quantity,
          photo_url: photoUrl,
          notes: notes || null,
          status,
          fine_amount: fineAmount,
        });

      if (insertErr) throw insertErr;

      // 4. Update class_warnings: increment offense count, add unpaid fine
      const { error: warnErr } = await supabase
        .from('class_warnings')
        .upsert(
          {
            class_id: classId,
            offense_count: currentCount + 1,
            total_unpaid_fine: (warning?.total_unpaid_fine ?? 0) + fineAmount,
            last_updated: new Date().toISOString(),
          },
          { onConflict: 'class_id' },
        );

      if (warnErr) throw warnErr;

      // 5. Show success toast, then redirect
      setSuccess(
        status === 'warning'
          ? 'Berhasil! Status: PERINGATAN (tidak ada denda).'
          : `Berhasil! Denda ${formatRupiah(fineAmount)} akan ditagihkan ke kelas.`,
      );
      setTimeout(() => {
        startTransition(() => router.push('/admin/sitaan'));
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  }

  // Preview the calculated fine for the current selection
  const previewFine = quantity * FINE_PER_ITEM;

  return (
    <form onSubmit={onSubmit} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="p-6 border-b border-outline-variant bg-surface-container-high/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-container text-on-primary-container rounded-lg">
            📝
          </div>
          <div>
            <h3 className="font-bold text-on-surface">Formulir Sitaan Baru</h3>
            <p className="text-xs text-on-surface-variant">Lengkapi semua data di bawah ini</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Alert Messages */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-semibold">
            ⚠️
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-secondary-container text-on-secondary-container rounded-xl text-sm font-semibold">
            ✅
            {success}
          </div>
        )}

        {/* Row: Class + Item Type */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Class */}
          <div>
            <label htmlFor="class" className="block text-sm font-semibold text-on-surface mb-1.5">
              Kelas <span className="text-error">*</span>
            </label>
            <select
              id="class"
              required
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">— Pilih kelas —</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.grade})
                </option>
              ))}
            </select>
          </div>

          {/* Item type */}
          <div>
            <label htmlFor="item_type" className="block text-sm font-semibold text-on-surface mb-1.5">
              Jenis Barang <span className="text-error">*</span>
            </label>
            <input
              id="item_type"
              type="text"
              required
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              placeholder="Contoh: Topi, Dasi, Sepatu"
              className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-semibold text-on-surface mb-1.5">
            Jumlah <span className="text-error">*</span>
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            required
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
          <div className="flex items-center gap-2 mt-2 p-3 bg-tertiary-fixed/30 rounded-lg border border-tertiary-fixed-dim/20">
            ℹ️
            <p className="text-xs text-on-surface-variant">
              Estimasi denda (jika bukan peringatan pertama): <strong className="text-on-surface">{formatRupiah(previewFine)}</strong>
            </p>
          </div>
        </div>

        {/* Photo */}
        <div>
          <label htmlFor="photo" className="block text-sm font-semibold text-on-surface mb-1.5">
            Foto Bukti (opsional)
          </label>
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {previewUrl ? (
              <div className="flex flex-col items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-40 w-40 rounded-xl object-cover border border-outline-variant"
                />
                <p className="text-xs text-on-surface-variant">Klik untuk mengganti foto</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                📷
                <p className="text-sm font-semibold">Klik atau seret foto ke sini</p>
                <p className="text-xs">JPG, PNG, atau WebP (max 5MB)</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-on-surface mb-1.5">
            Catatan (opsional)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tambahkan informasi tambahan jika perlu..."
            className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
          />
        </div>
      </div>

      {/* Form Footer */}
      <div className="p-6 border-t border-outline-variant bg-surface-container-high/30 flex flex-col sm:flex-row gap-3 sm:justify-end">
        <a
          href="/admin/sitaan"
          className="px-6 py-3 border border-outline text-on-surface font-semibold text-sm rounded-xl hover:bg-surface-container-high transition-all text-center"
        >
          Batal
        </a>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold text-sm rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              ⏳
              Menyimpan...
            </>
          ) : (
            <>
              💾
              Simpan Sitaan
            </>
          )}
        </button>
      </div>
    </form>
  );
}
