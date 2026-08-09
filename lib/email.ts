import "server-only";
import { Resend } from "resend";

let cached: Resend | null = null;

function resendClient(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not configured");
  cached = new Resend(key);
  return cached;
}

type Address = {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type OrderEmailPayload = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: Address;
  lineItems: Array<{
    productName: string;
    size: string;
    quantity: number;
    unitPriceCents: number;
  }>;
  totalCents: number;
};

const FROM_ADDRESS =
  process.env.MERCH_EMAIL_FROM ?? "Hands of Hope <orders@handsofhopeoutreach.org>";
const TIGERHILL_ADDRESS =
  process.env.TIGERHILL_ORDER_EMAIL ?? "sales.absoutfitters@gmail.com";

function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function renderAddress(a: Address): string {
  const l2 = a.line2 ? `${a.line2}\n` : "";
  return `${a.line1}\n${l2}${a.city}, ${a.state} ${a.postal_code}\n${a.country}`;
}

export async function sendTigerHillOrderEmail(p: OrderEmailPayload) {
  const items = p.lineItems
    .map(
      (i) =>
        `- ${i.quantity} × ${i.productName} (size ${i.size}) — ${formatMoney(
          i.unitPriceCents
        )} ea`
    )
    .join("\n");

  const text = [
    `New Hands of Hope merch order — ${p.orderNumber}`,
    "",
    "Customer",
    `  Name:  ${p.customerName}`,
    `  Email: ${p.customerEmail}`,
    `  Phone: ${p.customerPhone}`,
    "",
    "Ship to",
    renderAddress(p.address)
      .split("\n")
      .map((l) => `  ${l}`)
      .join("\n"),
    "",
    "Items",
    items,
    "",
    `Total charged: ${formatMoney(p.totalCents)}`,
    "",
    "Please ship directly to the customer and email tracking to them.",
    "HOH will settle up separately per our weekly invoice.",
  ].join("\n");

  return resendClient().emails.send({
    from: FROM_ADDRESS,
    to: TIGERHILL_ADDRESS,
    replyTo: "info@handsofhopeoutreach.org",
    subject: `HOH Order ${p.orderNumber} — ${p.customerName}`,
    text,
  });
}

export async function sendCustomerConfirmationEmail(p: OrderEmailPayload) {
  const items = p.lineItems
    .map(
      (i) =>
        `- ${i.quantity} × ${i.productName} (size ${i.size}) — ${formatMoney(
          i.unitPriceCents
        )} ea`
    )
    .join("\n");

  const text = [
    `Thanks for supporting Hands of Hope — order ${p.orderNumber}.`,
    "",
    "Your order",
    items,
    "",
    `Total: ${formatMoney(p.totalCents)}`,
    "",
    "Our fulfillment partner (TigerHill / AB's Outfitters) will ship your",
    "order and email tracking directly to you. Reply here with any",
    "questions and we'll get back to you.",
    "",
    "— Hands of Hope Outreach",
  ].join("\n");

  return resendClient().emails.send({
    from: FROM_ADDRESS,
    to: p.customerEmail,
    replyTo: "info@handsofhopeoutreach.org",
    subject: `Order ${p.orderNumber} confirmed`,
    text,
  });
}
