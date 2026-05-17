"use client";

import { useEffect, useState } from "react";
import {
  BookOpen, BookMarked, RotateCcw, CheckCircle2,
  XCircle, Clock, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/lib/api/services/user.service";
import { getSession } from "@/lib/auth";
import { LoadingPanel } from "@/components/loading-panel";

export default function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats]     = useState<any>(null);
  const session = getSession();

  useEffect(() => {
    async function load() {
      try {
        const [p, s] = await Promise.all([userService.getProfile(), userService.getStats()]);
        setProfile(p);
        setStats(s);
      } catch (error: any) {
        toast.error(error?.response?.data?.detail || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    }
    void Promise.resolve().then(load);
  }, []);

  if (loading) return <LoadingPanel />;

  const initials = (profile?.name || "U")[0].toUpperCase();

  return (
    <div className="space-y-6">

      {/* Profile card */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between">
            <div className="-mt-10 flex items-end gap-4">
              <span className="flex size-20 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-indigo-600 shadow-lg ring-4 ring-white">
                {initials}
              </span>
              <div className="mb-1">
                <h2 className="text-lg font-bold text-slate-900">{profile?.name || "Library user"}</h2>
                <p className="text-sm text-slate-500">{profile?.email}</p>
              </div>
            </div>
            <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200/80 capitalize">
              <ShieldCheck className="size-3.5" />
              {session?.role || "user"}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <InfoItem label="User ID"        value={session?.user?.id || "—"} mono />
            <InfoItem label="Account status" value="Active" highlight />
          </div>
        </div>
      </div>

      {/* Library stats */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Library overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total books"   value={stats?.library?.total_books ?? 0}     icon={BookOpen}     color="indigo"  />
          <StatCard label="Available now" value={stats?.library?.available_books ?? 0} icon={CheckCircle2} color="emerald" />
        </div>
      </div>

      {/* My activity */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">My activity</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Pending"          value={stats?.issues?.pending          ?? 0} icon={Clock}        color="amber"   />
          <StatCard label="Alloted"          value={stats?.issues?.alloted          ?? 0} icon={BookMarked}   color="indigo"  />
          <StatCard label="Return requested" value={stats?.issues?.return_requested ?? 0} icon={RotateCcw}    color="blue"    />
          <StatCard label="Returned"         value={stats?.issues?.returned         ?? 0} icon={CheckCircle2} color="emerald" />
          <StatCard label="Rejected"         value={stats?.issues?.rejected         ?? 0} icon={XCircle}      color="red"     />
          <StatCard label="Total requests"   value={stats?.issues?.total            ?? 0} icon={BookOpen}     color="slate"   bold />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className={`mt-1 truncate text-sm font-semibold ${
        highlight ? "text-emerald-600" : "text-slate-800"
      } ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </p>
    </div>
  );
}

const COLOR_MAP: Record<string, { bg: string; icon: string }> = {
  indigo:  { bg: "bg-indigo-50",  icon: "text-indigo-600"  },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600" },
  amber:   { bg: "bg-amber-50",   icon: "text-amber-600"   },
  blue:    { bg: "bg-blue-50",    icon: "text-blue-600"    },
  red:     { bg: "bg-red-50",     icon: "text-red-500"     },
  slate:   { bg: "bg-slate-100",  icon: "text-slate-500"   },
};

function StatCard({
  label, value, icon: Icon, color, bold,
}: {
  label: string; value: number; icon: React.ElementType; color: string; bold?: boolean;
}) {
  const { bg, icon } = COLOR_MAP[color] ?? COLOR_MAP.slate;
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md hover:ring-indigo-500/20">
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
        <Icon className={`size-4 ${icon}`} />
      </span>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className={`text-xl font-bold ${bold ? "text-indigo-600" : "text-slate-900"}`}>{value}</p>
      </div>
    </div>
  );
}
