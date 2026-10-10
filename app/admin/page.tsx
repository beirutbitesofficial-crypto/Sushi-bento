import type { Metadata } from "next";
import Admin from "@/components/admin/Admin";

export const metadata: Metadata = { title: "Admin — Sushi Bento", robots: { index: false, follow: false } };

export default function AdminPage() {
  return <Admin />;
}
