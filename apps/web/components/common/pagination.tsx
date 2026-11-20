"use client";

import type React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useMemo } from "react";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationComponentProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Guard against invalid inputs so the component is safe with any data.
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

  const handleClick = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    onPageChange(page);
  };

  return (
    <Pagination>
      <PaginationContent className="flex-wrap">
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={safePage <= 1}
            tabIndex={safePage <= 1 ? -1 : undefined}
            className={
              safePage <= 1 ? "pointer-events-none opacity-50" : undefined
            }
            onClick={(e) => safePage > 1 && handleClick(safePage - 1, e)}
          />
        </PaginationItem>

        {/* Page Numbers with Ellipsis */}
        {visiblePages.map((page, index) => {
          const previousPage = visiblePages[index - 1];
          const needsEllipsisBefore = previousPage && page - previousPage > 1;

          return (
            <div key={page} className="flex items-center">
              {needsEllipsisBefore && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={page === safePage}
                  onClick={(e) => handleClick(page, e)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </div>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={safePage >= safeTotalPages}
            tabIndex={safePage >= safeTotalPages ? -1 : undefined}
            className={
              safePage >= safeTotalPages
                ? "pointer-events-none opacity-50"
                : undefined
            }
            onClick={(e) =>
              safePage < safeTotalPages && handleClick(safePage + 1, e)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
