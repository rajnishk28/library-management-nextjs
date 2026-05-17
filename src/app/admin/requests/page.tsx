"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { adminService } from "@/lib/api/services/admin.service";
import { AdminRequestTable } from "@/components/admin-request-table";
import { LoadingPanel } from "@/components/loading-panel";
import { getIssueStatus } from "@/components/status-badge";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "alloted", label: "Approved" },
  { value: "return_requested", label: "Return Requests" },
  { value: "returned", label: "Returned" },
  { value: "rejected", label: "Rejected" },
];

const TAB_DOT: Record<string, string> = {
  pending: "bg-amber-400",
  alloted: "bg-emerald-500",
  return_requested: "bg-blue-500",
  returned: "bg-emerald-400",
  rejected: "bg-red-500",
};

export default function AdminRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  async function loadData() {
    try {
      setRequests(await adminService.getRequests());
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void Promise.resolve().then(loadData); }, []);

  async function updateRequestStatus(issueId: string, status: string) {
    try {
      await adminService.updateRequestStatus(issueId, status);
      toast.success("Status updated");
      loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to update request");
    }
  }

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of requests) {
      const s = getIssueStatus(r);
      map[s] = (map[s] || 0) + 1;
    }
    return map;
  }, [requests]);

  const filtered = useMemo(() =>
    activeTab === "all"
      ? requests
      : requests.filter((r) => getIssueStatus(r) === activeTab),
    [requests, activeTab]
  );

  if (loading) return <LoadingPanel />;

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((tab) => {
          const count = tab.value === "all" ? requests.length : (counts[tab.value] ?? 0);
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
                <span className={cn("size-1.5 rounded-full shrink-0", active ? "bg-white/70" : (TAB_DOT[tab.value] ?? "bg-slate-400"))} />
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

      <AdminRequestTable
        requests={filtered}
        onStatus={updateRequestStatus}
        activeTab={activeTab}
        title={`${TABS.find((t) => t.value === activeTab)?.label ?? "All"} (${filtered.length})`}
      />
    </div>
  );
}
