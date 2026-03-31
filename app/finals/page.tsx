import Panel from "@/components/Panel";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function FinalsPage() {
  const { data: rows } = await supabaseAdmin.from("leaderboard").select("*");
  const finalists = (rows ?? []).slice(0, 4);

  return (
    <main className="min-h-screen bg-grid text-white">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-glow">CodeWar Showdown</h1>
          <p className="text-slate-400 mt-2">Project this page for the live final battle.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {finalists.map((team, i) => (
            <Panel key={team.team_id}>
              <p className="text-slate-400">Finalist #{i + 1}</p>
              <h2 className="text-3xl font-bold mt-2">{team.team_name}</h2>
              <p className="mt-4">Score: {team.total_score}</p>
              <p>Solved: {team.solved_count}</p>
            </Panel>
          ))}
        </div>
      </div>
    </main>
  );
}
