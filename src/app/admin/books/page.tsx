"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, BookOpen, X, Check, Plus, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { adminService } from "@/lib/api/services/admin.service";
import { LoadingPanel } from "@/components/loading-panel";
import { CustomPagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const emptyEdit = { title: "", author: "", category: "", quantity: 1, available: 1 };

export default function AdminBooksPage() {
  const [loading, setLoading]   = useState(true);
  const [books, setBooks]       = useState<any[]>([]);
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [limit]                 = useState(10);
  const [total, setTotal]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editBook, setEditBook] = useState<any | null>(null);
  const [editForm, setEditForm] = useState(emptyEdit);
  const [saving, setSaving]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => { loadData(); }, [page, search]);

  async function loadData() {
    try {
      const response = await adminService.getBooks({ page, limit, search });
      setBooks(response.items || []);
      setTotal(response.total || 0);
      setTotalPages(response.total_pages || 1);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to load books");
    } finally {
      setLoading(false);
    }
  }

  function openEdit(book: any) {
    setEditBook(book);
    setEditForm({
      title:     book.title     || "",
      author:    book.author    || "",
      category:  book.category  || "",
      quantity:  book.quantity  ?? 1,
      available: book.available ?? 0,
    });
  }

  async function saveEdit() {
    if (!editBook) return;
    setSaving(true);
    try {
      await adminService.updateBook(editBook._id, {
        ...editForm,
        quantity:  Number(editForm.quantity),
        available: Number(editForm.available),
      });
      toast.success("Book updated");
      setEditBook(null);
      loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  async function deleteBook(bookId: string) {
    setDeleting(true);
    try {
      await adminService.deleteBook(bookId);
      toast.success("Book deleted");
      setDeleteTarget(null);
      loadData();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to delete book");
    } finally {
      setDeleting(false);
    }
  }


  if (loading) return <LoadingPanel />;

  return (
    <>
      {/* Stats row */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total titles"  value={total} />
        <StatCard label="Total copies"  value={books.reduce((s, b) => s + (b.quantity  || 0), 0)} />
        <StatCard label="Available"     value={books.reduce((s, b) => s + (b.available || 0), 0)} color="green" />
        <StatCard label="Issued"        value={books.reduce((s, b) => s + ((b.quantity || 0) - (b.available || 0)), 0)} color="amber" />
      </div>

      {/* Books table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">

        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-800">All books</span>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-100">{total}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search books…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-8 w-48 pl-8 text-xs sm:w-56"
              />
            </div>
            <Button
              asChild
              size="sm"
              className="h-8 gap-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-md"
            >
              <Link href="/admin/books/add">
                <Plus className="size-3.5" />
                Add Book
              </Link>
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Title</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Author</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Category</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total copies</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-400">Available</TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-14 text-center text-sm text-slate-400">
                  {search
                    ? `No books match "${search}"`
                    : <>No books in inventory. Click <strong>Add Book</strong> to get started.</>}
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => {
                const pct = book.quantity > 0
                  ? Math.round((book.available / book.quantity) * 100)
                  : 0;
                return (
                  <TableRow key={book._id} className="group transition-colors hover:bg-slate-50/80">
                    <TableCell>
                      <span className="font-medium text-slate-900">{book.title}</span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{book.author}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full text-xs font-medium">{book.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{book.quantity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className={`min-w-[1.5rem] text-sm font-semibold ${book.available > 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {book.available}
                        </span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all ${pct > 50 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : pct > 20 ? "bg-gradient-to-r from-amber-300 to-amber-400" : "bg-gradient-to-r from-red-400 to-red-500"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 rounded-lg p-0 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                          onClick={() => openEdit(book)}
                          aria-label="Edit"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 rounded-lg p-0 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleteTarget(book)}
                          aria-label="Delete"
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

      {/* Edit Dialog */}
      <Dialog open={!!editBook} onOpenChange={(open) => !open && setEditBook(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Edit book</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Update the details for <strong>{editBook?.title}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {(["title", "author", "category"] as const).map((key) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-xs font-semibold capitalize text-slate-600">{key}</Label>
                <Input
                  value={editForm[key]}
                  onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                  className="h-9 border-slate-200 text-sm"
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              {(["quantity", "available"] as const).map((key) => (
                <div key={key} className="space-y-1.5">
                  <Label className="text-xs font-semibold capitalize text-slate-600">
                    {key === "quantity" ? "Total copies" : "Available"}
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={editForm[key]}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="h-9 border-slate-200 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-md"
              onClick={saveEdit}
              disabled={saving}
            >
              <Check className="mr-1.5 size-3.5" />
              {saving ? "Saving…" : "Save changes"}
            </Button>
            <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setEditBook(null)}>
              <X className="mr-1.5 size-3.5" />
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete book confirmation ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">Delete book?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500">
              This will permanently remove{" "}
              <strong className="text-slate-700">{deleteTarget?.title}</strong> from the inventory.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-lg text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-lg bg-red-600 text-sm text-white shadow-sm hover:bg-red-700"
              onClick={() => deleteTarget && deleteBook(deleteTarget._id)}
              disabled={deleting}
            >
              {deleting ? <><Loader2 className="mr-1.5 size-3.5 animate-spin" />Deleting…</> : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: "green" | "amber" }) {
  const valueClass =
    color === "green" ? "text-emerald-600" :
    color === "amber" ? "text-amber-600"   :
    "text-slate-900";
  return (
    <div className="rounded-xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md hover:ring-indigo-500/20">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}
