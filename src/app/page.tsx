"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Loader2, Eye, EyeOff, Library, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/lib/api/services/auth.service";
import { saveSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router              = useRouter();
  const searchParams        = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm]       = useState({ email: "", password: "" });
  const sessionExpired        = searchParams.get("session_expired") === "1";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const session = await authService.login(form);
      saveSession(session);
      router.push(session.role === "admin" ? "/admin/dashboard" : "/user/books");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-[480px] shrink-0 flex-col justify-between bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-12 lg:flex relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -left-[20%] -top-[10%] size-[80%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] size-[60%] rounded-full bg-violet-600/10 blur-[100px]" />
        
        <div className="relative z-10 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30">
            <Library className="size-5 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">Library Console</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Enterprise Library Management
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white">
              The control plane for your library
            </h1>
            <p className="text-base leading-relaxed text-slate-400">
              Manage inventory, members, and borrow requests from a single unified workspace.
            </p>
          </div>

          <div className="relative z-10 space-y-4 pt-4">
            {[
              { title: "Real-time inventory", desc: "Track every copy, availability, and issue status." },
              { title: "Role-based access",   desc: "Separate admin and member workspaces." },
              { title: "Request workflows",   desc: "Approve, reject, and track returns end-to-end." },
            ].map((f) => (
              <div key={f.title} className="group flex items-start gap-4 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/10">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-600/20">
                  <svg className="size-3 text-indigo-400" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs font-medium text-slate-500">© {new Date().getFullYear()} Library Console. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50/50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/40 via-slate-50/20 to-slate-50 px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-2.5 lg:hidden">
          <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600">
            <Library className="size-5 text-white" />
          </span>
          <span className="text-base font-semibold text-slate-900">Library Console</span>
        </div>

        <div className="w-full max-w-[380px]">

          {/* ── Session-expired banner ── */}
          {sessionExpired && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 shadow-sm">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Session expired</p>
                <p className="mt-0.5 text-xs text-amber-700">Your session timed out. Please sign in again to continue.</p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to your workspace.{" "}
              <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">
                Create account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-11 border-slate-300 bg-white text-sm shadow-sm focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="h-11 border-slate-300 bg-white pr-11 text-sm shadow-sm focus-visible:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30"
              disabled={loading}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            By signing in you agree to our{" "}
            <span className="cursor-pointer underline underline-offset-2 hover:text-slate-600">Terms</span>
            {" "}and{" "}
            <span className="cursor-pointer underline underline-offset-2 hover:text-slate-600">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
