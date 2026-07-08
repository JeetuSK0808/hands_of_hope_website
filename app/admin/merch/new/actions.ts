"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createMeshyTask } from "@/lib/meshy";

const IMAGE_BUCKET = "merch-images";

function slugify(s: string) {
  return s
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

export async function createProductAction(formData: FormData) {
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

  if (!name) throw new Error("Name is required");
  if (!Number.isFinite(priceDollars) || priceDollars <= 0)
    throw new Error("Price must be positive");
  if (!frontImage || frontImage.size === 0) throw new Error("Front image required");
  if (!backImage || backImage.size === 0) throw new Error("Back image required");

  const slug = slugify(name) || "product";
  const frontUrl = await uploadImage(frontImage, `${slug}-front`);
  const backUrl = await uploadImage(backImage, `${slug}-back`);

  const priceCents = Math.round(priceDollars * 100);
  const shippingCents = Math.round(shippingDollars * 100);

  const { data: inserted, error: insertErr } = await supabaseAdmin()
    .from("merch_products")
    .insert({
      name,
      description,
      price_cents: priceCents,
      shipping_fee_cents: shippingCents,
      sizes,
      front_image_url: frontUrl,
      back_image_url: backUrl,
      model_status: "processing",
      active: false,
    })
    .select("id")
    .single();

  if (insertErr || !inserted) {
    throw new Error(`Product insert failed: ${insertErr?.message ?? "unknown"}`);
  }

  try {
    const task = await createMeshyTask({
      frontImageUrl: frontUrl,
      backImageUrl: backUrl,
      name,
    });
    await supabaseAdmin()
      .from("merch_products")
      .update({ meshy_task_id: task.result, model_status: "processing" })
      .eq("id", inserted.id);
  } catch (err) {
    console.error("[admin] meshy create failed", err);
    await supabaseAdmin()
      .from("merch_products")
      .update({ model_status: "failed" })
      .eq("id", inserted.id);
  }

  redirect(`/admin/merch/${inserted.id}`);
}
