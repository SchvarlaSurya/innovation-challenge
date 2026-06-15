/**
 * app/loading.tsx — Global loading skeleton (for root route)
 */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/2 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="h-32 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-32 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-32 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
