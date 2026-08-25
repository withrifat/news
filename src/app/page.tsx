"use client";

import { motion } from "framer-motion";
import { TrendingUp, Newspaper, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { NewsCard } from "@/components/news-card";
import { CategoryNav } from "@/components/category-nav";
import { SkeletonHero, SkeletonTrendingItem, SkeletonGrid } from "@/components/skeletons";
import { EmptyState } from "@/components/empty-state";
import { getPopularNews, getCategories, getCategoryNews } from "@/lib/api";
import { timeAgo, getCategoryName } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { Article, Category } from "@/types/news";

export default function HomePage() {
  const [popular, setPopular] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryArticles, setCategoryArticles] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [heroImgError, setHeroImgError] = useState(false);

  useEffect(() => {
    Promise.all([
      getPopularNews().catch(() => ({ articles: [], success: false, count: 0 })),
      getCategories().catch(() => ({ categories: [], success: false, count: 0, scrapedAt: "" })),
    ]).then(([pop, cats]) => {
      setPopular(pop.articles || []);
      setCategories(cats.categories || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    setCategoryLoading(true);
    const relevant = categories.filter((c) => c.id !== "main").slice(0, 6);
    Promise.all(
      relevant.map((cat) =>
        getCategoryNews(cat.id).catch(() => ({ articles: [], success: false, count: 0 }))
      )
    ).then((results) => {
      const map: Record<string, Article[]> = {};
      relevant.forEach((cat, i) => {
        map[cat.id] = (results[i].articles || []).slice(0, 3);
      });
      setCategoryArticles(map);
      setCategoryLoading(false);
    });
  }, [categories]);

  const featured = popular[0];
  const trending = popular.slice(1, 11);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Hero Section */}
      <section>
        {loading ? (
          <SkeletonHero />
        ) : featured ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href={`/news/${featured.id}`}
              className="group relative block rounded-3xl overflow-hidden bg-surface-900 border border-surface-200/20 dark:border-surface-800 shadow-2xl"
            >
              {featured.imageUrl && !heroImgError ? (
                <div className="absolute inset-0 z-0">
                  <Image
                    src={featured.imageUrl}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                    onError={() => setHeroImgError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[100px] md:text-[180px] font-bold text-white/5 font-bengali select-none">
                      দেশ বার্তা
                    </span>
                  </div>
                </>
              )}

              <div className="relative z-20 aspect-[21/10] md:aspect-[21/8]" />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 lg:p-14">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-crimson-500 text-white text-xs font-bold rounded-full shadow-md">
                    প্রধান সংবাদ
                  </span>
                  {featured.category && (
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full">
                      {getCategoryName(featured.category)}
                    </span>
                  )}
                  <span className="text-white/75 text-xs flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-crimson-400" />
                    #{featured.rank}
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl group-hover:text-crimson-300 transition-colors duration-300 font-bengali">
                  {featured.title}
                </h1>
                {featured.description && (
                  <p className="hidden md:block text-white/80 text-sm md:text-base mt-3 max-w-3xl line-clamp-2 font-bengali">
                    {featured.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-4 text-white/70 text-sm">
                  <time>{timeAgo(featured.scrapedAt || featured.publishedAt || "")}</time>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span className="flex items-center gap-1 text-crimson-300 font-medium group-hover:gap-2 transition-all">
                    বিস্তারিত পড়ুন <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <EmptyState type="no-data" />
        )}
      </section>

      {/* Category Navigation Bar */}
      {categories.length > 0 && (
        <section>
          <CategoryNav categories={categories} />
        </section>
      )}

      {/* Popular Trending Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-crimson-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-crimson-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">জনপ্রিয় শীর্ষ সংবাদ</h2>
              <p className="text-xs text-surface-500 mt-0.5">সবচেয়ে বেশি পঠিত সংবাদসমূহ</p>
            </div>
          </div>
          <span className="text-xs text-surface-400 font-mono">লাইভ আপডেট</span>
        </motion.div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonTrendingItem key={i} />
            ))}
          </div>
        ) : trending.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trending.map((article, i) => (
              <NewsCard
                key={article.id}
                article={article}
                index={i}
                variant="horizontal"
                showImage={true}
              />
            ))}
          </div>
        ) : (
          <EmptyState type="no-data" />
        )}
      </section>

      {/* Category Preview Sections */}
      <section className="space-y-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 border-b border-surface-200 dark:border-surface-800 pb-4"
        >
          <div className="h-9 w-9 rounded-xl bg-crimson-500/10 flex items-center justify-center">
            <Newspaper className="h-5 w-5 text-crimson-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">বিভাগ অনুযায়ী সংবাদ</h2>
            <p className="text-xs text-surface-500 mt-0.5">বিষয়ভিত্তিক সর্বশেষ সংবাদের সংগ্রহ</p>
          </div>
        </motion.div>

        {categoryLoading ? (
          <SkeletonGrid count={6} />
        ) : (
          Object.entries(categoryArticles).map(([catId, arts]) => {
            if (!arts || arts.length === 0) return null;
            const cat = categories.find((c) => c.id === catId);
            return (
              <motion.div
                key={catId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-crimson-500" />
                    {cat?.title || getCategoryName(catId)}
                  </h3>
                  <Link
                    href={`/category/${catId}`}
                    className="flex items-center gap-1 text-sm text-crimson-500 hover:text-crimson-600 font-medium transition-colors group"
                  >
                    সব দেখুন
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {arts.map((article, i) => (
                    <NewsCard key={`${article.id}-${i}`} article={article} index={i} />
                  ))}
                </div>
              </motion.div>
            );
          })
        )}
      </section>
    </div>
  );
}
