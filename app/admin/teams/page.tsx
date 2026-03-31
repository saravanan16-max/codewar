import { redirect } from "next/navigation";
import Panel from "@/components/Panel";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function TeamsAdminPage() {
  if (!(await isAdmin())) redirect("/");
  const { data: teams } = await supabaseAdmin.from("teams").select("id,name,team_code,created_at").order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <h1 className="text-3xl font-bold">Team Manager</h1>
        <Panel>
          <form action="/api/admin/teams" method="post" className="space-y-4">
            <input name="name" placeholder="Team name" required />
            <input name="team_code" placeholder="Team code" required />
            <input name="passcode" placeholder="Passcode" required />
            <button className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950">Create Team</button>
          </form>
        </Panel>
        <Panel>
          <table>
            <thead><tr><th>Team</th><th>Code</th><th>Created</th></tr></thead>
            <tbody>
              {(teams ?? []).map((team) => (
                <tr key={team.id}><td>{team.name}</td><td>{team.team_code}</td><td>{new Date(team.created_at).toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </main>
  );
}
