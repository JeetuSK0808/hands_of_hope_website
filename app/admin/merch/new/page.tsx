import Link from "next/link";
import { createProductAction } from "./actions";

export default function NewMerchPage() {
  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/merch"
        className="editorial-eyebrow text-muted-foreground hover:text-foreground"
      >
        ← Products
      </Link>
      <h1 className="mt-6 font-display text-4xl">Add merch</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Upload flat front and back images. We&apos;ll generate the 3D preview
        automatically and save the product as a draft until you publish it.
      </p>

      <form action={createProductAction} className="mt-10 space-y-8">
        <Field label="Name" name="name" required />
        <Field
          label="Description"
          name="description"
          textarea
          rows={4}
          placeholder="Short product description shown on the storefront."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Price (USD)"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
          />
          <Field
            label="Shipping fee (USD, flat per line item)"
            name="shipping"
            type="number"
            step="0.01"
            min="0"
            defaultValue="0"
          />
        </div>
        <Field
          label="Sizes (comma separated)"
          name="sizes"
          defaultValue="S,M,L,XL"
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FileField label="Front image" name="front" />
          <FileField label="Back image" name="back" />
        </div>

        <div className="flex items-center gap-4 border-t border-border pt-6">
          <button
            type="submit"
            className="border border-foreground bg-foreground px-6 py-3 text-sm font-medium tracking-[0.24em] uppercase text-background hover:opacity-85"
          >
            Create + generate 3D
          </button>
          <Link
            href="/admin/merch"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Meshy will consume ~20 credits per generation. Regeneration is
          available on the preview screen if the result looks off.
        </p>
      </form>
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
  placeholder?: string;
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

function FileField({ label, name }: { label: string; name: string }) {
  return (
    <label className="block">
      <span className="editorial-eyebrow text-muted-foreground">{label}</span>
      <input
        type="file"
        name={name}
        accept="image/png,image/jpeg,image/webp"
        required
        className="mt-2 block w-full border border-border bg-transparent px-3 py-3 text-sm file:mr-3 file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-xs file:font-medium file:uppercase file:tracking-[0.2em]"
      />
    </label>
  );
}
