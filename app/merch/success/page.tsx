import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site/site-footer";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

async function loadOrder(sessionId: string) {
  try {
    const { data, error } = await supabaseAdmin()
      .from("merch_orders")
      .select("order_number, customer_email")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();
    if (error) {
      console.error("[merch] success loadOrder", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("[merch] success loadOrder threw", err);
    return null;
  }
}

export default async function MerchSuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;
  const order = session_id ? await loadOrder(session_id) : null;

  return (
    <>
      <section className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-start justify-center px-6 md:px-12 pt-32 pb-24">
        <span className="editorial-rule editorial-eyebrow text-muted-foreground">
          Order confirmed
        </span>
        <h1 className="mt-8 editorial-display text-[clamp(2.5rem,6vw,5rem)]">
          Thank you.
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
          Your order is placed. AB&apos;s Outfitters (our fulfillment partner)
          will ship your items and email tracking directly to you. A copy of
          your receipt is on the way.
        </p>
        {order?.order_number ? (
          <p className="mt-8 text-sm">
            <span className="editorial-eyebrow text-muted-foreground">
              Order number
            </span>
            <span className="ml-3 font-medium tracking-wide">
              {order.order_number}
            </span>
          </p>
        ) : null}
        <Link
          href="/merch"
          className="mt-12 inline-flex items-center border-b border-foreground pb-1 text-sm font-medium"
        >
          Back to the shop
        </Link>
      </section>
      <SiteFooter />
    </>
  );
}
