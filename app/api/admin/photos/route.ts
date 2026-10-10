import { NextResponse } from "next/server";
import { allItems } from "@/lib/menu";
import { cleanSetting, type PhotoSetting } from "@/lib/photos";
import { isAdmin } from "@/lib/server/auth";
import { readPhotos, storageReady, writePhotos } from "@/lib/server/store";

export const dynamic = "force-dynamic";
const ids = new Set(allItems.map((i) => i.id));

/** Set (or with setting: null, reset) one item's photo. */
export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!storageReady()) return NextResponse.json({ error: "Storage is not connected (Vercel → Storage → Blob)." }, { status: 503 });
  const { id, setting } = (await req.json().catch(() => ({}))) as { id?: string; setting?: PhotoSetting | null };
  if (!id || !ids.has(id)) return NextResponse.json({ error: "Unknown item." }, { status: 400 });
  const map = await readPhotos();
  const clean = setting ? cleanSetting(setting) : null;
  if (clean) map[id] = clean;
  else delete map[id];
  await writePhotos(map);
  return NextResponse.json({ ok: true, photos: map });
}
