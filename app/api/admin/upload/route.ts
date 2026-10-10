import { NextResponse } from "next/server";
import { allItems } from "@/lib/menu";
import { isAdmin } from "@/lib/server/auth";
import { saveImage, storageReady } from "@/lib/server/store";

export const dynamic = "force-dynamic";
const ids = new Set(allItems.map((i) => i.id));
const TYPES = new Set(["image/webp", "image/jpeg", "image/png"]);

/** Body: the image bytes (already resized in the browser). Query: ?id=<item id>. */
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!storageReady()) return NextResponse.json({ error: "Storage is not connected (Vercel → Storage → Blob)." }, { status: 503 });
  const id = new URL(req.url).searchParams.get("id") ?? "";
  const type = req.headers.get("content-type") ?? "";
  if (!ids.has(id)) return NextResponse.json({ error: "Unknown item." }, { status: 400 });
  if (!TYPES.has(type)) return NextResponse.json({ error: "Use a JPG, PNG or WebP photo." }, { status: 415 });
  const data = await req.arrayBuffer();
  if (data.byteLength > 4 * 1024 * 1024) return NextResponse.json({ error: "Photo too large." }, { status: 413 });
  return NextResponse.json({ url: await saveImage(id, data, type) });
}
