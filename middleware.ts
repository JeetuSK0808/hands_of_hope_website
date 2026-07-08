import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updatePortalSession } from "@/lib/portal/supabase/middleware";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/portal")) {
    return updatePortalSession(request);
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
    const ok = await verifyAdminSession(cookie).catch(() => false);
    if (ok) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
