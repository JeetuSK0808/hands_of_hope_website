import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[88rem] items-center justify-between px-6 md:px-12 py-6">
          <Link href="/admin/merch" className="editorial-eyebrow">
            HOH Admin
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/admin/merch"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Merch
            </Link>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[88rem] px-6 md:px-12 py-10">
        {children}
      </main>
    </div>
  );
}
