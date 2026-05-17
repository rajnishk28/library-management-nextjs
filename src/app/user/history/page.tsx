"use client";

import { useEffect, useMemo, useState } from "react";
import { History } from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/lib/api/services/user.service";
import { LoadingPanel } from "@/components/loading-panel";
import { getIssueStatus } from "@/components/status-badge";
import { UserIssueTable } from "@/components/user-issue-table";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "all", label: "All", dot: "bg-slate-400" },
  { value: "pending", label: "Pending", dot: "bg-amber-400" },
  { value: "alloted", label: "Approved", dot: "bg-indigo-500" },
  { value: "return_requested", label: "Return Requested", dot: "bg-blue-500" },
  { value: "returned", label: "Returned", dot: "bg-emerald-500" },
  { value: "rejected", label: "Rejected", dot: "bg-red-500" },
];

export default function UserHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  async function loadData() {
    try {
      setIssues(await userService.getIssues());
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to load history");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void Promise.resolve().then(loadData); }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const i of issues) {
      const s = getIssueStatus(i);
      map[s] = (map[s] || 0) + 1;
    }
    return map;
  }, [issues]);

  const filtered = useMemo(() =>
    activeTab === "all" ? issues : issues.filter((i) => getIssueStatus(i) === activeTab),
    [issues, activeTab]
  );

  if (loading) return <LoadingPanel />;

  return (
    <div className="space-y-4">

      {/* Filter bar */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((tab) => {
          const count = tab.value === "all" ? issues.length : (counts[tab.value] ?? 0);
          const active = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all",
                active
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {tab.value !== "all" && (
                <span className={cn("size-1.5 rounded-full shrink-0", active ? "bg-white/70" : tab.dot)} />
              )}
              {tab.label}
              {count > 0 && (
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
          <History className="size-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-800">
            {TABS.find((t) => t.value === activeTab)?.label ?? "All"}
          </span>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">
            {filtered.length}
          </span>
        </div>
        <UserIssueTable issues={filtered} showAll />
      </div>

    </div>
  );
}
