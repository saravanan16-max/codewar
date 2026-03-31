"use client";

import { useState } from "react";

const STARTER: Record<"python" | "java" | "cpp", string> = {
  python: `a, b = map(int, input().split())\nprint(a + b)\n`,
  java: `import java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    System.out.println(a + b);\n  }\n}\n`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  cout << a + b;\n  return 0;\n}\n`,
};

export default function SubmitBox({ problemId }: { problemId: string }) {
  const [language, setLanguage] = useState<"python" | "java" | "cpp">("python");
  const [code, setCode] = useState(STARTER.python);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  function chooseLanguage(next: "python" | "java" | "cpp") {
    setLanguage(next);
    setCode(STARTER[next]);
  }

  async function submit() {
    setLoading(true);
    setResult("");
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId, language, sourceCode: code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setResult(data.error || "Submission failed");
      return;
    }
    setResult(`Verdict: ${data.verdict}\nPassed: ${data.passed_count}/${data.total_count}\nScore: ${data.score}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["python", "java", "cpp"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => chooseLanguage(lang)}
            className={`rounded-xl px-4 py-2 font-medium ${language === lang ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-white"}`}
          >
            {lang === "cpp" ? "C++" : lang === "java" ? "Java" : "Python"}
          </button>
        ))}
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="min-h-[360px] w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-cyan-100 outline-none"
      />

      <button onClick={submit} disabled={loading} className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">
        {loading ? "Judging..." : "Submit to Arena"}
      </button>

      {result ? <pre className="whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-sm text-slate-200">{result}</pre> : null}
    </div>
  );
}
