"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 w-9 rounded-full bg-surface-200 dark:bg-surface-800 animate-pulse-soft",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative h-9 w-9 rounded-full flex items-center justify-center",
        "bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700",
        "transition-all duration-300 ease-out",
        "border border-surface-200 dark:border-surface-700",
        className
      )}
      aria-label={isDark ? "লাইট মোডে পরিবর্তন করুন" : "ডার্ক মোডে পরিবর্তন করুন"}
    >
      <Sun
        className={cn(
          "h-4 w-4 text-amber-500 absolute transition-all duration-300",
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "h-4 w-4 text-blue-400 absolute transition-all duration-300",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        )}
      />
    </button>
  );
}
