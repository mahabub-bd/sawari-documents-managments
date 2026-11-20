"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/public";

import { SignOutButton } from "@/components/auth/signout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  MenuIcon,
  UserPlusIcon,
} from "lucide-react";

import { adminSidebarMenu } from "@/constants";
import { cn } from "@/lib/utils";

export default function MobileNavigation({ session }: { session: any }) {
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const toggleSubMenu = (id: number) => {
    setOpenSubMenu(openSubMenu === id ? null : id);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  const handleSheetOpenChange = (isOpen: boolean) => {
    setIsSheetOpen(isOpen);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setIsSheetOpen(true)}
        >
          <MenuIcon className="h-6 w-6 text-primary shadow-xl" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle>
          <Image src={Logo} alt="logo" width={64} />
          <Link href="/signin" className="sr-only">
            Signin
          </Link>
        </SheetTitle>

        <div className="flex max-h-[calc(100dvh-6rem)] w-full flex-col items-start gap-2.5 overflow-y-auto p-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-2.5 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted">
                <div className="flex items-center gap-2">
                  <CircleUserRound className="size-5 text-muted-foreground" />
                  <span className="max-w-[10rem] truncate">
                    {session?.user?.name}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={8}
                className="pointer-events-auto z-[70] w-64 rounded-lg border border-border/60 bg-popover p-2 shadow-md"
              >
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Welcome, {session.user.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link
                    href={"/dashboard"}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  asChild
                  className="flex items-center gap-2 py-1"
                >
                  <SignOutButton>Sign Out</SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth/signin"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-md hover:bg-primary-dark transition focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={closeSheet}
            >
              <UserPlusIcon className="size-4 text-white" />
              Sign In
            </Link>
          )}

          {/* Dashboard navigation */}
          <nav
            aria-label="Dashboard navigation"
            className="mt-1 flex w-full flex-col gap-0.5 border-t border-border/60 pt-3"
          >
            {adminSidebarMenu
              .filter(
                ({ isAdminMenu }) =>
                  !isAdminMenu ||
                  ["admin", "moderator"].includes(
                    session?.user?.role?.toLowerCase()
                  )
              )
              .map(({ id, title, href, icon: Icon }) => (
              <Link
                key={id}
                href={href}
                onClick={closeSheet}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {title}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
