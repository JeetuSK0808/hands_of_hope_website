import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Per-request singleton.
 *
 * A portal page typically builds a client in the layout, again in the page, and
 * again in any server action it renders. Without `cache()` each of those awaits
 * `cookies()` and stands up a fresh client, and — worse — each one re-runs the
 * `auth.getUser()` network round-trip that Supabase does not share between
 * instances. Caching collapses all of that to one.
 */
export const createSupabaseServerClient = cache(async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — mutation ignored. Middleware handles refresh.
          }
        },
      },
    },
  );
});
