import { NextResponse } from "next/server";
import { checkPassword, isAdmin, passwordSet, setSession } from "@/lib/server/auth";
import { storageReady } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ authed: await isAdmin(), setup: { password: passwordSet(), storage: storageReady() } });
}

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!passwordSet()) return NextResponse.json({ error: "ADMIN_PASSWORD is not set on the server." }, { status: 503 });
  if (typeof password !== "string" || !checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  await setSession(true);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await setSession(false);
  return NextResponse.json({ ok: true });
}
