"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { SearchDialog } from "@/components/search-dialog";
import { CategoryNav } from "@/components/category-nav";
import { getCategories, getPopularNews } from "@/lib/api";

import type { Category, Article } from "@/types/news";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  const pathname = usePathname();

  // --------------------------------------------------
  // Fetch navbar data
  // --------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const loadNavbarData = async () => {
      try {
        const [categoriesResponse, popularNewsResponse] =
          await Promise.all([
            getCategories(),
            getPopularNews(),
          ]);

        if (!mounted) return;

        setCategories(categoriesResponse?.categories ?? []);
        setArticles(popularNewsResponse?.articles ?? []);
      } catch (error) {
        console.error("Failed to load navbar data:", error);
      }
    };

    loadNavbarData();

    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------------------------
  // Close mobile menu
  // --------------------------------------------------
  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* ==================================================
          DESKTOP / MAIN NAVBAR
      ================================================== */}
      <div
        className="
          border-b border-surface-200/80
          bg-white/90
          shadow-sm
          backdrop-blur-xl
          transition-all duration-300
          dark:border-surface-800/80
          dark:bg-surface-950/90
        "
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="
              flex h-14 items-center justify-between gap-2
              sm:h-16 sm:gap-4
            "
          >
            {/* ==================================================
                LOGO
            ================================================== */}
            <Link
              href="/"
              aria-label="দেশ বার্তা - মূলপাতা"
              className="
                group flex shrink-0 items-center
                transition-transform
                active:scale-95
              "
            >
              <div
                className="
                  relative h-8 w-28 shrink-0
                  sm:h-9 sm:w-32
                  md:h-10 md:w-40
                  lg:h-11 lg:w-44
                "
              >
                <Image
                  src="/logo.png"
                  alt="দেশ বার্তা লোগো"
                  fill
                  priority
                  sizes="
                    (max-width: 640px) 112px,
                    (max-width: 768px) 128px,
                    (max-width: 1024px) 160px,
                    176px
                  "
                  className="
                    object-contain object-left
                    drop-shadow-sm
                    dark:brightness-110
                  "
                />
              </div>
            </Link>

            {/* ==================================================
                DESKTOP CATEGORY NAVIGATION
            ================================================== */}
            <div
              className="
                hidden min-w-0 flex-1
                justify-center
                lg:flex
              "
            >
              <CategoryNav
                categories={categories}
                className="justify-center"
              />
            </div>

            {/* ==================================================
                ACTIONS
            ================================================== */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
              {/* Search */}
              <SearchDialog articles={articles} />

              {/* Theme */}
              <ThemeToggle />

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label={
                  mobileOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"
                }
                aria-expanded={mobileOpen}
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full
                  bg-surface-100
                  transition-colors
                  hover:bg-surface-200
                  lg:hidden
                  dark:bg-surface-800
                  dark:hover:bg-surface-700
                "
              >
                <AnimatePresence
                  mode="wait"
                  initial={false}
                >
                  {mobileOpen ? (
                    <motion.span
                      key="close"
                      initial={{
                        rotate: -90,
                        opacity: 0,
                      }}
                      animate={{
                        rotate: 0,
                        opacity: 1,
                      }}
                      exit={{
                        rotate: 90,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.15,
                      }}
                    >
                      <X className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{
                        rotate: 90,
                        opacity: 0,
                      }}
                      animate={{
                        rotate: 0,
                        opacity: 1,
                      }}
                      exit={{
                        rotate: -90,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.15,
                      }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          MOBILE NAVIGATION
      ================================================== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              className="
                fixed inset-0 top-14
                z-40
                bg-black/20
                backdrop-blur-sm
                sm:top-16
                lg:hidden
              "
            />

            {/* Drawer */}
            <motion.div
              key="mobile-menu"
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.25,
                ease: "easeInOut",
              }}
              className="
                relative z-50
                overflow-hidden
                border-b border-surface-200
                bg-white/98
                shadow-xl
                backdrop-blur-xl
                lg:hidden
                dark:border-surface-800
                dark:bg-surface-950/98
              "
            >
              <div
                className="
                  max-h-[70vh]
                  overflow-y-auto
                  px-4 py-4
                "
              >
                <CategoryNav
                  categories={categories}
                  className="flex-wrap gap-2"
                  onNavigate={closeMobile}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}