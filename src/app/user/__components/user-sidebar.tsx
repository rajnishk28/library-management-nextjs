"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookMarked, BookOpen, History,
  Library, LogOut, UserRound,
  ChevronLeft, ChevronRight, Settings,
} from "lucide-react";
import { clearSession } from "@/lib/auth";
import {
  Sidebar, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/user/books",    label: "Browse Books", icon: BookOpen   },
  { href: "/user/alloted",  label: "My Books",     icon: BookMarked },
  { href: "/user/history",  label: "History",      icon: History    },
  { href: "/user/profile",  label: "Profile",      icon: UserRound  },
  { href: "/user/settings", label: "Settings",     icon: Settings   },
];

export function UserSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { toggleSidebar, open, isMobile, setOpenMobile } = useSidebar();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200/80 bg-white">

      {/* Brand + toggle */}
      <SidebarHeader className="px-3 py-3">
        <div className={cn("flex items-center", open ? "justify-between gap-2" : "justify-center")}>
          {open && (
            <Link
              href="/user/books"
              className="flex min-w-0 items-center gap-3 rounded-lg px-1 py-1 transition-colors hover:bg-slate-50"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-sm shadow-indigo-500/30">
                <Library className="size-4 text-white" />
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-sm font-bold text-slate-900">Library Console</span>
                <span className="text-[10px] font-medium text-slate-400">Member workspace</span>
              </span>
            </Link>
          )}

          {!open && (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-sm shadow-indigo-500/30">
              <Library className="size-4 text-white" />
            </span>
          )}

          <button
            onClick={toggleSidebar}
            className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {open ? <ChevronLeft className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </button>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="bg-slate-100/80" />

      {/* Nav */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup className="p-0">
          {open && (
            <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Navigation
            </p>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={label}
                      onClick={() => { if (isMobile) setOpenMobile(false); }}
                      className={cn(
                        "h-9 rounded-lg px-3 text-sm transition-all duration-150",
                        "data-[active=true]:bg-transparent",
                        active
                          ? "bg-indigo-600 font-semibold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 hover:text-white"
                          : "font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <Link href={href} className="flex w-full items-center gap-3">
                        <Icon className={cn("size-4 shrink-0", active ? "text-white" : "text-slate-400")} />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="bg-slate-100/80" />

      {/* Footer */}
      <SidebarFooter className="px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={() => { clearSession(); router.push("/"); }}
              className="h-9 rounded-lg px-3 text-sm font-medium text-slate-500 transition-all hover:bg-red-50 hover:text-red-600 data-[active=true]:bg-transparent"
            >
              <LogOut className="size-4 shrink-0" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
