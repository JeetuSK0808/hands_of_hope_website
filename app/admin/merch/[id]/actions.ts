"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createMeshyTask, getMeshyTask } from "@/lib/meshy";

export async function updateProductAction(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceDollars = Number(formData.get("price"));
  const shippingDollars = Number(formData.get("shipping") ?? 0);
  const sizesRaw = String(formData.get("sizes") ?? "S,M,L,XL");
  const sizes = sizesRaw
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  if (!name) throw new Error("Name is required");
  if (!Number.isFinite(priceDollars) || priceDollars <= 0)
    throw new Error("Price must be positive");

  const { error } = await supabaseAdmin()
    .from("merch_products")
    .update({
      name,
      description,
      price_cents: Math.round(priceDollars * 100),
      shipping_fee_cents: Math.round(shippingDollars * 100),
      sizes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(`Update failed: ${error.message}`);

  revalidatePath(`/admin/merch/${id}`);
  revalidatePath(`/merch/${id}`);
}

export async function toggleActiveAction(id: string, formData: FormData) {
  const target = String(formData.get("active") ?? "false") === "true";

  if (target) {
    const { data, error } = await supabaseAdmin()
      .from("merch_products")
      .select("model_status, glb_model_url")
      .eq("id", id)
      .single();
    if (error || !data) throw new Error("Product not found");
    if (data.model_status !== "ready" || !data.glb_model_url) {
      throw new Error("Model is not ready yet, so it cannot be published.");
    }
  }

  const { error } = await supabaseAdmin()
    .from("merch_products")
    .update({ active: target, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(`Publish toggle failed: ${error.message}`);

  revalidatePath("/admin/merch");
  revalidatePath(`/admin/merch/${id}`);
  revalidatePath("/merch");
  revalidatePath(`/merch/${id}`);
}

export async function regenerateModelAction(id: string) {
  const { data, error } = await supabaseAdmin()
    .from("merch_products")
    .select("name, front_image_url, back_image_url")
    .eq("id", id)
    .single();
  if (error || !data) throw new Error("Product not found");
  if (!data.front_image_url) throw new Error("Front image missing");

  await supabaseAdmin()
    .from("merch_products")
    .update({
      model_status: "processing",
      glb_model_url: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  try {
    const task = await createMeshyTask({
      frontImageUrl: data.front_image_url,
      backImageUrl: data.back_image_url ?? undefined,
      name: data.name,
    });
    await supabaseAdmin()
      .from("merch_products")
      .update({ meshy_task_id: task.result })
      .eq("id", id);
  } catch (err) {
    console.error("[admin] meshy regenerate failed", err);
    await supabaseAdmin()
      .from("merch_products")
      .update({ model_status: "failed" })
      .eq("id", id);
    throw err;
  }

  revalidatePath(`/admin/merch/${id}`);
}

const MODEL_BUCKET = "merch-models";

export async function refreshModelStatusAction(id: string) {
  const { data, error } = await supabaseAdmin()
    .from("merch_products")
    .select("meshy_task_id, model_status, glb_model_url")
    .eq("id", id)
    .single();
  if (error || !data) throw new Error("Product not found");
  if (!data.meshy_task_id) return { status: data.model_status };
  if (data.model_status === "ready" && data.glb_model_url) {
    return { status: "ready", url: data.glb_model_url };
  }

  const task = await getMeshyTask(data.meshy_task_id);
  if (task.status === "SUCCEEDED" && task.model_urls?.glb) {
    const glbUrl = task.model_urls.glb;
    const persisted = await mirrorGlbToStorage(id, glbUrl);
    await supabaseAdmin()
      .from("merch_products")
      .update({
        glb_model_url: persisted,
        model_status: "ready",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    revalidatePath(`/admin/merch/${id}`);
    return { status: "ready", url: persisted };
  }
  if (task.status === "FAILED" || task.status === "CANCELED" || task.status === "EXPIRED") {
    await supabaseAdmin()
      .from("merch_products")
      .update({ model_status: "failed" })
      .eq("id", id);
    return { status: "failed", error: task.task_error?.message ?? task.status };
  }
  return { status: "processing", progress: task.progress ?? 0 };
}

async function mirrorGlbToStorage(productId: string, remoteUrl: string): Promise<string> {
  const res = await fetch(remoteUrl);
  if (!res.ok) throw new Error(`GLB fetch failed: ${res.status}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  const path = `${productId}-${Date.now()}.glb`;
  const { error } = await supabaseAdmin()
    .storage.from(MODEL_BUCKET)
    .upload(path, buf, {
      contentType: "model/gltf-binary",
      upsert: true,
    });
  if (error) {
    // Fall back to the remote (Meshy) URL if storage upload fails.
    console.error("[admin] mirror to storage failed", error.message);
    return remoteUrl;
  }
  const { data } = supabaseAdmin().storage.from(MODEL_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProductAction(id: string) {
  const { error } = await supabaseAdmin()
    .from("merch_products")
    .delete()
    .eq("id", id);
  if (error) throw new Error(`Delete failed: ${error.message}`);
  revalidatePath("/admin/merch");
  redirect("/admin/merch");
}
