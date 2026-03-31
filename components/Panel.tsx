import { PropsWithChildren } from "react";

export default function Panel({ children }: PropsWithChildren) {
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">{children}</div>;
}
