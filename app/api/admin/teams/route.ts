import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const formData = await req.formData();
  const name = String(formData.get("name") || "").trim();
  const team_code = String(formData.get("team_code") || "").trim();
  const passcode = String(formData.get("passcode") || "").trim();
  await supabaseAdmin.from("teams").insert({ name, team_code, passcode });
  return NextResponse.redirect(new URL("/admin/teams", req.url));
}
