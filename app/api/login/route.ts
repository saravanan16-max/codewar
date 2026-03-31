import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const body = await req.json();
  const teamCode = String(body.teamCode || "").trim();
  const passcode = String(body.passcode || "").trim();

  const { data: team } = await supabaseAdmin.from("teams").select("id,passcode").eq("team_code", teamCode).single();
  if (!team || team.passcode !== passcode) {
    return NextResponse.json({ error: "Invalid team code or passcode" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("team_id", team.id, { httpOnly: true, sameSite: "lax", path: "/" });
  return res;
}
