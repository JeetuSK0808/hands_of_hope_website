import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { MerchProduct } from "@/lib/merch/types";
import { formatUsd } from "@/lib/merch/format";

export const dynamic = "force-dynamic";

async function loadAllProducts(): Promise<MerchProduct[]> {
  const { data, error } = await supabaseAdmin()
    .from("merch_products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[admin/merch] load", error.message);
    return [];
  }
  return (data ?? []) as MerchProduct[];
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  processing: "Generating…",
  ready: "3D ready",
  failed: "Failed",
};

export default async function AdminMerchListPage() {
  const products = await loadAllProducts();
  const weeklyCount = products.filter((p) => {
    const created = new Date(p.created_at);
    return Date.now() - created.getTime() < 7 * 24 * 3600 * 1000;
  }).length;

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <div>
          <span className="editorial-eyebrow text-muted-foreground">
            Merch catalog
          </span>
          <h1 className="mt-4 font-display text-4xl">Products</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {products.length} total · {weeklyCount} added this week
          </p>
        </div>
        <Link
          href="/admin/merch/new"
          className="border border-foreground bg-foreground px-6 py-3 text-sm font-medium tracking-[0.24em] uppercase text-background hover:opacity-85"
        >
          Add merch
        </Link>
      </div>

      <div className="mt-10 overflow-hidden border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Ship fee</th>
              <th className="px-4 py-3 font-medium">3D</th>
              <th className="px-4 py-3 font-medium">Visible</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  No products yet. Click Add merch to create your first drop.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden bg-secondary">
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
                        <div className="text-xs text-muted-foreground">
                          {p.sizes.join(" · ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 tabular-nums">
                    {formatUsd(p.price_cents)}
                  </td>
                  <td className="px-4 py-4 tabular-nums">
                    {formatUsd(p.shipping_fee_cents)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={
                        p.model_status === "ready"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {STATUS_LABEL[p.model_status] ?? p.model_status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {p.active ? (
                      <span className="text-foreground">Live</span>
                    ) : (
                      <span className="text-muted-foreground">Draft</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/merch/${p.id}`}
                      className="text-foreground underline underline-offset-4"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
