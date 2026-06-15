/**
 * app/admin/sitaan/tambah/page.tsx — Add confiscation form
 * Server component fetches classes; client component handles submission.
 */
import { getAllClasses } from '@/lib/queries';
import AddConfiscationForm from '@/components/admin/AddConfiscationForm';

export default async function TambahSitaanPage() {
  const classes = await getAllClasses();

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <a href="/admin/sitaan" className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">arrow_back</span>
        </a>
        <div>
          <h2 className="text-2xl font-bold text-on-background">Tambah Sitaan</h2>
          <p className="text-sm text-on-surface-variant">
            Catat barang sitaan baru. Status otomatis dihitung (peringatan atau denda).
          </p>
        </div>
      </div>

      <AddConfiscationForm classes={classes} />
    </div>
  );
}
