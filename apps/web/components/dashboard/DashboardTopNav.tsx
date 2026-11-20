import { adminSidebarMenu } from "@/constants";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import type { AdminSidebarMenuItem, DashboardMenuTone } from "@/types";
import DashboardTopNavLink from "./DashboardTopNavLink";

const toneIcon: Record<DashboardMenuTone, string> = {
  sky: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  violet:
    "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  amber:
    "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
};

export default async function DashboardTopNav() {
  const session = await getSession();

  const filteredSidebarMenu = adminSidebarMenu.filter(
    (menuItem) =>
      session?.user?.role === "moderator" ||
      session?.user?.role === "admin" ||
      !menuItem.isAdminMenu
  );

  return (
    <div className="sticky top-16 z-30 overflow-hidden bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-amber-500/5"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-sky-500/50 via-violet-500/50 to-amber-500/50"
      />

      <div className="container relative mx-auto px-4 sm:px-6">
        <nav
          aria-label="Dashboard navigation"
          className="flex items-center gap-1.5 overflow-x-auto py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {filteredSidebarMenu.map(
            ({ id, title, href, icon: Icon, tone }: AdminSidebarMenuItem) => (
              <DashboardTopNavLink key={id} href={href} tone={tone}>
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
                    "group-aria-[current=page]:bg-white/25 group-aria-[current=page]:text-white",
                    toneIcon[tone]
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span>{title}</span>
              </DashboardTopNavLink>
            )
          )}
        </nav>
      </div>
    </div>
  );
}
