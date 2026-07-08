# Hands of Hope Merch Store — Build Spec for Claude Code

Paste this whole document into Claude Code (Opus 4.8) as the starting brief. It covers the full system: storefront, admin catalog with AI-generated 3D previews, checkout, and order handoff to TigerHill.

---

## 1. Overview

A merch store lives as a new page/route on the **existing handsofhope.org site** (no new domain, no new app). Visitors browse products with an interactive 3D preview and buy via Stripe Checkout. An admin ("developer account") can add new merch by uploading two flat images — the system generates the 3D model automatically. TigerHill (our clothing/fulfillment partner) receives order details by email and ships directly to the customer; HOH settles up with TigerHill manually every week outside the app.

---

## 2. Tech Stack

- **Next.js** (App Router) — new routes added into the existing handsofhope.org repo
- **Supabase** — database (products, orders) + file storage (images, GLB models)
- **Stripe Checkout** — standard checkout, *not* Stripe Connect (TigerHill has no Stripe account and isn't setting one up)
- **Meshy API** (meshy.ai) — image-to-3D generation, free tier
- **`<model-viewer>`** (Google web component) — renders the GLB interactively (rotate/zoom) on the product page; simplest option, no custom Three.js scene needed
- **Resend** (or whatever transactional email provider is already wired into the site — default to Resend if none exists) — sends order notification + confirmation emails
- **Vercel** — hosting (existing, no new infra)

No new recurring cost is required at expected volume. The only variable cost is Meshy if usage exceeds the free tier (see Section 8).

---

## 3. Design Requirements

- Brand palette: purple/magenta `#B5478A`, blue `#7DC8E3`, gray `#C8C8C8`, near-black `#111111`, white backgrounds
- Match the existing HOH editorial design language — this should feel like a natural extension of handsofhope.org, not a bolted-on storefront
- Polished, premium e-commerce feel — generous whitespace, clean typography, no templated/stock-feeling layout

---

## 4. Data Model (Supabase)

### `products`
| field | type | notes |
|---|---|---|
| id | uuid | |
| name | text | |
| description | text | |
| price_cents | integer | admin-set, arbitrary — **no cost/vendor field**, fully decoupled from TigerHill's actual cost |
| shipping_fee_cents | integer | admin-set, arbitrary — a *display* shipping charge, not tied to TigerHill's real shipping cost |
| sizes | text[] | default `['S','M','L','XL']`, editable per product |
| front_image_url | text | |
| back_image_url | text | |
| glb_model_url | text, nullable | populated once Meshy generation completes |
| model_status | enum | `pending` / `processing` / `ready` / `failed` |
| active | boolean | toggles storefront visibility without deleting |
| created_at | timestamp | |

### `orders`
| field | type | notes |
|---|---|---|
| id | uuid | |
| order_number | text | human-readable, e.g. `HOH-0001` |
| stripe_session_id | text | |
| customer_name | text | |
| customer_email | text | |
| customer_phone | text | required — TigerHill needs this per order |
| shipping_address | jsonb | street, city, state, zip — **US only** for now |
| line_items | jsonb | product id, size, qty per item |
| total_charged_cents | integer | |
| tigerhill_notified | boolean | did the order email send successfully |
| created_at | timestamp | |

---

## 5. Admin Panel ("Add Merch" flow)

Gate all `/admin/merch` routes behind whatever admin/auth pattern already exists in the handsofhope.org codebase. If none exists yet, restrict by a simple allow-list of admin emails (e.g. Daksh, Arthur).

**Add Merch flow:**
1. Admin enters name, description, price, shipping display fee, available sizes
2. Admin uploads a front image and a back image (JPEG/PNG)
3. On submit: product saves as a draft (`active = false`), and the backend calls Meshy's Image-to-3D API with the uploaded images
4. Poll Meshy until generation completes; store the resulting GLB in Supabase storage; update `glb_model_url` and `model_status`
5. Show the admin a live preview of the generated model via `<model-viewer>`, with **Regenerate** and **Publish** buttons — the product stays hidden from the storefront until explicitly published
6. If a generation looks off, allow one-click regeneration (this uses another Meshy credit — see Section 8 for the monthly cap)
7. Existing products can be edited (price, description, active toggle) without needing to regenerate the 3D model

---

## 6. Storefront

- Grid of `active` products in the HOH brand style
- Product detail page: interactive `<model-viewer>` (rotate/zoom), name, description, price, size selector, quantity, buy button
- Checkout via **Stripe Checkout**:
  - Line item = product price
  - Separate **"Shipping"** line item = admin-set shipping display fee (if an order has multiple distinct products, sum their shipping fees into one combined shipping line; shipping fee is flat per line item, not multiplied by quantity — **flag this assumption to Daksh, adjust if he pictures it differently**)
  - `shipping_address_collection` restricted to **US only**
  - Custom required field for **phone number** (TigerHill needs this per order)
  - No Connect, no `transfer_data` — the full charge goes to HOH's own Stripe/HCB, same as any normal HOH transaction

---

## 7. Order Flow (Stripe Webhook)

On `checkout.session.completed`:
1. Write the order to the `orders` table (name, email, phone, address, items, total)
2. Generate a human-readable order number
3. Send a formatted order email to **sales.absoutfitters@gmail.com** — buyer name, email, phone, shipping address, size(s), quantity, order #. Format it so it drops straight into TigerHill's existing phone/email order intake with no extra work on their end
4. Send a confirmation email to the customer (order # + items). Note in the email that TigerHill ships and emails tracking directly — no live order-status page exists or is needed on the HOH site

---

## 8. Vendor Settlement — Manual, Outside the App

This is a business process, not a feature to build:

- TigerHill sends HOH a weekly invoice/receipt for a flat total
- HOH pays using **one dedicated HCB card**, which TigerHill runs manually on their end
- **The app does not calculate what's owed to TigerHill, and does not integrate with HCB in any way** — this is intentionally decoupled
- Optional: the admin dashboard can show a simple weekly order count as an informal cross-check against TigerHill's invoice — informational only, not authoritative

---

## 9. Known Tradeoffs (context for Daksh, not code)

- **Meshy free tier ≈ 5 image-to-3D generations/month** (100 credits, 20 credits/generation). Fine for occasional new merch drops; exceeding this needs a paid Meshy plan (~$10-20/mo) or spacing out releases.
- **Free-tier Meshy models are CC BY 4.0** — requires a small attribution credit somewhere on the site (e.g. footer: "3D previews generated with Meshy AI") unless upgraded to a paid plan.
- **AI-generated 3D models are concept-grade, not manufacturing-precision** — good for product visualization (our exact use case), but the admin preview/regenerate step exists specifically to catch bad generations before they go live.
- **US-only shipping** for launch; international (Canada/Chile/Denmark members) is shelved for a future phase.
- **No live order-tracking page** — tracking happens via TigerHill's direct email to the customer post-shipment.

---

## 10. Environment Variables Needed

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `MESHY_API_KEY`
- `RESEND_API_KEY` (or existing email provider's key)
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (existing)

---

## 11. Launch Checklist

- [ ] Build and test fully in Stripe **test mode** before going live
- [ ] Add Meshy attribution credit to site footer (if staying on free tier)
- [ ] Confirm sales.absoutfitters@gmail.com is the correct, monitored inbox with Shaan
- [ ] Manually test one full order end-to-end: checkout → email to TigerHill → confirmation email to buyer
- [ ] Set a personal reminder to keep an eye on Meshy credit usage as new merch gets added
