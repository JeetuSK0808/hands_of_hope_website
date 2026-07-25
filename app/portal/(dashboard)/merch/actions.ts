"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/portal/auth/current-user";
import { supabaseAdmin } from "@/lib/supabase/admin";

const IMAGE_BUCKET = "merch-images";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

async function uploadImage(file: File, keyBase: string): Promise<string> {
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const path = `${keyBase}-${Date.now()}.${ext}`;
  const buf = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabaseAdmin()
    .storage.from(IMAGE_BUCKET)
    .upload(path, buf, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  const { data } = supabaseAdmin().storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

const CreateSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(2000).optional().default(""),
  priceDollars: z.number().positive().max(10000),
  shippingDollars: z.number().min(0).max(1000),
  sizes: z.array(z.string().min(1).max(8)).min(1).max(20),
});

type CreateResult = { ok: true; id: string } | { ok: false; error: string };

export async function createMerchAction(formData: FormData): Promise<CreateResult> {
  await requireRole("admin");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceDollars = Number(formData.get("price"));
  const shippingDollars = Number(formData.get("shipping") ?? 0);
  const sizesRaw = String(formData.get("sizes") ?? "S,M,L,XL");
  const sizes = sizesRaw
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  const frontImage = formData.get("front") as File | null;
  const backImage = formData.get("back") as File | null;

  const parsed = CreateSchema.safeParse({
    name,
    description,
    priceDollars,
    shippingDollars,
    sizes,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!frontImage || frontImage.size === 0) return { ok: false, error: "Front image required." };
  if (!backImage || backImage.size === 0) return { ok: false, error: "Back image required." };

  const slug = slugify(parsed.data.name) || "product";

  let frontUrl: string;
  let backUrl: string;
  try {
    frontUrl = await uploadImage(frontImage, `${slug}-front`);
    backUrl = await uploadImage(backImage, `${slug}-back`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return { ok: false, error: message };
  }

  const priceCents = Math.round(parsed.data.priceDollars * 100);
  const shippingCents = Math.round(parsed.data.shippingDollars * 100);

  const { data: inserted, error: insertErr } = await supabaseAdmin()
    .from("merch_products")
    .insert({
      name: parsed.data.name,
      description: parsed.data.description,
      price_cents: priceCents,
      shipping_fee_cents: shippingCents,
      sizes: parsed.data.sizes,
      front_image_url: frontUrl,
      back_image_url: backUrl,
      model_status: "ready",
      active: true,
    })
    .select("id")
    .single();

  if (insertErr || !inserted) {
    return { ok: false, error: insertErr?.message ?? "Insert failed." };
  }

  revalidatePath("/merch");
  revalidatePath(`/merch/${inserted.id}`);
  revalidatePath("/portal/merch");

  return { ok: true, id: inserted.id };
}

export async function toggleActiveAction(formData: FormData): Promise<void> {
  await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("next") ?? "true") === "true";
  if (!id) return;

  const { error } = await supabaseAdmin()
    .from("merch_products")
    .update({ active: next })
    .eq("id", id);
  if (error) {
    console.error("[portal/merch] toggle", error.message);
    return;
  }
  revalidatePath("/merch");
  revalidatePath(`/merch/${id}`);
  revalidatePath("/portal/merch");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { error } = await supabaseAdmin().from("merch_products").delete().eq("id", id);
  if (error) {
    console.error("[portal/merch] delete", error.message);
    return;
  }
  revalidatePath("/merch");
  revalidatePath("/portal/merch");
}
