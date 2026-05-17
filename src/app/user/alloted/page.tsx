"use client";

import { useEffect, useState } from "react";
import { BookMarked } from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/lib/api/services/user.service";
import { LoadingPanel } from "@/components/loading-panel";
import { getIssueStatus } from "@/components/status-badge";
import { UserIssueTable } from "@/components/user-issue-table";

export default function UserAllotedPage() {
  const [loading, setLoading] = useState(true);
  const [issues, setIssues]   = useState<any[]>([]);

  async function loadData() {
    try {
      setIssues(await userService.getIssues());
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to load allotted books");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void Promise.resolve().then(loadData); }, []);

  async function requestReturn(issueId: string) {
    try {
      await userService.requestReturn(issueId);
      toast.success("Return request submitted — awaiting admin approval");
      loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to submit return request");
    }
  }

  const active = issues.filter((issue) =>
    ["alloted", "return_requested"].includes(getIssueStatus(issue))
  );

  if (loading) return <LoadingPanel />;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-900/5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Currently issued</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{active.length}</p>
        </div>
        <div className="rounded-xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-900/5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Approved</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600">
            {active.filter((i) => getIssueStatus(i) === "alloted").length}
          </p>
        </div>
        <div className="rounded-xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-900/5 hidden sm:block">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Pending return</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {active.filter((i) => getIssueStatus(i) === "return_requested").length}
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
          <BookMarked className="size-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-800">My books</span>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">
            {active.length}
          </span>
        </div>
        <UserIssueTable issues={active} onReturn={requestReturn} />
      </div>
    </div>
  );
}
