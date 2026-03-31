import Link from "next/link";
import { redirect } from "next/navigation";
import Panel from "@/components/Panel";
import { isAdmin } from "@/lib/auth";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/");

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Control Room</h1>
          <p className="text-slate-400 mt-2">Manage teams, rounds, problems, and seed demo data.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/teams"><Panel><h2 className="text-xl font-bold">Teams</h2><p className="text-slate-400 mt-2">Create and review teams.</p></Panel></Link>
          <Link href="/admin/rounds"><Panel><h2 className="text-xl font-bold">Rounds</h2><p className="text-slate-400 mt-2">Start and stop contest rounds.</p></Panel></Link>
          <Link href="/admin/problems"><Panel><h2 className="text-xl font-bold">Problems</h2><p className="text-slate-400 mt-2">Create problems and test cases.</p></Panel></Link>
        </div>

        <Panel>
          <form action="/api/admin/seed" method="post">
            <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">Seed Demo Data</button>
          </form>
        </Panel>
      </div>
    </main>
  );
}
