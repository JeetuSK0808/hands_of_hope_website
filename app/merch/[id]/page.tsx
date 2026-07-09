import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import { supabasePublic } from "@/lib/supabase/public";
import { SiteFooter } from "@/components/site/site-footer";
import type { MerchProduct } from "@/lib/merch/types";
import { ProductBuyForm } from "./product-buy-form";

type PageProps = { params: Promise<{ id: string }> };

async function loadProduct(id: string): Promise<MerchProduct | null> {
  try {
    const { data, error } = await supabasePublic()
      .from("merch_products")
      .select("*")
      .eq("id", id)
      .eq("active", true)
      .maybeSingle();
    if (error) {
      console.error("[merch] loadProduct", error.message);
      return null;
    }
    return (data as MerchProduct) ?? null;
  } catch (err) {
    console.error("[merch] loadProduct threw", err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);
  if (!product) return { title: "Merch not found" };
  return {
    title: `${product.name} · Hands of Hope Shop`,
    description: product.description || `${product.name} — Hands of Hope Outreach.`,
    alternates: { canonical: `/merch/${product.id}` },
    openGraph: {
      url: `https://handsofhopeoutreach.org/merch/${product.id}`,
      title: product.name,
      description:
        product.description || `${product.name} — Hands of Hope Outreach.`,
      images: product.front_image_url ? [product.front_image_url] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await loadProduct(id);
  if (!product) notFound();

  return (
    <>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        strategy="afterInteractive"
      />

      <section className="mx-auto w-full max-w-[88rem] px-6 md:px-12 pt-32 pb-6">
        <Link
          href="/merch"
          className="editorial-eyebrow text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Shop
        </Link>
      </section>

      <section className="mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-24">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col gap-8">
            <div className="relative aspect-square w-full overflow-hidden bg-secondary">
              {product.glb_model_url ? (
                <model-viewer
                  src={product.glb_model_url}
                  alt={`Interactive 3D preview of ${product.name}`}
                  camera-controls
                  auto-rotate
                  auto-rotate-delay={1200}
                  rotation-per-second="18deg"
                  shadow-intensity="1"
                  exposure="1"
                  interaction-prompt="none"
                  touch-action="pan-y"
                  loading="eager"
                  style={{ width: "100%", height: "100%", background: "transparent" }}
                />
              ) : product.front_image_url ? (
                <Image
                  src={product.front_image_url}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <span className="editorial-eyebrow">Preview coming</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {product.front_image_url ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
                  <Image
                    src={product.front_image_url}
                    alt={`${product.name} — front`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 45vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              {product.back_image_url ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
                  <Image
                    src={product.back_image_url}
                    alt={`${product.name} — back`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 45vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="lg:sticky lg:top-32 h-fit">
            <span className="editorial-eyebrow text-muted-foreground">
              Hands of Hope Shop
            </span>
            <h1 className="mt-6 editorial-display text-[clamp(2.25rem,4vw,3.75rem)]">
              {product.name}
            </h1>
            {product.description ? (
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            ) : null}

            <div className="mt-10">
              <ProductBuyForm
                productId={product.id}
                sizes={product.sizes}
                priceCents={product.price_cents}
                shippingCents={product.shipping_fee_cents}
              />
            </div>

            <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
              Ships within the US via our fulfillment partner, AB&apos;s
              Outfitters. Tracking will arrive by email once your order ships.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
