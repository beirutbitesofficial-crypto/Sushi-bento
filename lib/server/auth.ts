import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "sb_admin";
const password = () => process.env.ADMIN_PASSWORD ?? "";
export const passwordSet = () => password().length >= 6;

const token = () => createHmac("sha256", password()).update("sushi-bento-admin-v1").digest("hex");

const same = (a: string, b: string) => {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
};

export function checkPassword(input: string) {
  return passwordSet() && same(createHmac("sha256", "cmp").update(input).digest("hex"), createHmac("sha256", "cmp").update(password()).digest("hex"));
}

export async function isAdmin() {
  if (!passwordSet()) return false;
  const c = (await cookies()).get(COOKIE)?.value ?? "";
  return same(c, token());
}

export async function setSession(on: boolean) {
  const jar = await cookies();
  if (on) jar.set(COOKIE, token(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 30 });
  else jar.delete(COOKIE);
}
