import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { MerchProduct } from "@/lib/merch/types";
import { formatUsd } from "@/lib/merch/format";
import { ModelPreview } from "./model-preview";
import {
  deleteProductAction,
  refreshModelStatusAction,
  regenerateModelAction,
  toggleActiveAction,
  updateProductAction,
} from "./actions";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

async function loadProduct(id: string): Promise<MerchProduct | null> {
  const { data, error } = await supabaseAdmin()
    .from("merch_products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[admin] loadProduct", error.message);
    return null;
  }
  return (data as MerchProduct) ?? null;
}

export default async function AdminMerchEditPage({ params }: PageProps) {
  const { id } = await params;
  const product = await loadProduct(id);
  if (!product) notFound();

  const update = updateProductAction.bind(null, id);
  const toggle = toggleActiveAction.bind(null, id);
  const regenerate = regenerateModelAction.bind(null, id);
  const remove = deleteProductAction.bind(null, id);

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr]">
      <div>
        <Link
          href="/admin/merch"
          className="editorial-eyebrow text-muted-foreground hover:text-foreground"
        >
          ← Products
        </Link>
        <h1 className="mt-6 font-display text-4xl">{product.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Created {new Date(product.created_at).toLocaleString("en-US")}
        </p>

        <form action={update} className="mt-10 space-y-6">
          <Field label="Name" name="name" defaultValue={product.name} required />
          <Field
            label="Description"
            name="description"
            defaultValue={product.description}
            textarea
            rows={4}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="Price (USD)"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={(product.price_cents / 100).toFixed(2)}
              required
            />
            <Field
              label="Shipping fee (USD)"
              name="shipping"
              type="number"
              step="0.01"
              min="0"
              defaultValue={(product.shipping_fee_cents / 100).toFixed(2)}
            />
          </div>
          <Field
            label="Sizes (comma separated)"
            name="sizes"
            defaultValue={product.sizes.join(",")}
          />
          <div className="flex items-center gap-3 border-t border-border pt-6">
            <button
              type="submit"
              className="border border-foreground bg-foreground px-5 py-3 text-sm font-medium tracking-[0.24em] uppercase text-background hover:opacity-85"
            >
              Save
            </button>
          </div>
        </form>

        <div className="mt-10 border-t border-border pt-8">
          <div className="editorial-eyebrow text-muted-foreground">
            Source images
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {product.front_image_url ? (
              <div className="relative aspect-square w-full overflow-hidden bg-secondary">
                <Image
                  src={product.front_image_url}
                  alt="Front"
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
            ) : null}
            {product.back_image_url ? (
              <div className="relative aspect-square w-full overflow-hidden bg-secondary">
                <Image
                  src={product.back_image_url}
                  alt="Back"
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <form action={remove}>
            <button
              type="submit"
              className="text-sm text-destructive underline underline-offset-4"
            >
              Delete product
            </button>
          </form>
        </div>
      </div>

      <div>
        <div className="editorial-eyebrow text-muted-foreground">
          3D preview
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Rotate and zoom to verify the generated model. Regenerate if it looks
          off before publishing.
        </p>

        <div className="mt-4">
          <ModelPreview
            productId={product.id}
            initialStatus={product.model_status}
            initialGlbUrl={product.glb_model_url}
            refresh={refreshModelStatusAction}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <form action={regenerate}>
            <button
              type="submit"
              className="border border-border px-5 py-3 text-sm hover:border-foreground"
            >
              Regenerate model
            </button>
          </form>
          <form action={toggle}>
            <input
              type="hidden"
              name="active"
              value={product.active ? "false" : "true"}
            />
            <button
              type="submit"
              disabled={!product.active && product.model_status !== "ready"}
              className="border border-foreground bg-foreground px-5 py-3 text-sm font-medium tracking-[0.24em] uppercase text-background hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {product.active ? "Unpublish" : "Publish"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-sm">
          <div className="flex items-baseline justify-between border-t border-border py-3">
            <span className="editorial-eyebrow text-muted-foreground">
              Status
            </span>
            <span>{product.model_status}</span>
          </div>
          <div className="flex items-baseline justify-between border-t border-border py-3">
            <span className="editorial-eyebrow text-muted-foreground">
              Storefront
            </span>
            <span>{product.active ? "Live" : "Draft"}</span>
          </div>
          <div className="flex items-baseline justify-between border-t border-border py-3">
            <span className="editorial-eyebrow text-muted-foreground">
              Price
            </span>
            <span className="tabular-nums">
              {formatUsd(product.price_cents)}
            </span>
          </div>
          <div className="flex items-baseline justify-between border-t border-border py-3">
            <span className="editorial-eyebrow text-muted-foreground">
              Shipping
            </span>
            <span className="tabular-nums">
              {formatUsd(product.shipping_fee_cents)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  step?: string;
  min?: string;
  required?: boolean;
  defaultValue?: string;
  textarea?: boolean;
  rows?: number;
};

function Field({
  label,
  name,
  type = "text",
  textarea = false,
  rows = 3,
  ...rest
}: FieldProps) {
  return (
    <label className="block">
      <span className="editorial-eyebrow text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={rows}
          {...rest}
          className="mt-2 block w-full resize-y border border-border bg-transparent px-3 py-3 text-sm outline-none focus:border-foreground"
        />
      ) : (
        <input
          type={type}
          name={name}
          {...rest}
          className="mt-2 block w-full border border-border bg-transparent px-3 py-3 text-sm outline-none focus:border-foreground"
        />
      )}
    </label>
  );
}
