import AuthBtn from "@/components/auth/auth-button";
import { getSession } from "@/lib/session";
import { Logo } from "@/public";
import Image from "next/image";
import Link from "next/link";
import MobileNavigation from "./mobile-nav";

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        aria-label="Main navigation"
        className="container mx-auto px-4 sm:px-6"
      >
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Image
                src={Logo}
                alt="Sawari"
                height={36}
                priority
                className="h-9 w-auto"
              />
            </Link>
            <span className="hidden h-6 w-px bg-border sm:block" />
            <span className="hidden text-sm font-medium text-muted-foreground sm:block">
              Document Management
            </span>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <AuthBtn />
          </div>
          <div className="flex items-center lg:hidden">
            <MobileNavigation session={session} />
          </div>
        </div>
      </nav>
    </header>
  );
}
