/**
 * app/not-found.tsx — Custom 404 page
 */
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-16 text-center">
      <div className="text-7xl">🔍</div>
      <h1 className="mt-4 text-3xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-1 text-zinc-500 dark:text-zinc-400">
        Maaf, kami tidak bisa menemukan halaman yang kamu cari.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
