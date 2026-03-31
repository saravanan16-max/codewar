import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const formData = await req.formData();
  await supabaseAdmin.from("problems").insert({
    round_id: String(formData.get("round_id") || ""),
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    statement: String(formData.get("statement") || ""),
    difficulty: String(formData.get("difficulty") || "easy"),
    score: Number(formData.get("score") || 100),
  });
  return NextResponse.redirect(new URL("/admin/problems", req.url));
}
