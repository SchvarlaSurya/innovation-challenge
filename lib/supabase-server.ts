/**
 * lib/supabase/server.ts
 *
 * Server-side Supabase client. Reads/writes session cookies using next/headers.
 * ONLY import from server components or server actions — never from middleware
 * (since middleware runs on the edge where next/headers is unavailable).
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map((cookie: { name: string; value: string }) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach((cookie) => {
              const { name, value, options } = cookie as { name: string; value: string; options: CookieOptions };
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This is fine — server components don't set cookies.
          }
        },
      },
    },
  );
}
