/** Photo overrides set from /admin. Keyed by menu item id. */
export type PhotoSetting = {
  /** Uploaded photo URL. Absent = keep the built-in photo. */
  src?: string;
  /** 1 = no zoom. */
  zoom?: number;
  /** Focal point in % (0–100). */
  x?: number;
  y?: number;
  /** "cover" fills the frame, "contain" shows the whole photo. */
  fit?: "cover" | "contain";
};

export type PhotoMap = Record<string, PhotoSetting>;

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function cleanSetting(s: PhotoSetting): PhotoSetting | null {
  const out: PhotoSetting = {};
  if (typeof s.src === "string" && /^(https:\/\/|\/api\/local-file\/)/.test(s.src) && s.src.length < 500) out.src = s.src;
  if (typeof s.zoom === "number" && isFinite(s.zoom) && s.zoom !== 1) out.zoom = clamp(s.zoom, 1, 3);
  if (typeof s.x === "number" && isFinite(s.x) && s.x !== 50) out.x = clamp(s.x, 0, 100);
  if (typeof s.y === "number" && isFinite(s.y) && s.y !== 50) out.y = clamp(s.y, 0, 100);
  if (s.fit === "cover" || s.fit === "contain") out.fit = s.fit;
  return Object.keys(out).length ? out : null;
}
