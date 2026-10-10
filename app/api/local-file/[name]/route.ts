import { readLocalFile } from "@/lib/server/store";

/** Serves uploads in LOCAL_STORAGE=1 mode only (local testing). */
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const data = await readLocalFile(name);
  if (!data) return new Response("Not found", { status: 404 });
  const type = name.endsWith(".png") ? "image/png" : name.endsWith(".jpg") ? "image/jpeg" : "image/webp";
  return new Response(new Uint8Array(data), { headers: { "Content-Type": type } });
}
