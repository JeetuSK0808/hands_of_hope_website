"use client";

const TARGET_BYTES = 2 * 1024 * 1024;
const MAX_DIMENSION = 2200;
const QUALITY_STEPS = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4];

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function fitDimensions(w: number, h: number, max: number) {
  if (w <= max && h <= max) return { w, h };
  const scale = Math.min(max / w, max / h);
  return { w: Math.round(w * scale), h: Math.round(h * scale) };
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas blob failed"))),
      "image/jpeg",
      quality,
    );
  });
}

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= TARGET_BYTES && file.type === "image/jpeg") return file;

  const img = await loadImage(file);
  const { w, h } = fitDimensions(img.naturalWidth, img.naturalHeight, MAX_DIMENSION);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);

  let currentW = w;
  let currentH = h;
  let currentCanvas = canvas;

  for (let attempt = 0; attempt < 4; attempt++) {
    for (const q of QUALITY_STEPS) {
      const blob = await canvasToBlob(currentCanvas, q);
      if (blob.size <= TARGET_BYTES) {
        const base = file.name.replace(/\.[^.]+$/, "");
        return new File([blob], `${base}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
      }
    }
    currentW = Math.round(currentW * 0.8);
    currentH = Math.round(currentH * 0.8);
    const next = document.createElement("canvas");
    next.width = currentW;
    next.height = currentH;
    const nextCtx = next.getContext("2d");
    if (!nextCtx) break;
    nextCtx.drawImage(img, 0, 0, currentW, currentH);
    currentCanvas = next;
  }

  const finalBlob = await canvasToBlob(currentCanvas, 0.4);
  const base = file.name.replace(/\.[^.]+$/, "");
  return new File([finalBlob], `${base}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
}
