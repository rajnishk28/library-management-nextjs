"use client";

import { useEffect, useState } from "react";
import {
  Trash2, UserCheck, UserX, Users, Search,
  BookOpen, X, Loader2, ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/api/services/admin.service";
import { LoadingPanel } from "@/components/loading-panel";
import { CustomPagination } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

// ── Status chip ─────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50   text-amber-700   ring-amber-200/80",
  alloted: "bg-emerald-50 text-emerald-700 ring-emerald-200/80",
  return_requested: "bg-blue-50    text-blue-700    ring-blue-200/80",
  returned: "bg-slate-100  text-slate-500   ring-slate-200",
  rejected: "bg-red-50     text-red-700     ring-red-200/80",
};
const STATUS_DOT: Record<string, string> = {
  pending: "bg-amber-400",
  alloted: "bg-emerald-500",
  return_requested: "bg-blue-500",
  returned: "bg-slate-400",
  rejected: "bg-red-500",
};

function IssueStatusChip({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLES[status] ?? "bg-slate-100 text-slate-500 ring-slate-200"}`}>
      <span className={`size-1.5 rounded-full ${STATUS_DOT[status] ?? "bg-slate-400"}`} />
      {status.replace("_", " ")}
    </span>
  );
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  // User issues drawer
  const [issueUser, setIssueUser] = useState<any | null>(null);
  const [userIssues, setUserIssues] = useState<any[]>([]);
  const [issuesLoading, setIssuesLoading] = useState(false);

  useEffect(() => { loadData(); }, [page, search]);

  async function loadData() {
    try {
      const response = await adminService.getUsers({ page, limit, search });
      setUsers(response.items || []);
      setTotal(response.total || 0);
      setTotalPages(response.total_pages || 1);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to load users");
    } finally {
      setLoading(false);
    }
  }

  async function updateUserStatus(userId: string, active: boolean) {
    try {
      await adminService.updateUserStatus(userId, active);
      toast.success(active ? "User activated" : "User deactivated");
      loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to update user");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminService.deleteUser(deleteTarget._id);
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to delete user");
    } finally {
      setDeleting(false);
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  async function openUserIssues(user: any) {
    setIssueUser(user);
    setUserIssues([]);
    setIssuesLoading(true);
    try {
      const data = await adminService.getUserIssues(user._id);
      setUserIssues(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to load history");
    } finally {
      setIssuesLoading(false);
    }
  }

  if (loading) return <LoadingPanel />;

  const activeCount = users.filter((u) => u.active !== false).length;
  const inactiveCount = users.filter((u) => u.active === false).length;

  return (
    <>
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: total, cls: "text-slate-900" },
            { label: "Active", value: activeCount, cls: "text-emerald-600" },
            { label: "Inactive", value: inactiveCount, cls: "text-slate-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md hover:ring-indigo-500/20">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{s.label}</p>
              <p className={`mt-1 text-2xl font-bold ${s.cls}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-800">All members</span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">{total}</span>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search name or email…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-8 w-full pl-8 text-xs sm:w-56"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-14 text-center text-sm text-slate-400">
                    {search ? `No users match "${search}"` : "No users found"}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const isActive = user.active !== false;
                  return (
                    <TableRow key={user._id} className="transition-colors hover:bg-slate-50/60">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
                            {(user.name || "?")[0].toUpperCase()}
                          </span>
                          <span className="font-medium text-slate-900">{user.name || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "admin" ? "default" : "secondary"}
                          className="rounded-full text-xs capitalize"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${isActive
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200/80"
                            : "bg-slate-100 text-slate-500 ring-slate-200"
                          }`}>
                          <span className={`size-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          {/* View issues */}
                          <Button
                            size="sm"
                            variant="ghost"
                            title="View issue history"
                            className="h-8 w-8 rounded-lg p-0 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                            onClick={() => openUserIssues(user)}
                          >
                            <ClipboardList className="size-3.5" />
                          </Button>

                          {/* Activate / Deactivate */}
                          {isActive ? (
                            <Button
                              size="sm" variant="ghost"
                              className="h-8 gap-1 rounded-lg px-2.5 text-xs font-semibold text-slate-500 transition-all hover:bg-amber-50 hover:text-amber-700"
                              onClick={() => updateUserStatus(user._id, false)}
                            >
                              <UserX className="size-3.5" />
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              size="sm" variant="ghost"
                              className="h-8 gap-1 rounded-lg px-2.5 text-xs font-semibold text-slate-500 transition-all hover:bg-emerald-50 hover:text-emerald-700"
                              onClick={() => updateUserStatus(user._id, true)}
                            >
                              <UserCheck className="size-3.5" />
                              Activate
                            </Button>
                          )}

                          {/* Delete — now opens confirm dialog */}
                          <Button
                            size="sm" variant="ghost"
                            className="h-8 w-8 rounded-lg p-0 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                            onClick={() => setDeleteTarget(user)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* ── Delete confirmation ──────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">Delete user?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500">
              This will permanently remove{" "}
              <strong className="text-slate-700">{deleteTarget?.name}</strong> and all their data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-lg text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-lg bg-red-600 text-sm text-white shadow-sm hover:bg-red-700"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? <><Loader2 className="mr-1.5 size-3.5 animate-spin" />Deleting…</> : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── User issue history dialog ────────────────────────── */}
      <Dialog open={!!issueUser} onOpenChange={(open) => !open && setIssueUser(null)}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-hidden rounded-2xl flex flex-col">
          <DialogHeader className="shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-sm font-bold text-white">
                {(issueUser?.name || "?")[0].toUpperCase()}
              </span>
              <div>
                <DialogTitle className="text-base font-semibold leading-tight">{issueUser?.name}</DialogTitle>
                <DialogDescription className="text-xs text-slate-400">{issueUser?.email}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-3 flex-1 overflow-y-auto pr-1">
            {issuesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-indigo-500" />
              </div>
            ) : userIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-400">
                <BookOpen className="size-8 opacity-40" />
                <p className="text-sm">No issue history for this user.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {userIssues.map((issue) => (
                  <div
                    key={issue._id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {issue.book?.title ?? "Unknown book"}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {issue.book?.author ?? "—"}
                        {issue.book?.category ? ` · ${issue.book.category}` : ""}
                      </p>
                    </div>
                    <IssueStatusChip status={issue.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary footer */}
          {!issuesLoading && userIssues.length > 0 && (
            <div className="mt-3 shrink-0 border-t border-slate-100 pt-3 flex gap-4 text-xs text-slate-500">
              <span><strong className="text-slate-700">{userIssues.length}</strong> total</span>
              <span><strong className="text-emerald-600">{userIssues.filter(i => i.status === "alloted").length}</strong> active</span>
              <span><strong className="text-slate-500">{userIssues.filter(i => i.status === "returned").length}</strong> returned</span>
              <span><strong className="text-amber-600">{userIssues.filter(i => i.status === "pending").length}</strong> pending</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
