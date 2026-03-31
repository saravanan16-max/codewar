import { redirect } from "next/navigation";
import Panel from "@/components/Panel";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function ProblemsAdminPage() {
  if (!(await isAdmin())) redirect("/");
  const { data: rounds } = await supabaseAdmin.from("rounds").select("id,name").order("created_at", { ascending: false });
  const { data: problems } = await supabaseAdmin.from("problems").select("id,title,score,difficulty,slug,round_id").order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <h1 className="text-3xl font-bold">Problem Forge</h1>
        <Panel>
          <form action="/api/admin/problems" method="post" className="space-y-4">
            <select name="round_id" required>
              <option value="">Select round</option>
              {(rounds ?? []).map((round) => <option key={round.id} value={round.id}>{round.name}</option>)}
            </select>
            <input name="title" placeholder="Title" required />
            <input name="slug" placeholder="slug" required />
            <textarea name="statement" placeholder="Problem statement" required style={{ minHeight: 160 }} />
            <div className="grid gap-4 md:grid-cols-2">
              <select name="difficulty" defaultValue="easy">
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
              <input name="score" type="number" defaultValue="100" required />
            </div>
            <button className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950">Create Problem</button>
          </form>
        </Panel>

        <Panel>
          <h2 className="text-2xl font-bold">Add Test Case</h2>
          <form action="/api/admin/test-cases" method="post" className="space-y-4 mt-4">
            <select name="problem_id" required>
              <option value="">Select problem</option>
              {(problems ?? []).map((problem) => <option key={problem.id} value={problem.id}>{problem.title}</option>)}
            </select>
            <textarea name="input_text" placeholder="Input" style={{ minHeight: 100 }} />
            <textarea name="expected_output" placeholder="Expected output" required style={{ minHeight: 100 }} />
            <select name="is_hidden" defaultValue="true">
              <option value="true">hidden</option>
              <option value="false">visible</option>
            </select>
            <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">Add Test Case</button>
          </form>
        </Panel>

        <Panel>
          <table>
            <thead><tr><th>Problem</th><th>Slug</th><th>Difficulty</th><th>Score</th></tr></thead>
            <tbody>
              {(problems ?? []).map((problem) => (
                <tr key={problem.id}><td>{problem.title}</td><td>{problem.slug}</td><td>{problem.difficulty}</td><td>{problem.score}</td></tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </main>
  );
}
