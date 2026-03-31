import Link from "next/link";
import { redirect } from "next/navigation";
import Panel from "@/components/Panel";
import { getTeamIdFromCookie } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function DashboardPage() {
  const teamId = await getTeamIdFromCookie();
  if (!teamId) redirect("/");

  const { data: team } = await supabaseAdmin.from("teams").select("id,name,team_code").eq("id", teamId).single();
  const { data: activeRound } = await supabaseAdmin.from("rounds").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(1).single();
  const problems = activeRound ? (await supabaseAdmin.from("problems").select("id,title,difficulty,score").eq("round_id", activeRound.id).order("created_at", { ascending: true })).data ?? [] : [];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {team?.name}</h1>
            <p className="text-slate-400">Team code: {team?.team_code}</p>
          </div>
          <Link href="/leaderboard" className="rounded-xl bg-slate-800 px-4 py-2">View Leaderboard</Link>
        </div>

        {activeRound ? (
          <Panel>
            <h2 className="text-2xl font-bold">{activeRound.name}</h2>
            <p className="text-slate-400 mt-2">Status: {activeRound.status}</p>
          </Panel>
        ) : (
          <Panel>
            <h2 className="text-2xl font-bold">No active round</h2>
            <p className="text-slate-400 mt-2">Use the admin panel to activate a round.</p>
          </Panel>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {problems.map((problem) => (
            <Link key={problem.id} href={`/problem/${problem.id}`}>
              <Panel>
                <h3 className="text-xl font-semibold">{problem.title}</h3>
                <p className="text-slate-400 mt-2">{problem.difficulty} • {problem.score} pts</p>
              </Panel>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
