"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createMerchAction } from "../actions";

export function NewMerchForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  function handleFile(setter: (url: string | null) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) {
        setter(null);
        return;
      }
      setter(URL.createObjectURL(f));
    };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await createMerchAction(fd);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    startTransition(() => {
      router.push("/portal/merch");
      router.refresh();
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <label className="block">
        <span className="text-sm font-medium">Name</span>
        <input
          required
          name="name"
          type="text"
          maxLength={120}
          className="portal-input mt-2"
          placeholder="e.g. Hands of Hope Crewneck"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Description</span>
        <textarea
          name="description"
          rows={4}
          maxLength={2000}
          className="portal-input mt-2 min-h-24"
          placeholder="Short product description shown on the storefront."
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Price (USD)</span>
          <input
            required
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            className="portal-input mt-2"
            placeholder="35.00"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Shipping fee (USD)</span>
          <input
            name="shipping"
            type="number"
            step="0.01"
            min="0"
            defaultValue="0"
            className="portal-input mt-2"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Sizes</span>
        <input
          name="sizes"
          type="text"
          defaultValue="S,M,L,XL"
          className="portal-input mt-2"
          placeholder="Comma separated, e.g. S,M,L,XL"
        />
        <span className="mt-1 block text-xs text-muted-foreground">
          Comma separated. Leave as-is for a standard apparel drop.
        </span>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageField
          label="Front image"
          name="front"
          preview={frontPreview}
          onChange={handleFile(setFrontPreview)}
        />
        <ImageField
          label="Back image"
          name="back"
          preview={backPreview}
          onChange={handleFile(setBackPreview)}
        />
      </div>

      {error ? (
        <p
          className="text-sm"
          style={{ color: "var(--status-rejected)" }}
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-4 border-t border-border pt-6">
        <button
          type="submit"
          disabled={pending}
          className="portal-btn-primary disabled:opacity-60"
        >
          {pending ? "Publishing…" : "Publish product"}
        </button>
        <Cancel />
      </div>
      <p className="text-xs text-muted-foreground">
        Product goes live on the public storefront immediately. Hide or delete
        it from the catalog page if you need to pull it down.
      </p>
    </form>
  );
}

function ImageField({
  label,
  name,
  preview,
  onChange,
}: {
  label: string;
  name: string;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-2 border border-border rounded-sm p-3 bg-card">
        <div className="relative aspect-[4/5] w-full bg-muted overflow-hidden rounded-sm">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <input
          required
          type="file"
          name={name}
          accept="image/png,image/jpeg,image/webp"
          onChange={onChange}
          className="mt-3 block w-full text-xs file:mr-3 file:border-0 file:bg-muted file:px-3 file:py-2 file:text-xs file:font-medium file:uppercase file:tracking-[0.2em]"
        />
      </div>
    </label>
  );
}

function Cancel() {
  return (
    <a
      href="/portal/merch"
      className="text-sm text-muted-foreground hover:text-foreground"
    >
      Cancel
    </a>
  );
}
