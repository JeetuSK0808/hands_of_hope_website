import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { supabasePublic } from "@/lib/supabase/public";
import { formatUsd } from "@/lib/merch/format";
import { SiteFooter } from "@/components/site/site-footer";
import { SeoBreadcrumb } from "@/components/site/seo-breadcrumb";
import type { MerchProduct } from "@/lib/merch/types";

export const metadata: Metadata = {
  title: "Shop — Student-designed merch that funds our work",
  description:
    "Shop Hands of Hope Outreach: student-designed apparel from the Atlanta-based 501(c)(3). Every purchase helps fund STEM Buddies, the Ripple for Change assembly, and the annual Awards Ceremony.",
  alternates: { canonical: "/merch" },
  openGraph: {
    url: "https://handsofhopeoutreach.org/merch",
    title: "Shop · Hands of Hope Outreach",
    description:
      "Student-designed apparel. Every order supports chapter programs across the network.",
  },
};

export const revalidate = 30;

async function loadProducts(): Promise<MerchProduct[]> {
  try {
    const { data, error } = await supabasePublic()
      .from("merch_products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[merch] loadProducts", error.message);
      return [];
    }
    return (data ?? []) as MerchProduct[];
  } catch (err) {
    console.error("[merch] loadProducts threw", err);
    return [];
  }
}

export default async function MerchIndexPage() {
  const products = await loadProducts();

  return (
    <>
      <section className="mx-auto w-full max-w-[88rem] px-6 md:px-12 pt-40 pb-16">
        <span className="editorial-rule editorial-eyebrow text-muted-foreground">
          The Shop
        </span>
        <h1 className="mt-8 editorial-display text-[clamp(2.75rem,7vw,6.5rem)] max-w-[18ch]">
          Wear the <span className="italic">work.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Student-designed apparel from Hands of Hope Outreach. Every order
          helps fund the programs your classmates are running — STEM Buddies,
          the Ripple for Change kit-packing assembly, and the annual Awards
          Ceremony.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-32">
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
      <SeoBreadcrumb trail={[{ name: "Shop", path: "/merch" }]} />
    </>
  );
}

function ProductCard({ product }: { product: MerchProduct }) {
  const image = product.front_image_url;

  return (
    <Link
      href={`/merch/${product.id}`}
      className="group flex flex-col"
      aria-label={`View ${product.name}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <span className="editorial-eyebrow">No image</span>
          </div>
        )}
      </div>
      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <h2 className="font-display text-2xl font-light tracking-tight">
            {product.name}
          </h2>
          {product.description ? (
            <p className="mt-2 max-w-xs text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          ) : null}
        </div>
        <div className="text-sm font-medium tabular-nums">
          {formatUsd(product.price_cents)}
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="border-t border-border py-24 text-center">
      <span className="editorial-eyebrow text-muted-foreground">
        Coming soon
      </span>
      <p className="mt-6 font-display text-3xl font-light italic tracking-tight">
        New drops in the works.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Check back soon or follow us on Instagram for launch updates.
      </p>
    </div>
  );
}
