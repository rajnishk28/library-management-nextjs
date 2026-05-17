import { Loader2 } from "lucide-react";

export function LoadingPanel() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
      <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50">
        <Loader2 className="size-6 animate-spin text-indigo-600" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">Loading…</p>
        <p className="text-xs text-slate-400">Please wait a moment</p>
      </div>
    </div>
  );
}
