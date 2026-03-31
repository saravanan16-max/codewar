import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { runLocalCode, normalizeOutput } from "@/lib/localJudge";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const teamId = cookieStore.get("team_id")?.value;

    if (!teamId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await req.json();
    const problemId = String(body.problemId || "").trim();
    const language = String(body.language || "").trim() as "python" | "java" | "cpp";
    const sourceCode = String(body.sourceCode || "");

    if (!problemId || !language || !sourceCode) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!["python", "java", "cpp"].includes(language)) {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
    }

    const { data: problem } = await supabaseAdmin.from("problems").select("id,score").eq("id", problemId).single();
    if (!problem) return NextResponse.json({ error: "Problem not found" }, { status: 404 });

    const { data: testCases } = await supabaseAdmin.from("test_cases").select("id,input_text,expected_output").eq("problem_id", problemId);
    if (!testCases || testCases.length === 0) {
      return NextResponse.json({ error: "No test cases found for this problem" }, { status: 400 });
    }

    let passed = 0;
    const total = testCases.length;
    let runtimeMs: number | null = null;
    let verdict = "Accepted";

    for (const tc of testCases) {
      const judge = await runLocalCode({ language, sourceCode, stdin: tc.input_text ?? "" });
      runtimeMs = judge.runtimeMs ?? runtimeMs;

      if (judge.compileError) {
        verdict = "Compilation Error";
        break;
      }
      if (judge.stderr) {
        verdict = judge.stderr.includes("Time Limit Exceeded") ? "Time Limit Exceeded" : "Runtime Error";
        break;
      }

      const actual = normalizeOutput(judge.stdout);
      const expected = normalizeOutput(tc.expected_output);
      if (actual === expected) passed += 1;
      else {
        verdict = "Wrong Answer";
        break;
      }
    }

    const score = passed === total ? problem.score : 0;

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("submissions")
      .insert({
        team_id: teamId,
        problem_id: problemId,
        language,
        source_code: sourceCode,
        verdict,
        passed_count: passed,
        total_count: total,
        runtime_ms: runtimeMs,
        memory_kb: null,
        score,
      })
      .select("id,verdict,passed_count,total_count,score")
      .single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    return NextResponse.json(inserted);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown server error" }, { status: 500 });
  }
}
