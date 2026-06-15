/**
 * lib/supabase/client.ts
 *
 * Browser client only. Safe to import in client components, server components,
 * and middleware/proxy (no next/headers dependency).
 */
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
