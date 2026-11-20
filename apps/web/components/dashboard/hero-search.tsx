"use client";

import { Bike, Loader2, Search, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import BrandLogo from "@/components/dashboard/brand-logo";

interface HeroSearchProps {
  documents?: never;
}

/**
 * Server-side document search: queries the API with a debounce,
 * so it works across the entire collection.
 */
export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState<BikeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  interface BikeResult {
    _id: string;
    bikeBrand: string;
    bikeModel: string;
    registrationNumber: string;
    engineNumber: string;
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    setIsSearching(true);

    const search = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bike-information?search=${encodeURIComponent(debounced)}&limit=6`,
          { signal: controller.signal, cache: "no-store" }
        );
        if (!response.ok) throw new Error(String(response.status));
        const payload = await response.json();
        setResults(Array.isArray(payload.data) ? payload.data : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    search();
    return () => controller.abort();
  }, [debounced]);

  const openDocument = (id: string) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/dashboard/documents/${id}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/70"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder="Search reg / engine / chassis no…"
          aria-label="Search bike documents"
          className="h-8 w-full rounded-full border border-white/25 bg-white/15 pl-8 pr-3 text-xs text-white placeholder:text-white/60 focus:border-white/40 focus:bg-white/20 focus:outline-none"
        />
      </div>

      {isOpen && debounced.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          {results.length === 0 ? (
            <p className="flex items-center gap-2 px-3 py-2.5 text-xs text-muted-foreground">
              {isSearching ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Searching…
                </>
              ) : (
                <>
                  <SearchX className="h-3.5 w-3.5" aria-hidden="true" />
                  No documents match “{debounced}”
                </>
              )}
            </p>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {results.map((doc) => (
                <li key={doc._id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-muted"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      openDocument(doc._id);
                    }}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <BrandLogo brand={doc.bikeBrand} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium capitalize">
                        {doc.bikeBrand} {doc.bikeModel}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {doc.registrationNumber || "Not registered"} ·{" "}
                        {doc.engineNumber}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default HeroSearch;
