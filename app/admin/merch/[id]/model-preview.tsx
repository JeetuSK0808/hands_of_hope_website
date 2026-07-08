"use client";

import * as React from "react";
import Script from "next/script";
import type { MerchModelStatus } from "@/lib/merch/types";

type Props = {
  productId: string;
  initialStatus: MerchModelStatus;
  initialGlbUrl: string | null;
  refresh: (id: string) => Promise<{
    status: string;
    url?: string;
    progress?: number;
    error?: string;
  }>;
};

export function ModelPreview({
  productId,
  initialStatus,
  initialGlbUrl,
  refresh,
}: Props) {
  const [status, setStatus] = React.useState<string>(initialStatus);
  const [url, setUrl] = React.useState<string | null>(initialGlbUrl);
  const [progress, setProgress] = React.useState<number>(0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (status === "ready" || status === "failed") return;
    let cancelled = false;

    async function tick() {
      try {
        const result = await refresh(productId);
        if (cancelled) return;
        setStatus(result.status);
        if (result.url) setUrl(result.url);
        if (typeof result.progress === "number") setProgress(result.progress);
        if (result.error) setError(result.error);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Polling failed");
        }
      }
    }

    tick();
    const id = setInterval(tick, 8000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [status, productId, refresh]);

  return (
    <div>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        strategy="afterInteractive"
      />
      <div className="relative aspect-square w-full overflow-hidden bg-secondary">
        {status === "ready" && url ? (
          <model-viewer
            src={url}
            alt="Product 3D preview"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            exposure="1"
            style={{ width: "100%", height: "100%" }}
          />
        ) : status === "failed" ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="editorial-eyebrow text-destructive">Failed</span>
            <p className="text-sm text-muted-foreground">
              {error ??
                "Meshy could not generate the model. Try regenerating from clearer flat images."}
            </p>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <span className="editorial-eyebrow text-muted-foreground">
              Generating
            </span>
            <p className="text-sm text-muted-foreground">
              {progress > 0 ? `${Math.round(progress)}%` : "Waiting on Meshy…"}
            </p>
            <p className="text-xs text-muted-foreground">
              This usually takes 1–3 minutes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
