import Link from "next/link";

export default function NavBar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-white">
        <Link href="/" className="text-xl font-bold tracking-wide">CodeWar Arena</Link>
        <nav className="flex gap-4 text-sm text-slate-300">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/finals">Finals</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
