import { redirect } from "next/navigation";
import Panel from "@/components/Panel";
import SubmitBox from "@/components/SubmitBox";
import { getTeamIdFromCookie } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const teamId = await getTeamIdFromCookie();
  if (!teamId) redirect("/");
  const { id } = await params;

  const { data: problem } = await supabaseAdmin.from("problems").select("id,title,statement,difficulty,score").eq("id", id).single();

  if (!problem) {
    return <main className="min-h-screen bg-slate-950 text-white p-6">Problem not found.</main>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <Panel>
          <h1 className="text-3xl font-bold">{problem.title}</h1>
          <p className="text-slate-400 mt-2">{problem.difficulty} • {problem.score} pts</p>
          <div className="mt-6 whitespace-pre-wrap text-slate-200">{problem.statement}</div>
        </Panel>
        <Panel>
          <SubmitBox problemId={problem.id} />
        </Panel>
      </div>
    </main>
  );
}
