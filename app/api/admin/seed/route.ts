import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const { data: existingTeam } = await supabaseAdmin.from("teams").select("id").eq("team_code", "ALPHA01").maybeSingle();
  if (!existingTeam) {
    await supabaseAdmin.from("teams").insert({ name: "Alpha Coders", team_code: "ALPHA01", passcode: "1234" });
  }

  let roundId: string;
  const { data: existingRound } = await supabaseAdmin.from("rounds").select("id").eq("name", "Round 1 - Speed Coding").maybeSingle();
  if (existingRound) {
    roundId = existingRound.id;
    await supabaseAdmin.from("rounds").update({ status: "active" }).eq("id", roundId);
  } else {
    const { data: insertedRound } = await supabaseAdmin.from("rounds").insert({ name: "Round 1 - Speed Coding", status: "active" }).select("id").single();
    roundId = insertedRound!.id;
  }

  const { data: existingProblem } = await supabaseAdmin.from("problems").select("id").eq("slug", "sum-two-numbers").maybeSingle();
  let problemId: string;
  if (existingProblem) {
    problemId = existingProblem.id;
  } else {
    const { data: problem } = await supabaseAdmin.from("problems").insert({
      round_id: roundId,
      title: "Sum Two Numbers",
      slug: "sum-two-numbers",
      statement: "Read two integers and print their sum.\n\nInput:\nTwo integers separated by space.\n\nOutput:\nPrint their sum.",
      difficulty: "easy",
      score: 100,
    }).select("id").single();
    problemId = problem!.id;
  }

  const { data: cases } = await supabaseAdmin.from("test_cases").select("id").eq("problem_id", problemId);
  if (!cases || cases.length === 0) {
    await supabaseAdmin.from("test_cases").insert([
      { problem_id: problemId, input_text: "2 3", expected_output: "5", is_hidden: false, weight: 1 },
      { problem_id: problemId, input_text: "10 20", expected_output: "30", is_hidden: true, weight: 1 },
      { problem_id: problemId, input_text: "100 250", expected_output: "350", is_hidden: true, weight: 1 },
    ]);
  }

  return NextResponse.redirect(new URL("/admin", req.url));
}
