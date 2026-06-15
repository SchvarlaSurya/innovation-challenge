/**
 * app/admin/nilai/page.tsx — Cleanliness score input (admin)
 * Server component fetches classes; client component handles the checklist form.
 * The parent app/admin/layout.tsx already provides the AdminSidebar + TopBar.
 */
import { getAllClasses } from '@/lib/queries';
import ScoreForm from '@/components/admin/ScoreForm';

export default async function NilaiPage() {
  const classes = await getAllClasses();

  return (
    <div className="w-full max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Input Nilai Kebersihan</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Beri skor per kelas menggunakan checklist di bawah ini.
        </p>
      </header>

      <ScoreForm classes={classes} />
    </div>
  );
}
