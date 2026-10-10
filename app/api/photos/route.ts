import { NextResponse } from "next/server";
import { readPhotos } from "@/lib/server/store";

export const dynamic = "force-dynamic";

/** Public: photo overrides the menu applies on top of the built-in photos. */
export async function GET() {
  return NextResponse.json({ photos: await readPhotos() }, { headers: { "Cache-Control": "public, max-age=0, s-maxage=5, stale-while-revalidate=30" } });
}
