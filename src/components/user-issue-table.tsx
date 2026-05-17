"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { getIssueStatus, StatusBadge } from "@/components/status-badge";

interface Props {
  issues: any[];
  books?: any[];
  onReturn?: (issueId: string) => void;
  showAll?: boolean;
}

export function UserIssueTable({ issues, books = [], onReturn }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Book</TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Author</TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Issue date</TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Due date</TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</TableHead>
          {onReturn && (
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
              Action
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={onReturn ? 6 : 5}
              className="py-14 text-center text-sm text-slate-400"
            >
              No records found
            </TableCell>
          </TableRow>
        ) : (
          issues.map((issue: any) => {
            const book   = issue.book || books.find((b: any) => b._id === issue.book_id);
            const status = getIssueStatus(issue);
            return (
              <TableRow key={issue._id} className="transition-colors hover:bg-slate-50/60">
                <TableCell className="font-medium text-slate-900">
                  {book?.title || issue.book_id}
                </TableCell>
                <TableCell className="text-slate-500">{book?.author || "—"}</TableCell>
                <TableCell className="text-sm text-slate-500">{issue.issue_date}</TableCell>
                <TableCell className="text-sm text-slate-500">{issue.due_date}</TableCell>
                <TableCell>
                  <StatusBadge status={status} />
                </TableCell>
                {onReturn && (
                  <TableCell className="text-right">
                    {status === "alloted" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 rounded-lg border-slate-200 text-xs font-semibold text-slate-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                        onClick={() => onReturn(issue._id)}
                      >
                        <RotateCcw className="size-3.5" />
                        Request Return
                      </Button>
                    ) : status === "return_requested" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-100">
                        <span className="size-1.5 rounded-full bg-blue-400" />
                        Pending approval
                      </span>
                    ) : status === "returned" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 ring-1 ring-emerald-100">
                        <span className="size-1.5 rounded-full bg-emerald-400" />
                        Completed
                      </span>
                    ) : null}
                  </TableCell>
                )}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
