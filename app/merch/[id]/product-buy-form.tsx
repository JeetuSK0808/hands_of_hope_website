"use client";

import * as React from "react";
import { formatUsd } from "@/lib/merch/format";
import { cn } from "@/lib/utils";

type Props = {
  productId: string;
  sizes: string[];
  priceCents: number;
  shippingCents: number;
};

export function ProductBuyForm({
  productId,
  sizes,
  priceCents,
  shippingCents,
}: Props) {
  const [size, setSize] = React.useState<string>(sizes[0] ?? "");
  const [quantity, setQuantity] = React.useState<number>(1);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!size) {
      setError("Please choose a size.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/merch/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ product_id: productId, size, quantity }],
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Checkout failed");
      }
      const body = (await res.json()) as { url?: string };
      if (!body.url) throw new Error("No checkout URL returned");
      window.location.href = body.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-baseline justify-between border-t border-border pt-6">
        <span className="editorial-eyebrow text-muted-foreground">Price</span>
        <span className="font-display text-3xl tabular-nums">
          {formatUsd(priceCents)}
        </span>
      </div>

      <div>
        <div className="editorial-eyebrow text-muted-foreground">Size</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={cn(
                "min-w-[3.25rem] border px-4 py-2 text-sm tracking-wide transition-colors",
                size === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground"
              )}
              aria-pressed={size === s}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="editorial-eyebrow text-muted-foreground">Quantity</div>
        <div className="mt-3 inline-flex items-center border border-border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-11 w-11 text-lg leading-none hover:bg-secondary"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-sm tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="h-11 w-11 text-lg leading-none hover:bg-secondary"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {shippingCents > 0 ? (
        <div className="flex items-baseline justify-between text-sm text-muted-foreground">
          <span>Shipping (flat)</span>
          <span className="tabular-nums">{formatUsd(shippingCents)}</span>
        </div>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full border border-foreground bg-foreground py-4 text-sm font-medium tracking-[0.24em] uppercase text-background transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {submitting ? "Redirecting…" : "Checkout"}
      </button>
    </form>
  );
}
