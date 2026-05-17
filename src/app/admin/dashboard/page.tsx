"use client";

import { useEffect, useState } from "react";
import {
  BookOpen, Users, ClipboardList, CheckCircle2,
  RotateCcw, Library, TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/api/services/admin.service";
import { AdminRequestTable } from "@/components/admin-request-table";
import { LoadingPanel } from "@/components/loading-panel";
import { getIssueStatus } from "@/components/status-badge";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any>(null);

  async function loadData() {
    try {
      const [statsData, requestList, inventoryData] = await Promise.all([
        adminService.getStats(),
        adminService.getRequests(),
        adminService.getInventory(),
      ]);
      setStats(statsData);
      setRequests(requestList);
      setInventory(inventoryData);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to load dashboard");
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

  if (loading) return <LoadingPanel />;

  // Use live inventory data when available, fall back to stats-derived values
  const totalCopies = inventory?.total_copies ?? stats.books.total_copies;
  const availCopies = inventory?.available_copies ?? stats.books.available_copies;
  const issuedCopies = inventory?.issued_copies ?? stats.books.issued_copies;
  const pendingReqs = inventory?.pending_requests ?? stats.requests.pending;
  const activeIssues = inventory?.active_issues ?? stats.requests.alloted;
  const returnReqs = inventory?.return_requests ?? stats.requests.return_requested;

  const availPct = totalCopies > 0
    ? Math.round((availCopies / totalCopies) * 100)
    : 0;

  return (
    <div className="space-y-6">

      {/* ── Top KPI row ───────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total titles" value={stats.books.total} sub={`${stats.books.total_copies} copies total`} icon={BookOpen} accent="indigo" />
        <KpiCard label="Registered users" value={stats.users.total} sub={`${stats.users.active} active`} icon={Users} accent="violet" />
        <KpiCard label="Active issues" value={stats.requests.alloted} sub={`${stats.requests.pending} pending approval`} icon={CheckCircle2} accent="emerald" />
        <KpiCard label="Return requests" value={stats.requests.return_requested} sub={`${stats.requests.returned} returned total`} icon={RotateCcw} accent="amber" />
      </div>

      {/* ── Inventory + Request breakdown ─────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Inventory card */}
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md hover:ring-indigo-500/20">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50">
              <Library className="size-4 text-indigo-600" />
            </span>
            <span className="text-sm font-semibold text-slate-800">Inventory</span>
          </div>

          <div className="space-y-3">
            <InventoryRow label="Total copies" value={totalCopies} />
            <InventoryRow label="Available" value={availCopies} color="emerald" />
            <InventoryRow label="Issued out" value={issuedCopies} color="amber" />
            <InventoryRow label="Pending reqs" value={pendingReqs} color="amber" />
            <InventoryRow label="Return reqs" value={returnReqs} color="blue" />
          </div>

          {/* Availability bar */}
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Availability</span>
              <span className="font-semibold text-slate-700">{availPct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${availPct > 50 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : availPct > 20 ? "bg-gradient-to-r from-amber-300 to-amber-400" : "bg-gradient-to-r from-red-400 to-red-500"}`}
                style={{ width: `${availPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Request breakdown */}
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md hover:ring-indigo-500/20 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-violet-50">
              <TrendingUp className="size-4 text-violet-600" />
            </span>
            <span className="text-sm font-semibold text-slate-800">Request breakdown</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <RequestStat label="Pending" value={stats.requests.pending} dot="amber" />
            <RequestStat label="Approved" value={stats.requests.alloted} dot="emerald" />
            <RequestStat label="Return req." value={stats.requests.return_requested} dot="blue" />
            <RequestStat label="Returned" value={stats.requests.returned} dot="slate" />
            <RequestStat label="Rejected" value={stats.requests.rejected} dot="red" />
            <RequestStat label="Total" value={stats.requests.total} dot="indigo" bold />
          </div>
        </div>
      </div>

      {/* ── Action required tables ─────────────────────────── */}
      <AdminRequestTable
        requests={requests.filter((r) => getIssueStatus(r) === "pending")}
        onStatus={updateRequestStatus}
        activeTab="pending"
        title={`Pending approval (${requests.filter((r) => getIssueStatus(r) === "pending").length})`}
      />
      <AdminRequestTable
        requests={requests.filter((r) => getIssueStatus(r) === "return_requested")}
        onStatus={updateRequestStatus}
        activeTab="return_requested"
        title={`Return requests (${requests.filter((r) => getIssueStatus(r) === "return_requested").length})`}
      />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

const ACCENT_CLASSES: Record<string, { bg: string; icon: string; gradient: string }> = {
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", gradient: "from-indigo-500  to-indigo-600" },
  violet: { bg: "bg-violet-50", icon: "text-violet-600", gradient: "from-violet-500  to-violet-600" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", gradient: "from-emerald-500 to-emerald-600" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", gradient: "from-amber-400   to-amber-500" },
};

function KpiCard({
  label, value, sub, icon: Icon, accent,
}: {
  label: string; value: number; sub: string;
  icon: React.ElementType; accent: string;
}) {
  const { bg, icon } = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.indigo;
  return (
    <div className="group rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md hover:ring-indigo-500/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{sub}</p>
        </div>
        <span className={`flex size-10 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`size-5 ${icon}`} />
        </span>
      </div>
    </div>
  );
}

function InventoryRow({ label, value, color }: { label: string; value: number; color?: string }) {
  const cls =
    color === "emerald" ? "text-emerald-600" :
      color === "amber" ? "text-amber-600" :
        color === "blue" ? "text-blue-600" :
          "text-slate-800";
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50/60 px-3 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-bold ${cls}`}>{value}</span>
    </div>
  );
}

const DOT_CLASSES: Record<string, string> = {
  amber: "bg-amber-400",
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  slate: "bg-slate-400",
  red: "bg-red-500",
  indigo: "bg-indigo-500",
};

function RequestStat({ label, value, dot, bold }: { label: string; value: number; dot: string; bold?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
      <span className={`size-2.5 shrink-0 rounded-full ${DOT_CLASSES[dot] ?? "bg-slate-400"}`} />
      <div className="min-w-0">
        <p className="truncate text-xs text-slate-500">{label}</p>
        <p className={`text-xl font-bold ${bold ? "text-indigo-600" : "text-slate-800"}`}>{value}</p>
      </div>
    </div>
  );
}
