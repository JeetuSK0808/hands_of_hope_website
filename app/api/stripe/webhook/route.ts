import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripeClient } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  sendCustomerConfirmationEmail,
  sendTigerHillOrderEmail,
  type OrderEmailPayload,
} from "@/lib/email";
import type { MerchLineItem, MerchProduct } from "@/lib/merch/types";

export const runtime = "nodejs";

type CartItem = { p: string; s: string; q: number };

function parseCart(raw: string | undefined): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is CartItem =>
          typeof x === "object" &&
          x !== null &&
          typeof (x as CartItem).p === "string" &&
          typeof (x as CartItem).s === "string" &&
          typeof (x as CartItem).q === "number"
      )
      .map((x) => ({ p: x.p, s: x.s, q: x.q }));
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripeClient().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("[stripe webhook] signature error", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Idempotency: bail if we already recorded this session.
  const { data: existing } = await supabaseAdmin()
    .from("merch_orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  const cart = parseCart(session.metadata?.cart);
  const productIds = Array.from(new Set(cart.map((c) => c.p)));
  const { data: products } = await supabaseAdmin()
    .from("merch_products")
    .select("*")
    .in("id", productIds);

  const byId = new Map<string, MerchProduct>(
    (products ?? []).map((p) => [p.id, p as MerchProduct])
  );

  const lineItems: MerchLineItem[] = cart.map((c) => {
    const p = byId.get(c.p);
    return {
      product_id: c.p,
      product_name: p?.name ?? "Unknown product",
      size: c.s,
      quantity: c.q,
      unit_price_cents: p?.price_cents ?? 0,
      shipping_fee_cents: p?.shipping_fee_cents ?? 0,
    };
  });

  const details = session.customer_details;
  const shippingAddress =
    (session as unknown as { collected_information?: { shipping_details?: { address?: Stripe.Address; name?: string } } })
      .collected_information?.shipping_details?.address ??
    details?.address ??
    null;

  if (!shippingAddress) {
    console.error("[stripe webhook] no shipping address on session", session.id);
  }

  const orderNumber = await nextOrderNumber();

  const payload: OrderEmailPayload = {
    orderNumber,
    customerName: details?.name ?? "Unknown",
    customerEmail: details?.email ?? session.customer_email ?? "",
    customerPhone: details?.phone ?? "",
    address: {
      line1: shippingAddress?.line1 ?? "",
      line2: shippingAddress?.line2 ?? null,
      city: shippingAddress?.city ?? "",
      state: shippingAddress?.state ?? "",
      postal_code: shippingAddress?.postal_code ?? "",
      country: shippingAddress?.country ?? "US",
    },
    lineItems: lineItems.map((li) => ({
      productName: li.product_name,
      size: li.size,
      quantity: li.quantity,
      unitPriceCents: li.unit_price_cents,
    })),
    totalCents: session.amount_total ?? 0,
  };

  let notified = false;
  try {
    await sendTigerHillOrderEmail(payload);
    notified = true;
  } catch (err) {
    console.error("[stripe webhook] tigerhill email failed", err);
  }

  try {
    await sendCustomerConfirmationEmail(payload);
  } catch (err) {
    console.error("[stripe webhook] customer email failed", err);
  }

  const { error: insertErr } = await supabaseAdmin()
    .from("merch_orders")
    .insert({
      order_number: orderNumber,
      stripe_session_id: session.id,
      customer_name: payload.customerName,
      customer_email: payload.customerEmail,
      customer_phone: payload.customerPhone,
      shipping_address: payload.address,
      line_items: lineItems,
      total_charged_cents: payload.totalCents,
      tigerhill_notified: notified,
    });

  if (insertErr) {
    console.error("[stripe webhook] order insert", insertErr.message);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function nextOrderNumber(): Promise<string> {
  const { data, error } = await supabaseAdmin().rpc("next_merch_order_number");
  if (error || !data) {
    console.error("[stripe webhook] order number rpc failed", error?.message);
    return `HOH-${Date.now().toString().slice(-6)}`;
  }
  return typeof data === "string" ? data : String(data);
}
