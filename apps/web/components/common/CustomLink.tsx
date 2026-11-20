"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface CustomLinkProps {
  path: string;
  children: React.ReactNode;
}

const CustomLink: React.FC<CustomLinkProps> = ({ path, children }) => {
  const pathname = usePathname();

  // The dashboard root should only be active on an exact match, otherwise
  // every nested dashboard route would highlight "Home" as well.
  const isActive =
    pathname === path ||
    (path !== "/dashboard" && pathname.startsWith(`${path}/`));

  return (
    <Link
      href={path}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
