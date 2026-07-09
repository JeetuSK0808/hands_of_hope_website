import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/portal/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore — no session to clear.
  }
  return NextResponse.redirect(new URL("/portal/login", request.url));
}
