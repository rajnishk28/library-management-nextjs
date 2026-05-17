"use client";

import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { getIssueStatus, StatusBadge } from "@/components/status-badge";

interface Props {
  requests: any[];
  onStatus: (issueId: string, status: string) => void;
  title?: string;
  activeTab?: string;
}

const ACTION_TABS = ["pending", "return_requested"];

export function AdminRequestTable({
  requests,
  onStatus,
  title = "Requests",
  activeTab = "all",
}: Props) {
  const showActions = ACTION_TABS.includes(activeTab);

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">
          {requests.length}
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">User</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Book</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Issue date</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Due date</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</TableHead>
            {showActions && (
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showActions ? 6 : 5}
                className="py-14 text-center text-sm text-slate-400"
              >
                No requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req: any) => {
              const status = getIssueStatus(req);
              return (
                <TableRow key={req._id} className="transition-colors hover:bg-slate-50/60">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
                        {(req.user?.name || "?")[0].toUpperCase()}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {req.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {req.user?.email || req.user_id}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className="text-sm font-medium text-slate-900">
                      {req.book?.title || "Unknown book"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {req.book?.author || req.book_id}
                    </p>
                  </TableCell>

                  <TableCell className="text-sm text-slate-500">{req.issue_date}</TableCell>
                  <TableCell className="text-sm text-slate-500">{req.due_date}</TableCell>

                  <TableCell>
                    <StatusBadge status={status} />
                  </TableCell>

                  {showActions && (
                    <TableCell className="text-right">
                      {activeTab === "pending" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            className="h-8 gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-md"
                            onClick={() => onStatus(req._id, "alloted")}
                          >
                            <CheckCircle2 className="size-3.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-1.5 rounded-lg px-3 text-xs font-semibold text-red-600 transition-all hover:bg-red-50 hover:text-red-700"
                            onClick={() => onStatus(req._id, "rejected")}
                          >
                            <XCircle className="size-3.5" />
                            Reject
                          </Button>
                        </div>
                      )}
                      {activeTab === "return_requested" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            className="h-8 gap-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-md"
                            onClick={() => onStatus(req._id, "returned")}
                          >
                            <RotateCcw className="size-3.5" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-1.5 rounded-lg px-3 text-xs font-semibold text-red-600 transition-all hover:bg-red-50 hover:text-red-700"
                            onClick={() => onStatus(req._id, "alloted")}
                          >
                            <XCircle className="size-3.5" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
