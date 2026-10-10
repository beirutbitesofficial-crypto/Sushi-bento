import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { list, put } from "@vercel/blob";
import { type PhotoMap } from "@/lib/photos";

const CONFIG = "config/photos.json";

/**
 * Storage: Vercel Blob in production (BLOB_READ_WRITE_TOKEN, added automatically when a Blob store
 * is connected to the project). With LOCAL_STORAGE=1 it uses the .data/ folder instead (for local testing).
 */
const local = () => process.env.LOCAL_STORAGE === "1";
export const storageReady = () => local() || !!process.env.BLOB_READ_WRITE_TOKEN;
const LOCAL_DIR = path.join(process.cwd(), ".data");

export async function readPhotos(): Promise<PhotoMap> {
  try {
    if (local()) return JSON.parse(await fs.readFile(path.join(LOCAL_DIR, "photos.json"), "utf8"));
    if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
    const { blobs } = await list({ prefix: CONFIG, limit: 1 });
    const blob = blobs.find((b) => b.pathname === CONFIG);
    if (!blob) return {};
    // uploadedAt busts the CDN copy of the previous version.
    const res = await fetch(`${blob.url}?v=${new Date(blob.uploadedAt).getTime()}`, { cache: "no-store" });
    return res.ok ? ((await res.json()) as PhotoMap) : {};
  } catch {
    return {};
  }
}

export async function writePhotos(map: PhotoMap) {
  const body = JSON.stringify(map);
  if (local()) {
    await fs.mkdir(LOCAL_DIR, { recursive: true });
    await fs.writeFile(path.join(LOCAL_DIR, "photos.json"), body);
    return;
  }
  await put(CONFIG, body, { access: "public", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60 });
}

export async function saveImage(id: string, data: ArrayBuffer, contentType: string): Promise<string> {
  const ext = contentType === "image/png" ? "png" : contentType === "image/jpeg" ? "jpg" : "webp";
  const name = `${id}-${Date.now()}.${ext}`;
  if (local()) {
    await fs.mkdir(path.join(LOCAL_DIR, "uploads"), { recursive: true });
    await fs.writeFile(path.join(LOCAL_DIR, "uploads", name), Buffer.from(data));
    return `/api/local-file/${name}`;
  }
  const blob = await put(`menu/${name}`, Buffer.from(data), { access: "public", contentType, addRandomSuffix: true });
  return blob.url;
}

export async function readLocalFile(name: string) {
  if (!local() || !/^[a-z0-9-]+\.(webp|jpg|png)$/.test(name)) return null;
  try {
    return await fs.readFile(path.join(LOCAL_DIR, "uploads", name));
  } catch {
    return null;
  }
}
