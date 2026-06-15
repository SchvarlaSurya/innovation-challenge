/**
 * app/admin/sitaan/page.tsx — Confiscation list (admin)
 * Server: fetches all confiscated_items (RLS-protected, admin session).
 * Client: renders filters + list inside the AdminSidebar layout.
 *
 * UI: Material 3 + emerald accent.
 *
 * IMPORTANT: Hidden is intentionally a top-level server fetch (not a getServerSideProps).
 * In Next.js 14 App Router, the page is a Server Component; we pass the data to a Client
 * subcomponent that handles filtering (FilterBar) and rendering.
 */
import Link from 'next/link';
import { getAllConfiscationsWithClass, getAllClasses } from '@/lib/queries';
import SitaanList from '@/components/admin/SitaanList';

export const dynamic = 'force-dynamic';

export default async function SitaanPage() {
  const [items, classes] = await Promise.all([
    getAllConfiscationsWithClass(),
    getAllClasses(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Manajemen Sitaan</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Catat barang sitaan per kelas dan kelola status denda.
          </p>
        </div>
        <Link
          href="/admin/sitaan/tambah"
          className="btn-filled px-5 py-2.5"
        >
          <span className="material-symbols-outlined mr-2 align-middle text-[18px]">add</span>
          Catat Sitaan
        </Link>
      </div>

      <SitaanList items={items ?? []} classes={classes ?? []} />
    </div>
  );
}