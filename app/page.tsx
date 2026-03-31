"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Panel from "@/components/Panel";

export default function HomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<"team" | "admin">("team");
  const [teamCode, setTeamCode] = useState("ALPHA01");
  const [passcode, setPasscode] = useState("1234");
  const [adminSecret, setAdminSecret] = useState("");
  const [message, setMessage] = useState("");

  async function loginTeam(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamCode, passcode }),
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Login failed");
    router.push("/dashboard");
  }

  async function loginAdmin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: adminSecret }),
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Admin login failed");
    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-grid text-white">
      <div className="mx-auto max-w-5xl p-6">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold text-glow">CodeWar Arena</h1>
          <p className="text-slate-400">A complete symposium-ready coding battle system for Python, Java, and C++.</p>
        </div>

        <div className="mx-auto" style={{ maxWidth: 540, marginTop: '2rem' }}>
          <Panel>
            <div className="flex gap-3" style={{ marginBottom: '1rem' }}>
              <button className={`rounded-xl px-4 py-2 ${mode === "team" ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-white"}`} onClick={() => setMode("team")}>Team Login</button>
              <button className={`rounded-xl px-4 py-2 ${mode === "admin" ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-white"}`} onClick={() => setMode("admin")}>Admin Login</button>
            </div>

            {mode === "team" ? (
              <form onSubmit={loginTeam} className="space-y-4">
                <input placeholder="Team code" value={teamCode} onChange={(e) => setTeamCode(e.target.value)} />
                <input placeholder="Passcode" type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} />
                <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">Enter Arena</button>
              </form>
            ) : (
              <form onSubmit={loginAdmin} className="space-y-4">
                <input placeholder="Admin secret" type="password" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} />
                <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">Open Control Room</button>
              </form>
            )}

            {message ? <p className="mt-4 text-sm" style={{ color: '#fca5a5' }}>{message}</p> : null}
          </Panel>
        </div>
      </div>
    </main>
  );
}
