"use client";

import type React from "react";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useMediaQuery } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Compact, brand-consistent pager with ellipsis logic.
 * Renders nothing when there is only one page.
 */
export function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationComponentProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Clamp invalid inputs so the component is safe with any data.
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, currentPage), safeTotalPages);

  const visiblePages = useMemo(() => {
    const siblingsCount = isMobile ? 1 : 2;

    const pages = new Set<number>();

    for (
      let i = Math.max(1, safePage - siblingsCount);
      i <= Math.min(safeTotalPages, safePage + siblingsCount);
      i++
    ) {
      pages.add(i);
    }

    pages.add(1);
    pages.add(safeTotalPages);

    return Array.from(pages).sort((a, b) => a - b);
  }, [safePage, safeTotalPages, isMobile]);

  if (safeTotalPages <= 1) return null;

  const handleClick = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    onPageChange(page);
  };

  const arrowClass =
    "h-8 gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground";

  return (
    <Pagination className="justify-end">
      <PaginationContent className="flex-wrap items-center gap-1">
        {/* Previous */}
        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label="Previous page"
            aria-disabled={safePage <= 1}
            tabIndex={safePage <= 1 ? -1 : undefined}
            className={cn(
              arrowClass,
              safePage <= 1 && "pointer-events-none opacity-40"
            )}
            onClick={(e) => safePage > 1 && handleClick(safePage - 1, e)}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Prev</span>
          </PaginationLink>
        </PaginationItem>

        {/* Page numbers with ellipsis */}
        {visiblePages.map((page, index) => {
          const previousPage = visiblePages[index - 1];
          const needsEllipsisBefore = previousPage && page - previousPage > 1;

          return (
            <div key={page} className="flex items-center">
              {needsEllipsisBefore && (
                <PaginationItem>
                  <PaginationEllipsis className="text-muted-foreground" />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={page === safePage}
                  onClick={(e) => handleClick(page, e)}
                  className={cn(
                    "h-8 min-w-8 rounded-lg px-2 text-xs font-medium",
                    page === safePage
                      ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </div>
          );
        })}

        {/* Next */}
        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label="Next page"
            aria-disabled={safePage >= safeTotalPages}
            tabIndex={safePage >= safeTotalPages ? -1 : undefined}
            className={cn(
              arrowClass,
              safePage >= safeTotalPages && "pointer-events-none opacity-40"
            )}
            onClick={(e) =>
              safePage < safeTotalPages && handleClick(safePage + 1, e)
            }
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
