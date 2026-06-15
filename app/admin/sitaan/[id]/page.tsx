/**
 * app/admin/sitaan/[id]/page.tsx — Single confiscation detail (admin)
 * Server component fetches the data; client component handles pickup confirmation.
 * The parent app/admin/layout.tsx already provides the AdminSidebar + TopBar.
 */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getConfiscationById, getClassById } from '@/lib/queries';
import { formatRupiah, getStatusLabel, formatDateIndo } from '@/utils/helpers';
import StatusBadge from '@/components/ui/StatusBadge';
import PickupButton from '@/components/admin/PickupButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConfiscationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getConfiscationById(id);
  if (!item) notFound();

  const classData = await getClassById(item.class_id);
  const meta = getStatusLabel(item.status);

  return (
    <div className="w-full max-w-2xl">
      <Link href="/admin/sitaan" className="mb-4 inline-flex items-center text-sm text-zinc-500 hover:text-emerald-600">
        ← Kembali ke daftar sitaan
      </Link>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">{item.item_type}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {item.quantity} unit · {formatDateIndo(item.confiscated_at)}
            </p>
          </div>
          <StatusBadge status={item.status} label={meta.label} />
        </div>

        {/* Photo */}
        {item.photo_url && (
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.photo_url}
              alt={item.item_type}
              className="max-h-96 w-full rounded-xl object-cover"
            />
          </div>
        )}

        {/* Details */}
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-zinc-500">Kelas</dt>
            <dd className="mt-1 font-medium">
              {classData ? (
                <Link href={`/kelas/${classData.id}`} className="hover:underline">
                  {classData.name}
                </Link>
              ) : (
                '-'
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-zinc-500">Jumlah</dt>
            <dd className="mt-1 font-medium">{item.quantity} unit</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-zinc-500">Denda</dt>
            <dd className="mt-1 font-medium text-red-600">
              {item.fine_amount > 0 ? formatRupiah(item.fine_amount) : 'Tidak ada (Peringatan)'}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-zinc-500">Tanggal Sitaan</dt>
            <dd className="mt-1 font-medium">{formatDateIndo(item.confiscated_at)}</dd>
          </div>
          {item.notes && (
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wider text-zinc-500">Catatan</dt>
              <dd className="mt-1 text-zinc-700 dark:text-zinc-300">{item.notes}</dd>
            </div>
          )}
        </dl>

        {/* Action: confirm pickup */}
        {item.status !== 'resolved' ? (
          <PickupButton confiscationId={item.id} />
        ) : (
          <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            ✅ Barang ini sudah diambil kembali.
          </div>
        )}
      </div>
    </div>
  );
}
