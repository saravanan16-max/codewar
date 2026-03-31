import { cookies } from "next/headers";

export async function getTeamIdFromCookie() {
  const store = await cookies();
  return store.get("team_id")?.value ?? null;
}

export async function isAdmin() {
  const store = await cookies();
  return store.get("admin")?.value === "1";
}
