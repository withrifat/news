"use client";

import { motion } from "framer-motion";
import { Search, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  type?: "no-results" | "error" | "no-data";
  message?: string;
}

export function EmptyState({ type = "no-data", message }: EmptyStateProps) {
  const icons = {
    "no-results": Search,
    error: AlertCircle,
    "no-data": AlertCircle,
  };

  const Icon = icons[type];

  const messages = {
    "no-results": "কোনো সংবাদ পাওয়া যায়নি",
    error: "সংবাদ লোড করতে সমস্যা হয়েছে",
    "no-data": "এই মুহূর্তে কোনো সংবাদ নেই",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="h-16 w-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-surface-400" />
      </div>
      <h3 className="text-lg font-semibold text-surface-600 dark:text-surface-400">
        {message || messages[type]}
      </h3>
      {type === "error" && (
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-full bg-crimson-500 text-white text-sm font-medium hover:bg-crimson-600 transition-colors"
        >
          আবার চেষ্টা করুন
        </button>
      )}
    </motion.div>
  );
}
