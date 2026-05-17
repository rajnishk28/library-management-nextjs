"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Loader2, Hash, User, Tag, Copy } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/api/services/admin.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BookForm = {
  title: string;
  author: string;
  category: string;
  quantity: number | string;
  available: number | string;
};

const initialState: BookForm = {
  title: "", author: "", category: "", quantity: 1, available: 1,
};

const FIELDS = [
  { key: "title"    as const, label: "Book Title",       placeholder: "The Pragmatic Programmer",  icon: BookOpen, type: "text"   },
  { key: "author"   as const, label: "Author",           placeholder: "Andrew Hunt",               icon: User,     type: "text"   },
  { key: "category" as const, label: "Category",         placeholder: "Software Engineering",      icon: Tag,      type: "text"   },
];

const NUM_FIELDS = [
  { key: "quantity"  as const, label: "Total Copies",     icon: Copy },
  { key: "available" as const, label: "Available Copies", icon: Hash },
];

export default function AddBookPage() {
  const router = useRouter();
  const [form, setForm]     = useState<BookForm>(initialState);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BookForm, string>>>({});

  function validate() {
    const next: typeof errors = {};
    if (!form.title.trim())    next.title    = "Title is required";
    if (!form.author.trim())   next.author   = "Author is required";
    if (!form.category.trim()) next.category = "Category is required";
    if (Number(form.quantity) < 1)                                       next.quantity  = "Quantity must be at least 1";
    if (Number(form.available) < 0)                                      next.available = "Available copies cannot be negative";
    if (Number(form.available) > Number(form.quantity))                  next.available = "Available copies cannot exceed quantity";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleChange(key: keyof BookForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await adminService.addBook({
        title:     form.title.trim(),
        author:    form.author.trim(),
        category:  form.category.trim(),
        quantity:  Number(form.quantity),
        available: Number(form.available),
      });
      toast.success("Book added successfully");
      router.push("/admin/books");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to add book");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* Header */}
      <div>
        <Link
          href="/admin/books"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="size-3.5" />
          Back to books
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100">
            <BookOpen className="size-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Add New Book</h1>
            <p className="text-sm text-slate-500">Add a new title to your library inventory.</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Text fields */}
          {FIELDS.map(({ key, label, placeholder, icon: Icon, type }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={key} className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
              </Label>
              <div className="relative">
                <Icon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-300" />
                <Input
                  id={key}
                  type={type}
                  placeholder={placeholder}
                  value={form[key] as string}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className={`h-11 pl-10 text-sm transition-all focus-visible:ring-indigo-500 ${errors[key] ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
                />
              </div>
              {errors[key] && (
                <p className="text-xs font-medium text-red-500">{errors[key]}</p>
              )}
            </div>
          ))}

          {/* Numeric fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            {NUM_FIELDS.map(({ key, label, icon: Icon }) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key} className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {label}
                </Label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-300" />
                  <Input
                    id={key}
                    type="number"
                    min={key === "available" ? 0 : 1}
                    value={form[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className={`h-11 pl-10 text-sm transition-all focus-visible:ring-indigo-500 ${errors[key] ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
                  />
                </div>
                {errors[key] && (
                  <p className="text-xs font-medium text-red-500">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg px-5 text-sm font-semibold"
              disabled={saving}
              onClick={() => router.push("/admin/books")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="h-10 min-w-[130px] rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Add Book"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}