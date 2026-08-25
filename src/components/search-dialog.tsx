"use client";

import { Search, X, Loader2, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/news";
import { cn, timeAgo, getCategoryName } from "@/lib/utils";
import { searchNews } from "@/lib/api";

interface SearchDialogProps {
  articles?: Article[];
}

export function SearchDialog({ articles = [] }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Local instant match for quick suggestions
  const localMatches = useMemo(
    () =>
      query.trim()
        ? articles.filter((a) =>
            a.title.toLowerCase().includes(query.toLowerCase())
          )
        : [],
    [query, articles]
  );

  const localMatchesRef = useRef(localMatches);
  localMatchesRef.current = localMatches;

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Debounced online live search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      searchNews(trimmed)
        .then((res) => {
          if (res && Array.isArray(res.articles)) {
            // Merge with local matches avoiding duplicates by title or id
            const seen = new Set<string>();
            const combined: Article[] = [];

            for (const item of [...res.articles, ...localMatchesRef.current]) {
              if (!seen.has(item.title)) {
                seen.add(item.title);
                combined.push(item);
              }
            }

            setResults(combined);
          } else {
            setResults(localMatchesRef.current);
          }
        })
        .catch(() => {
          setResults(localMatchesRef.current);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const displayedArticles = query.trim()
    ? results.length > 0
      ? results
      : localMatches
    : [];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "h-9 px-3 rounded-full flex items-center gap-2",
          "bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700",
          "transition-all duration-200 border border-surface-200 dark:border-surface-700 text-surface-500 hover:text-surface-900 dark:hover:text-white"
        )}
        aria-label="সংবাদ খুঁজুন"
      >
        <Search className="h-4 w-4" />
        <span className="text-xs hidden sm:inline font-bengali">খুঁজুন...</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface-200/60 dark:bg-surface-700 text-[10px] font-mono">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[12%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
            >
              <div className="rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
                {/* Search Input Bar */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-200 dark:border-surface-800">
                  <Search className="h-5 w-5 text-crimson-500 shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="অনলাইন সংবাদ খুঁজুন (উদা: খেলাধুলা, বাংলাদেশ, প্রযুক্তি)..."
                    className="flex-1 bg-transparent outline-none text-base font-bengali placeholder:text-surface-400 dark:text-white"
                  />
                  {isSearching && (
                    <Loader2 className="h-4 w-4 animate-spin text-crimson-500 shrink-0" />
                  )}
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Results List */}
                <div className="overflow-y-auto flex-1 p-2 divide-y divide-surface-100 dark:divide-surface-800/50">
                  {query.trim() && !isSearching && displayedArticles.length === 0 && (
                    <div className="p-8 text-center text-surface-500 font-bengali">
                      &ldquo;{query}&rdquo; সম্পর্কিত কোনো সংবাদ পাওয়া যায়নি
                    </div>
                  )}

                  {displayedArticles.map((article, idx) => {
                    const isExternal = article.id.startsWith("rss-");
                    const href = isExternal && article.link ? article.link : `/news/${article.id}`;

                    return (
                      <Link
                        key={`${article.id}-${idx}`}
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        onClick={() => {
                          setOpen(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-50 dark:hover:bg-surface-800/80 transition-colors group"
                      >
                        {article.imageUrl && (
                          <div className="relative h-12 w-16 shrink-0 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-800">
                            <Image
                              src={article.imageUrl}
                              alt={article.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-1 group-hover:text-crimson-500 transition-colors">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-surface-400">
                            {article.category && (
                              <span className="text-crimson-500 font-medium">
                                {getCategoryName(article.category)}
                              </span>
                            )}
                            {article.source && (
                              <span>• {article.source}</span>
                            )}
                            <span>• {timeAgo(article.scrapedAt || article.publishedAt || "")}</span>
                          </div>
                        </div>
                        {isExternal ? (
                          <ExternalLink className="h-4 w-4 text-surface-400 group-hover:text-crimson-500 shrink-0" />
                        ) : (
                          <span className="text-xs font-mono text-crimson-500 font-bold shrink-0">
                            #{article.rank}
                          </span>
                        )}
                      </Link>
                    );
                  })}

                  {!query.trim() && (
                    <div className="p-8 text-center text-surface-500 text-sm font-bengali">
                      <p className="mb-2 font-medium">যেকোনো সংবাদ বা বিষয় লিখে খুঁজুন</p>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {["বাংলাদেশ", "খেলাধুলা", "প্রযুক্তি", "বিশ্ব", "অর্থনীতি"].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setQuery(tag)}
                            className="px-3 py-1 text-xs rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-crimson-500/10 hover:text-crimson-500 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
