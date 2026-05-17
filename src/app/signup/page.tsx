"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Library, Loader2, Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/lib/api/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router              = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm]       = useState({ name: "", email: "", password: "" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await authService.signup(form);
      toast.success("Account created — please sign in");
      router.push("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Unable to create account");
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
              Member Portal
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white">
              Start your library journey
            </h1>
            <p className="text-base leading-relaxed text-slate-400">
              Create a free account to browse books, submit requests, and track your borrowing history.
            </p>
          </div>

          <div className="relative z-10 space-y-4 pt-4">
            {[
              "Browse the full book catalogue",
              "Request and return books online",
              "Track your complete borrowing history",
            ].map((item) => (
              <div key={item} className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/10">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-600/20">
                  <svg className="size-3 text-indigo-400" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{item}</span>
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Create account</h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-700">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="name"
                  placeholder="Jane Smith"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-11 border-slate-300 bg-white pl-10 text-sm shadow-sm focus-visible:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-11 border-slate-300 bg-white pl-10 text-sm shadow-sm focus-visible:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="h-11 border-slate-300 bg-white pl-10 pr-11 text-sm shadow-sm focus-visible:ring-indigo-500"
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
              className="mt-1 h-11 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30"
              disabled={loading}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            By signing up you agree to our{" "}
            <span className="cursor-pointer underline underline-offset-2 hover:text-slate-600">Terms</span>
            {" "}and{" "}
            <span className="cursor-pointer underline underline-offset-2 hover:text-slate-600">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
