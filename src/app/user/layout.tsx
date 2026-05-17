"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserSidebar } from "./__components/user-sidebar";

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/user/books":    { title: "Browse Books", subtitle: "Search and request titles"  },
  "/user/alloted":  { title: "My Books",     subtitle: "Currently issued to you"    },
  "/user/history":  { title: "History",      subtitle: "All your past requests"     },
  "/user/profile":  { title: "Profile",      subtitle: "Your account details"       },
  "/user/settings": { title: "Settings",     subtitle: "Update your details"        },
};

export default function UserLayout({ children }: { children: ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== "user") router.push("/");
  }, [router]);

  const meta = PAGE_META[pathname] ?? { title: "Library", subtitle: "Member portal" };

  return (
    <TooltipProvider>
      <SidebarProvider
        defaultOpen
        style={{ "--sidebar-width": "220px", "--sidebar-width-icon": "64px" } as React.CSSProperties}
      >
        <div className="flex min-h-screen w-full bg-slate-50">
          <UserSidebar />
          <SidebarInset className="flex min-h-screen min-w-0 flex-col overflow-hidden">
            <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200/60 bg-white/80 px-6 backdrop-blur-md">
              <SidebarTrigger className="-ml-2 text-slate-400 hover:text-slate-700 md:hidden" />
              <div className="h-4 w-px bg-slate-200 md:hidden" />
              <div>
                <h1 className="text-sm font-bold tracking-tight text-slate-900">{meta.title}</h1>
                <p className="text-xs text-slate-400">{meta.subtitle}</p>
              </div>
            </header>
            <main className="flex-1 p-5 sm:p-6">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
