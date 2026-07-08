import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  checkAdminPassword,
  signAdminSession,
} from "@/lib/admin-auth";

type PageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

async function loginAction(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin/merch");
  const safeNext = nextPath.startsWith("/admin") ? nextPath : "/admin/merch";

  if (!checkAdminPassword(password)) {
    redirect(
      `/admin/login?error=1${
        safeNext !== "/admin/merch"
          ? `&next=${encodeURIComponent(safeNext)}`
          : ""
      }`
    );
  }

  const expires = Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
  const value = await signAdminSession(expires);
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
  redirect(safeNext);
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { next, error } = await searchParams;
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-24">
        <span className="editorial-eyebrow text-muted-foreground">
          HOH Admin
        </span>
        <h1 className="mt-6 editorial-display text-4xl">Sign in</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Enter the admin password to manage the merch catalog.
        </p>
        <form action={loginAction} className="mt-10 space-y-4">
          <input type="hidden" name="next" value={next ?? "/admin/merch"} />
          <label className="block">
            <span className="editorial-eyebrow text-muted-foreground">
              Password
            </span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="mt-2 block w-full border border-border bg-transparent px-3 py-3 text-sm outline-none focus:border-foreground"
            />
          </label>
          {error ? (
            <p className="text-sm text-destructive">Incorrect password.</p>
          ) : null}
          <button
            type="submit"
            className="w-full border border-foreground bg-foreground py-3 text-sm font-medium tracking-[0.24em] uppercase text-background hover:opacity-85"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
