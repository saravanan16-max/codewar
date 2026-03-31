import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const formData = await req.formData();
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const status = String(formData.get("status") || "draft").trim();

  if (status === "active") {
    await supabaseAdmin.from("rounds").update({ status: "ended" }).eq("status", "active");
  }

  if (id) {
    await supabaseAdmin.from("rounds").update({ status }).eq("id", id);
  } else {
    await supabaseAdmin.from("rounds").insert({ name, status });
  }

  return NextResponse.redirect(new URL("/admin/rounds", req.url));
}
