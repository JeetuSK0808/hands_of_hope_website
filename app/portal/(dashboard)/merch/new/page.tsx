import Link from "next/link";
import { requireRole } from "@/lib/portal/auth/current-user";
import { NewMerchForm } from "./new-merch-form";

export const dynamic = "force-dynamic";

export default async function NewMerchPage() {
  await requireRole("admin");

  return (
    <div className="max-w-3xl space-y-8">
      <Link
        href="/portal/merch"
        prefetch
        className="portal-eyebrow text-muted-foreground hover:text-foreground"
      >
        ← Merch catalog
      </Link>
      <header>
        <div className="portal-eyebrow">Admin · New product</div>
        <h1 className="portal-display mt-3 text-5xl">New merch.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Upload flat front and back product images. The item goes live on the
          storefront the moment you hit publish.
        </p>
      </header>

      <NewMerchForm />
    </div>
  );
}
