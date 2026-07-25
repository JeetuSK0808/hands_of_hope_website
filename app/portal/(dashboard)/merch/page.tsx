import Link from "next/link";
import Image from "next/image";
import { requireRole } from "@/lib/portal/auth/current-user";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { MerchProduct } from "@/lib/merch/types";
import { formatUsd } from "@/lib/merch/format";
import { toggleActiveAction, deleteProductAction } from "./actions";

export const dynamic = "force-dynamic";

async function loadAllProducts(): Promise<MerchProduct[]> {
  const { data, error } = await supabaseAdmin()
    .from("merch_products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[portal/merch] load", error.message);
    return [];
  }
  return (data ?? []) as MerchProduct[];
}

export default async function PortalMerchPage() {
  await requireRole("admin");
  const products = await loadAllProducts();

  return (
    <div className="space-y-8">
      <header className="flex items-baseline justify-between gap-6 flex-wrap">
        <div>
          <div className="portal-eyebrow">Admin · Shop catalog</div>
          <h1 className="portal-display mt-3 text-5xl">Merch.</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {products.length} total · {products.filter((p) => p.active).length} live on the storefront
          </p>
        </div>
        <Link href="/portal/merch/new" prefetch className="portal-btn-primary">
          New merch
        </Link>
      </header>

      <section className="portal-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Ship fee</th>
                <th>Sizes</th>
                <th>Status</th>
                <th>Created</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted-foreground">
                    No products yet. Click <span className="font-medium">New merch</span> to add your first drop.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden bg-muted rounded-sm">
                          {p.front_image_url ? (
                            <Image
                              src={p.front_image_url}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <div className="font-medium">{p.name}</div>
                          {p.description ? (
                            <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                              {p.description}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="font-mono">{formatUsd(p.price_cents)}</td>
                    <td className="font-mono">{formatUsd(p.shipping_fee_cents)}</td>
                    <td className="text-xs text-muted-foreground">{p.sizes.join(" · ")}</td>
                    <td>
                      <span
                        className={`portal-badge ${
                          p.active ? "portal-badge-approved" : "portal-badge-pending"
                        }`}
                      >
                        {p.active ? "Live" : "Hidden"}
                      </span>
                    </td>
                    <td className="text-xs text-muted-foreground font-mono">
                      {new Date(p.created_at).toLocaleDateString("en-US")}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <form action={toggleActiveAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="next" value={p.active ? "false" : "true"} />
                          <button
                            type="submit"
                            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
                          >
                            {p.active ? "Hide" : "Publish"}
                          </button>
                        </form>
                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button
                            type="submit"
                            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
