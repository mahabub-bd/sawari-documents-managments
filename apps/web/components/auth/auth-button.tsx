import { getSession } from "@/lib/session";
import {
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogInIcon,
} from "lucide-react"; // Import Lucide icons
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SignOutButton } from "./signout-button";

const AuthBtn = async () => {
  const session = await getSession();

  return (
    <div className="flex items-center gap-4 ml-auto">
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <div className="flex items-center gap-2">
              <CircleUserRound className="size-5 text-muted-foreground" />
              <span className="max-w-[12rem] truncate">
                {session?.user?.name}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 rounded-lg border-border/60 p-2 shadow-md"
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

            <DropdownMenuItem asChild className="flex items-center gap-2 py-1">
              <SignOutButton>Sign Out</SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          href="/auth/signin"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <LogInIcon className="size-4" />
          Sign In
        </Link>
      )}
    </div>
  );
};

export default AuthBtn;
