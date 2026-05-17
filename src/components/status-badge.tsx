import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; dot: string; className: string }> = {
  pending: { label: "Pending", dot: "bg-amber-400", className: "bg-amber-50  text-amber-700  ring-amber-200/80" },
  alloted: { label: "Approved", dot: "bg-indigo-500", className: "bg-indigo-50 text-indigo-700 ring-indigo-200/80" },
  return_requested: { label: "Return Requested", dot: "bg-blue-500", className: "bg-blue-50   text-blue-700   ring-blue-200/80" },
  returned: { label: "Returned", dot: "bg-emerald-500", className: "bg-emerald-50 text-emerald-700 ring-emerald-200/80" },
  rejected: { label: "Rejected", dot: "bg-red-500", className: "bg-red-50    text-red-600    ring-red-200/80" },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
      cfg?.className ?? "bg-slate-50 text-slate-600 ring-slate-200/80"
    )}>
      <span className={cn("size-1.5 rounded-full shrink-0", cfg?.dot ?? "bg-slate-400")} />
      {cfg?.label ?? status}
    </span>
  );
}

export function getIssueStatus(issue: any): string {
  if (issue.status) return issue.status;
  if (issue.returned) return "returned";
  return "alloted";
}
