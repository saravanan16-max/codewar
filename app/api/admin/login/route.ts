import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const secret = String(body.secret || "");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Invalid admin secret" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", "1", { httpOnly: true, sameSite: "lax", path: "/" });
  return res;
}
