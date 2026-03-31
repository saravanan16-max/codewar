import { redirect } from "next/navigation";
import Panel from "@/components/Panel";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function RoundsAdminPage() {
  if (!(await isAdmin())) redirect("/");
  const { data: rounds } = await supabaseAdmin.from("rounds").select("id,name,status,created_at").order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <h1 className="text-3xl font-bold">Round Manager</h1>
        <Panel>
          <form action="/api/admin/rounds" method="post" className="space-y-4">
            <input name="name" placeholder="Round name" required />
            <select name="status" defaultValue="draft">
              <option value="draft">draft</option>
              <option value="active">active</option>
              <option value="ended">ended</option>
            </select>
            <button className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950">Create Round</button>
          </form>
        </Panel>
        <Panel>
          <table>
            <thead><tr><th>Round</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {(rounds ?? []).map((round) => (
                <tr key={round.id}>
                  <td>{round.name}</td>
                  <td>{round.status}</td>
                  <td>
                    <form action="/api/admin/rounds" method="post">
                      <input type="hidden" name="id" value={round.id} />
                      <input type="hidden" name="name" value={round.name} />
                      <select name="status" defaultValue={round.status}>
                        <option value="draft">draft</option>
                        <option value="active">active</option>
                        <option value="ended">ended</option>
                      </select>
                      <button className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950" style={{ marginLeft: '.5rem' }}>Save</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </main>
  );
}
