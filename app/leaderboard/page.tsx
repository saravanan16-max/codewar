import Panel from "@/components/Panel";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function LeaderboardPage() {
  const { data: rows } = await supabaseAdmin.from("leaderboard").select("*");

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl p-6 space-y-6">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <Panel>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Solved</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {(rows ?? []).map((row, index) => (
                <tr key={row.team_id}>
                  <td>{index + 1}</td>
                  <td>{row.team_name}</td>
                  <td>{row.solved_count}</td>
                  <td>{row.total_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </main>
  );
}
