"use client";

import { useEffect, useState } from "react";
import { User, Lock, Save, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/lib/api/services/user.service";
import { getSession } from "@/lib/auth";
import { LoadingPanel } from "@/components/loading-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  const [loading, setLoading]         = useState(true);
  const [profile, setProfile]         = useState<any>(null);
  const session                       = getSession();

  // Profile form
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [currentPw, setCurrentPw]     = useState("");
  const [newPw, setNewPw]             = useState("");
  const [confirmPw, setConfirmPw]     = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPw, setSavingPw]       = useState(false);

  useEffect(() => {
    userService.getProfile()
      .then((p: any) => {
        setProfile(p);
        setName(p.name || "");
        setEmail(p.email || "");
      })
      .catch((err: any) => toast.error(err?.response?.data?.detail || "Unable to load profile"))
      .finally(() => setLoading(false));
  }, []);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { toast.error("Name and email are required"); return; }
    setSavingProfile(true);
    try {
      await userService.updateProfile({ name: name.trim(), email: email.trim() });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Unable to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPw || !newPw || !confirmPw) { toast.error("All password fields are required"); return; }
    if (newPw !== confirmPw) { toast.error("New passwords do not match"); return; }
    if (newPw.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    setSavingPw(true);
    try {
      await userService.changePassword({ current_password: currentPw, new_password: newPw });
      toast.success("Password changed successfully");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Unable to change password");
    } finally {
      setSavingPw(false);
    }
  }

  if (loading) return <LoadingPanel />;

  const initials = (profile?.name || "A")[0].toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* Profile hero */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="h-20 bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600" />
        <div className="flex items-end gap-4 px-6 pb-5">
          <span className="-mt-8 flex size-16 items-center justify-center rounded-2xl bg-white text-xl font-bold text-indigo-600 shadow-lg ring-4 ring-white">
            {initials}
          </span>
          <div className="mb-1">
            <p className="text-base font-bold text-slate-900">{profile?.name}</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200/80 capitalize">
              <ShieldCheck className="size-3" />
              {session?.role || profile?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Profile details form */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-6 py-4">
          <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50">
            <User className="size-4 text-indigo-600" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Profile details</p>
            <p className="text-xs text-slate-400">Update your name and email address</p>
          </div>
        </div>
        <form onSubmit={handleProfileSave} className="space-y-4 p-6">
          <div className="space-y-1.5">
            <Label htmlFor="admin-name" className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full name</Label>
            <Input id="admin-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="h-10 border-slate-200 text-sm focus-visible:ring-indigo-500" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-email" className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email address</Label>
            <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-10 border-slate-200 text-sm focus-visible:ring-indigo-500" />
          </div>
          <div className="flex justify-end pt-1">
            <Button type="submit" disabled={savingProfile} className="h-9 rounded-lg bg-indigo-600 px-5 text-xs font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-md">
              {savingProfile ? <><Loader2 className="mr-1.5 size-3.5 animate-spin" />Saving…</> : <><Save className="mr-1.5 size-3.5" />Save profile</>}
            </Button>
          </div>
        </form>
      </div>

      {/* Change password form */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-6 py-4">
          <span className="flex size-8 items-center justify-center rounded-lg bg-amber-50">
            <Lock className="size-4 text-amber-600" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Change password</p>
            <p className="text-xs text-slate-400">Use a strong password with at least 6 characters</p>
          </div>
        </div>
        <form onSubmit={handlePasswordSave} className="space-y-4 p-6">
          <div className="space-y-1.5">
            <Label htmlFor="a-current-pw" className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current password</Label>
            <div className="relative">
              <Input id="a-current-pw" type={showCurrent ? "text" : "password"} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="Enter current password" className="h-10 border-slate-200 pr-10 text-sm focus-visible:ring-indigo-500" />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <Separator className="bg-slate-100" />
          <div className="space-y-1.5">
            <Label htmlFor="a-new-pw" className="text-xs font-semibold uppercase tracking-wide text-slate-500">New password</Label>
            <div className="relative">
              <Input id="a-new-pw" type={showNew ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 6 characters" className="h-10 border-slate-200 pr-10 text-sm focus-visible:ring-indigo-500" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="a-confirm-pw" className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confirm new password</Label>
            <div className="relative">
              <Input id="a-confirm-pw" type={showConfirm ? "text" : "password"} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Repeat new password" className={`h-10 border-slate-200 pr-10 text-sm focus-visible:ring-indigo-500 ${confirmPw && confirmPw !== newPw ? "border-red-300 bg-red-50/30" : ""}`} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {confirmPw && confirmPw !== newPw && <p className="text-xs font-medium text-red-500">Passwords do not match</p>}
          </div>
          <div className="flex justify-end pt-1">
            <Button type="submit" disabled={savingPw} className="h-9 rounded-lg bg-amber-500 px-5 text-xs font-semibold text-white shadow-sm shadow-amber-500/20 transition-all hover:bg-amber-600 hover:shadow-md">
              {savingPw ? <><Loader2 className="mr-1.5 size-3.5 animate-spin" />Updating…</> : <><Lock className="mr-1.5 size-3.5" />Change password</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
