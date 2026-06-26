import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const source = path.join(root, "public", "brand", "logo.png");

const trimmed = await sharp(source)
  .trim({ background: { r: 255, g: 255, b: 255, alpha: 0 }, threshold: 10 })
  .toBuffer();

const meta = await sharp(trimmed).metadata();
const size = Math.max(meta.width ?? 0, meta.height ?? 0);
const padding = Math.round(size * 0.08);
const canvas = size + padding * 2;

const square = await sharp({
  create: {
    width: canvas,
    height: canvas,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([
    {
      input: trimmed,
      gravity: "center",
    },
  ])
  .png()
  .toBuffer();

await sharp(square)
  .resize(512, 512)
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, "app", "icon.png"));

await sharp(square)
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, "app", "apple-icon.png"));

console.log("Favicons regenerated.");
