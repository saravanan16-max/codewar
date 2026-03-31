import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const formData = await req.formData();
  await supabaseAdmin.from("test_cases").insert({
    problem_id: String(formData.get("problem_id") || ""),
    input_text: String(formData.get("input_text") || ""),
    expected_output: String(formData.get("expected_output") || ""),
    is_hidden: String(formData.get("is_hidden") || "true") === "true",
    weight: 1,
  });
  return NextResponse.redirect(new URL("/admin/problems", req.url));
}
