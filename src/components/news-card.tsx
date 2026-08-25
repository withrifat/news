"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Newspaper } from "lucide-react";
import { cn, timeAgo, getCategoryName } from "@/lib/utils";
import type { Article } from "@/types/news";

interface NewsCardProps {
  article: Article;
  index?: number;
  variant?: "default" | "horizontal" | "compact";
  showImage?: boolean;
}

export function NewsCard({
  article,
  index = 0,
  variant = "default",
  showImage = true,
}: NewsCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = article.imageUrl || article.images?.[0]?.url;
  const isExternalRss = article.id.startsWith("rss-");
  const href = isExternalRss && article.link ? article.link : `/news/${article.id}`;
  const isTargetBlank = isExternalRss;

  if (variant === "horizontal") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
      >
        <Link
          href={href}
          target={isTargetBlank ? "_blank" : undefined}
          rel={isTargetBlank ? "noopener noreferrer" : undefined}
          className={cn(
            "group flex gap-4 p-4 rounded-2xl",
            "hover:bg-surface-50 dark:hover:bg-surface-800/50",
            "transition-all duration-300 ease-out",
            "border border-transparent hover:border-surface-200 dark:hover:border-surface-700"
          )}
        >
          {imageUrl && !imgError && (
            <div className="relative h-20 w-28 shrink-0 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-800">
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                sizes="112px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm md:text-base leading-snug line-clamp-2 group-hover:text-crimson-500 transition-colors duration-200">
              {article.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 text-xs text-surface-500 dark:text-surface-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeAgo(article.scrapedAt || article.publishedAt || "")}
              </span>
              {article.category && (
                <>
                  <span className="h-1 w-1 rounded-full bg-surface-300 dark:bg-surface-600" />
                  <span className="text-crimson-600 dark:text-crimson-400 font-medium">
                    {getCategoryName(article.category)}
                  </span>
                </>
              )}
              {article.source && (
                <>
                  <span className="h-1 w-1 rounded-full bg-surface-300 dark:bg-surface-600" />
                  <span className="text-surface-400">{article.source}</span>
                </>
              )}
              <span className="font-mono text-crimson-500 font-bold ml-auto">
                #{article.rank}
              </span>
            </div>
          </div>
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ArrowRight className="h-4 w-4 text-crimson-500" />
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
      >
        <Link
          href={href}
          target={isTargetBlank ? "_blank" : undefined}
          rel={isTargetBlank ? "noopener noreferrer" : undefined}
          className="group block p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-all duration-200"
        >
          <h4 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-crimson-500 transition-colors">
            {article.title}
          </h4>
          <span className="text-xs text-surface-500 dark:text-surface-400 mt-1 block">
            {timeAgo(article.scrapedAt || article.publishedAt || "")}
          </span>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: "easeOut" }}
    >
      <Link
        href={href}
        target={isTargetBlank ? "_blank" : undefined}
        rel={isTargetBlank ? "noopener noreferrer" : undefined}
        className={cn(
          "group block rounded-2xl overflow-hidden h-full flex flex-col",
          "border border-surface-200 dark:border-surface-800",
          "hover:border-crimson-500/30 dark:hover:border-crimson-500/20",
          "hover:shadow-xl hover:shadow-crimson-500/5",
          "hover:-translate-y-1",
          "transition-all duration-300 ease-out",
          "bg-white dark:bg-surface-900"
        )}
      >
        {showImage && (
          <div className="relative aspect-video overflow-hidden bg-surface-100 dark:bg-surface-800">
            {imageUrl && !imgError ? (
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-crimson-500/10 via-surface-900/30 to-surface-900/60 flex items-center justify-center">
                <span className="text-6xl font-bold text-surface-300 dark:text-surface-700 font-bengali select-none">
                  সং
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold bg-crimson-500 text-white rounded-lg shadow-sm">
                #{article.rank}
              </span>
              {article.category && (
                <span className="px-2.5 py-1 text-xs font-medium bg-black/50 backdrop-blur-md text-white rounded-lg">
                  {getCategoryName(article.category)}
                </span>
              )}
            </div>
            {article.source && (
              <div className="absolute bottom-2.5 left-3 z-10 text-[11px] text-white/80 font-medium">
                {article.source}
              </div>
            )}
          </div>
        )}

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base md:text-lg leading-relaxed line-clamp-2 group-hover:text-crimson-500 transition-colors duration-200">
              {article.title}
            </h3>
            {article.description && (
              <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 mt-2 leading-relaxed">
                {article.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-surface-100 dark:border-surface-800/80 text-xs text-surface-500 dark:text-surface-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(article.scrapedAt || article.publishedAt || "")}
            </span>
            <span className="flex items-center gap-1 text-crimson-500 font-medium">
              {isExternalRss ? "মূল খবর" : "বিস্তারিত"}
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
