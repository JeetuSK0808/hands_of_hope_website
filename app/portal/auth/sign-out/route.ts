import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";
import { GUEST_COOKIE } from "@/lib/portal/auth/guest";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore — guest sessions have no Supabase state to clear.
  }
  const res = NextResponse.redirect(new URL("/portal/login", request.url));
  res.cookies.set(GUEST_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
