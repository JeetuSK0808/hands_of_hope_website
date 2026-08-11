import { NextResponse } from "next/server";
import { z } from "zod";
import type Stripe from "stripe";
import { stripeClient } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { MerchProduct } from "@/lib/merch/types";

export const runtime = "nodejs";

const CheckoutSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        size: z.string().min(1).max(20),
        quantity: z.number().int().min(1).max(10),
      })
    )
    .min(1)
    .max(20),
});

function origin(req: Request): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid cart", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const productIds = Array.from(
    new Set(parsed.data.items.map((i) => i.product_id))
  );

  const { data: products, error } = await supabaseAdmin()
    .from("merch_products")
    .select("*")
    .in("id", productIds);

  if (error) {
    console.error("[checkout] load products", error.message);
    return NextResponse.json({ error: "Cart lookup failed" }, { status: 500 });
  }

  const byId = new Map<string, MerchProduct>(
    (products ?? []).map((p) => [p.id, p as MerchProduct])
  );

  for (const item of parsed.data.items) {
    const p = byId.get(item.product_id);
    if (!p || !p.active) {
      return NextResponse.json(
        { error: "Product unavailable" },
        { status: 400 }
      );
    }
    if (!p.sizes.includes(item.size.toUpperCase())) {
      return NextResponse.json(
        { error: `Size ${item.size} not available for ${p.name}` },
        { status: 400 }
      );
    }
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    parsed.data.items.map((item) => {
      const product = byId.get(item.product_id)!;
      return {
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: product.price_cents,
          product_data: {
            name: `${product.name} · ${item.size.toUpperCase()}`,
            images: product.front_image_url ? [product.front_image_url] : undefined,
            metadata: {
              product_id: product.id,
              size: item.size.toUpperCase(),
            },
          },
        },
      };
    });

  // Flat shipping fee per distinct product (not per quantity), summed once.
  const shippingTotal = Array.from(new Set(parsed.data.items.map((i) => i.product_id)))
    .map((pid) => byId.get(pid)?.shipping_fee_cents ?? 0)
    .reduce((a, b) => a + b, 0);

  if (shippingTotal > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: shippingTotal,
        product_data: {
          name: "Shipping",
        },
      },
    });
  }

  const cartMetadata = JSON.stringify(
    parsed.data.items.map((i) => ({
      p: i.product_id,
      s: i.size.toUpperCase(),
      q: i.quantity,
    }))
  );

  try {
    const session = await stripeClient().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US"] },
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      customer_creation: "if_required",
      success_url: `${origin(req)}/merch/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin(req)}/merch`,
      metadata: { cart: cartMetadata },
      payment_intent_data: {
        metadata: { cart: cartMetadata },
        description: "Hands of Hope Outreach merch",
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error("[checkout] stripe create", err);
    return NextResponse.json(
      { error: "Could not start checkout" },
      { status: 500 }
    );
  }
}
