"use client";

import { useEffect, useState } from "react";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/lib/api/services/user.service";
import { getSession } from "@/lib/auth";
import { LoadingPanel } from "@/components/loading-panel";
import { CustomPagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function UserBooksPage() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [requesting, setRequesting] = useState<string | null>(null);

  useEffect(() => { void loadData(); }, [page, search]);

  async function loadData() {
    try {
      const response = await userService.getBooks({ page, limit, search });
      setBooks(response.items || []);
      setTotal(response.total || 0);
      setTotalPages(response.total_pages || 1);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to load books");
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  async function requestBook(bookId: string) {
    const session = getSession();
    const userId = session?.user?.id;
    if (!userId) { toast.error("Session expired — please log in again"); return; }

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14);

    setRequesting(bookId);
    try {
      await userService.requestBook({
        user_id: userId,
        book_id: bookId,
        issue_date: toDateInput(today),
        due_date: toDateInput(dueDate),
      });
      toast.success("Request submitted — awaiting admin approval");
      loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to request book");
    } finally {
      setRequesting(null);
    }
  }

  if (loading) return <LoadingPanel />;

  const availableCount = books.filter((b) => b.available > 0).length;

  return (
    <div className="space-y-4">

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard label="Total titles" value={total} />
        <SummaryCard label="Available now" value={availableCount} color="emerald" />
        <SummaryCard label="Unavailable" value={books.length - availableCount} color="slate" className="hidden sm:block" />
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">

        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-800">Browse books</span>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">{total}</span>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search title, author, category…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-8 w-full pl-8 text-xs"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Title</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Author</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Category</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Copies</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Available</TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-14 text-center text-sm text-slate-400">
                  {search ? `No books match "${search}"` : "No books available"}
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => {
                const avail = Number(book.available);
                const copies = Number(book.quantity);
                const pct = copies > 0 ? Math.round((avail / copies) * 100) : 0;
                const isOut = avail <= 0;
                const isBusy = requesting === book._id;

                return (
                  <TableRow key={book._id} className="transition-colors hover:bg-slate-50/80">
                    <TableCell>
                      <span className="font-medium text-slate-900">{book.title}</span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{book.author}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full text-xs font-medium">{book.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{copies}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className={`min-w-[1.5rem] text-sm font-semibold ${isOut ? "text-red-500" : "text-emerald-600"}`}>
                          {avail}
                        </span>
                        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all ${pct > 50 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : pct > 20 ? "bg-gradient-to-r from-amber-300 to-amber-400" : "bg-gradient-to-r from-red-400 to-red-500"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className={`h-8 rounded-lg px-3 text-xs font-semibold transition-all ${isOut
                          ? "cursor-not-allowed bg-slate-100 text-slate-400 shadow-none"
                          : "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-md"
                          }`}
                        disabled={isOut || isBusy}
                        onClick={() => requestBook(book._id)}
                      >
                        {isBusy ? <><Loader2 className="mr-1.5 size-3 animate-spin" />Requesting…</> : isOut ? "Unavailable" : "Request"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <div className="border-t border-slate-100 px-5 py-4">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function SummaryCard({
  label, value, color, className = "",
}: {
  label: string; value: number; color?: "emerald" | "slate"; className?: string;
}) {
  const cls = color === "emerald" ? "text-emerald-600" : color === "slate" ? "text-slate-400" : "text-slate-900";
  return (
    <div className={`rounded-xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md hover:ring-indigo-500/20 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${cls}`}>{value}</p>
    </div>
  );
}
