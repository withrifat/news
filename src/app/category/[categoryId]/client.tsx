"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Filter } from "lucide-react";
import { NewsCard } from "@/components/news-card";
import { CategoryNav } from "@/components/category-nav";
import { SkeletonGrid } from "@/components/skeletons";
import { EmptyState } from "@/components/empty-state";
import { getCategories, getCategoryNews } from "@/lib/api";
import { getCategoryName } from "@/lib/utils";
import type { Article, Category } from "@/types/news";

export default function CategoryPageClient({
  categoryId,
}: {
  categoryId: string;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setArticles([]);
    setHasMore(false);
    setLoading(true);

    Promise.all([
      getCategoryNews(categoryId).catch(() => ({
        articles: [],
        success: false,
        count: 0,
      })),
      getCategories().catch(() => ({
        categories: [],
        success: false,
        count: 0,
        scrapedAt: "",
      })),
    ]).then(([catNews, cats]) => {
      const items = catNews.articles || [];
      setArticles(items);
      setCategories(cats.categories || []);
      setHasMore(items.length >= 12);
      setLoading(false);
    });
  }, [categoryId]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    getCategoryNews(categoryId)
      .then((data) => {
        const newArticles = data.articles || [];
        if (newArticles.length === 0) {
          setHasMore(false);
          return;
        }
        setArticles((prev) => {
          const seen = new Set(prev.map((a) => a.id));
          const additions = newArticles.filter((a) => !seen.has(a.id));
          if (additions.length === 0) {
            setHasMore(false);
            return prev;
          }
          return [...prev, ...additions];
        });
      })
      .catch(() => setHasMore(false));
  }, [categoryId, hasMore, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, loading]);

  const categoryName = getCategoryName(categoryId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-crimson-500 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          মূলপাতা
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{categoryName}</h1>
            {!loading && (
              <p className="text-surface-500 mt-1 text-sm">
                {articles.length}টি সংবাদ পাওয়া গেছে
              </p>
            )}
          </div>
          <div className="h-10 w-10 rounded-xl bg-crimson-500/10 flex items-center justify-center">
            <Filter className="h-5 w-5 text-crimson-500" />
          </div>
        </div>
      </motion.div>

      {categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <CategoryNav categories={categories} activeCategory={categoryId} />
        </motion.div>
      )}

      {loading ? (
        <SkeletonGrid count={6} />
      ) : articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <NewsCard
                key={`${article.id}-${i}`}
                article={article}
                index={i % 9}
              />
            ))}
          </div>

          <div ref={loaderRef} className="py-12 flex justify-center">
            {hasMore && (
              <div className="flex items-center gap-3 text-surface-500">
                <div className="h-5 w-5 border-2 border-crimson-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">আরও সংবাদ লোড হচ্ছে...</span>
              </div>
            )}
            {!hasMore && articles.length > 0 && (
              <p className="text-sm text-surface-400">
                সব সংবাদ দেখানো হয়েছে
              </p>
            )}
          </div>
        </>
      ) : (
        <EmptyState
          type="no-data"
          message={`"${categoryName}" বিভাগে কোনো সংবাদ নেই`}
        />
      )}
    </div>
  );
}
