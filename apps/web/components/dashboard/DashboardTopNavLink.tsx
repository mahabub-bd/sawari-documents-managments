"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { DashboardMenuTone } from "@/types";

const toneActive: Record<DashboardMenuTone, string> = {
  sky: "border-transparent bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-sm shadow-sky-500/25",
  emerald:
    "border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/25",
  violet:
    "border-transparent bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-sm shadow-violet-500/25",
  amber:
    "border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/25",
};

const toneHover: Record<DashboardMenuTone, string> = {
  sky: "hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 dark:hover:border-sky-500/30 dark:hover:bg-sky-500/10 dark:hover:text-sky-300",
  emerald:
    "hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300",
  violet:
    "hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:hover:border-violet-500/30 dark:hover:bg-violet-500/10 dark:hover:text-violet-300",
  amber:
    "hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 dark:hover:border-amber-500/30 dark:hover:bg-amber-500/10 dark:hover:text-amber-300",
};

export default function DashboardTopNavLink({
  href,
  tone,
  children,
}: {
  href: string;
  tone: DashboardMenuTone;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive =
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isActive
          ? toneActive[tone]
          : cn("border-transparent text-muted-foreground", toneHover[tone])
      )}
    >
      {children}
    </Link>
  );
}
