/**
 * app/error.tsx — Global error boundary
 */
'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error so developer can see in console
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-12 text-center">
      <div className="text-6xl">😵</div>
      <h2 className="mt-4 text-2xl font-bold">Terjadi kesalahan</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {error.message || 'Halaman tidak dapat dimuat saat ini.'}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
      >
        Coba lagi
      </button>
      <a
        href="/"
        className="mt-3 text-sm text-zinc-500 hover:text-emerald-600"
      >
        ← Kembali ke beranda
      </a>
    </div>
  );
}
