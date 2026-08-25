"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn, getCategoryName } from "@/lib/utils";
import type { Category } from "@/types/news";

interface CategoryNavProps {
  categories: Category[];
  activeCategory?: string;
  className?: string;
  onNavigate?: () => void;
}

export function CategoryNav({
  categories,
  activeCategory,
  className,
  onNavigate,
}: CategoryNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1",
        className
      )}
      aria-label="সংবাদ বিভাগ"
    >
      <Link
        href="/"
        onClick={onNavigate}
        className={cn(
          "relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap",
          "transition-all duration-200",
          !activeCategory
            ? "text-white"
            : "text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800"
        )}
      >
        {!activeCategory && (
          <motion.div
            layoutId="category-pill"
            className="absolute inset-0 bg-crimson-500 rounded-full"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">সব</span>
      </Link>

      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <Link
            key={cat.id}
            href={`/category/${cat.id}`}
            onClick={onNavigate}
            className={cn(
              "relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap",
              "transition-all duration-200",
              isActive
                ? "text-white"
                : "text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="category-pill"
                className="absolute inset-0 bg-crimson-500 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{cat.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
