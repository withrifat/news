"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Newspaper,
  Calendar,
} from "lucide-react";
import { NewsCard } from "@/components/news-card";
import { Skeleton } from "@/components/skeletons";
import { EmptyState } from "@/components/empty-state";
import {
  getArticleDetail,
  getPopularNews,
  getCategoryNews,
} from "@/lib/api";
import {
  estimateReadingTime,
  timeAgo,
  formatDate,
  getCategoryName,
} from "@/lib/utils";
import type { ArticleDetail, Article } from "@/types/news";

export default function ArticleDetailClient({ id }: { id: string }) {
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setArticle(null);

    getArticleDetail(id)
      .then((data) => {
        setArticle(data.article);
        setLoading(false);

        if (data.article?.category) {
          getCategoryNews(data.article.category)
            .then((catData) => {
              const filtered = (catData.articles || []).filter(
                (a) => a.id !== id
              );
              setRelated(filtered.slice(0, 4));
            })
            .catch(() => {});
        } else {
          getPopularNews()
            .then((pop) => {
              const filtered = (pop.articles || []).filter(
                (a) => a.id !== id
              );
              setRelated(filtered.slice(0, 4));
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article?.title || "");
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
    if (urls[platform]) {
      window.open(urls[platform], "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-6 w-32 mb-8" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-3/4 mb-8" />
        <div className="flex gap-4 mb-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="aspect-video w-full mb-8 rounded-2xl" />
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState type="error" message="সংবাদ খুঁজে পাওয়া যায়নি" />
      </div>
    );
  }

  const rawContent =
    article.content ||
    (article.paragraphs && article.paragraphs.length > 0
      ? article.paragraphs.join("\n\n")
      : "");
  const readTime = estimateReadingTime(rawContent || article.title);

  const paragraphsToRender =
    article.paragraphs && article.paragraphs.length > 0
      ? article.paragraphs
      : article.content
      ? article.content.split(/\n\s*\n|\n/)
      : [];

  const mainImageUrl = article.imageUrl || article.images?.[0]?.url;
  const sourceLink = article.link || article.url;

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-crimson-500 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          মূলপাতা
        </Link>
      </motion.div>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {article.category && (
          <Link
            href={`/category/${article.category}`}
            className="inline-block px-3 py-1 bg-crimson-500/10 text-crimson-500 text-xs font-bold rounded-full mb-4 hover:bg-crimson-500/20 transition-colors"
          >
            {getCategoryName(article.category)}
          </Link>
        )}

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-surface-500">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {readTime} মিনিট পড়ুন
          </span>
          {(article.publishedAt || article.scrapedAt) && (
            <>
              <span className="h-1 w-1 rounded-full bg-surface-300" />
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={article.publishedAt || article.scrapedAt}>
                  {timeAgo(article.publishedAt || article.scrapedAt || "")}
                </time>
              </span>
            </>
          )}
          {article.author && (
            <>
              <span className="h-1 w-1 rounded-full bg-surface-300" />
              <span>{article.author}</span>
            </>
          )}
        </div>
      </motion.header>

      {/* Action bar / share buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center gap-2 mb-8 p-3 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
      >
        <span className="text-sm text-surface-500 mr-2 flex items-center gap-1">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">শেয়ার:</span>
        </span>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "কপি হয়েছে" : "লিংক কপি"}
        </button>
        <button
          onClick={() => handleShare("twitter")}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
        >
          Twitter / X
        </button>
        <button
          onClick={() => handleShare("facebook")}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
        >
          Facebook
        </button>
        {sourceLink && (
          <a
            href={sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-crimson-500 hover:bg-crimson-500/10 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            মূল উৎস
          </a>
        )}
      </motion.div>

      {/* Main Feature Image */}
      {mainImageUrl && !imgError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative aspect-video rounded-3xl overflow-hidden mb-8 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-800"
        >
          <Image
            src={mainImageUrl}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        </motion.div>
      )}

      {/* Description Highlight */}
      {article.description && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-5 md:p-6 mb-8 rounded-2xl bg-surface-50 dark:bg-surface-800/60 border-l-4 border-crimson-500"
        >
          <p className="text-lg md:text-xl text-surface-700 dark:text-surface-200 leading-relaxed font-medium font-bengali">
            {article.description}
          </p>
        </motion.div>
      )}

      {/* Article Content / Paragraphs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-none"
      >
        {paragraphsToRender.length > 0 ? (
          <div className="text-base md:text-lg leading-[2] text-surface-800 dark:text-surface-200 space-y-6 font-bengali">
            {paragraphsToRender.map((paragraph, i) => (
              <p key={i} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
            <Newspaper className="h-12 w-12 mx-auto text-surface-300 dark:text-surface-600 mb-4" />
            <p className="text-surface-500 mb-4">
              সম্পূর্ণ সংবাদটি মূল সূত্রে বিস্তারিত পড়তে নিচের বাটনে ক্লিক করুন
            </p>
            {sourceLink && (
              <a
                href={sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-crimson-500 text-white text-sm font-medium hover:bg-crimson-600 transition-all shadow-md shadow-crimson-500/20"
              >
                <ExternalLink className="h-4 w-4" />
                মূল সূত্রে সম্পূর্ণ সংবাদ পড়ুন
              </a>
            )}
          </div>
        )}

        {/* Gallery / Extra Images */}
        {article.images && article.images.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {article.images.slice(1).map((img, i) => (
              <div
                key={i}
                className="relative aspect-video rounded-2xl overflow-hidden bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-800"
              >
                <Image
                  src={img.url}
                  alt={img.caption || `ছবি ${i + 2}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                {img.caption && img.caption !== "No caption available" && (
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-2 text-xs text-white">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Related News */}
      {related.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-surface-200 dark:border-surface-800"
        >
          <h2 className="text-2xl font-bold mb-6">সম্পর্কিত সংবাদ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((relArticle, i) => (
              <NewsCard key={relArticle.id} article={relArticle} index={i} />
            ))}
          </div>
        </motion.section>
      )}

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.title,
            description: article.description || article.title,
            author: article.author
              ? { "@type": "Person", name: article.author }
              : undefined,
            datePublished: article.publishedAt || article.scrapedAt,
            image: mainImageUrl ? [mainImageUrl] : undefined,
            publisher: {
              "@type": "Organization",
              name: "দেশ বার্তা",
              logo: {
                "@type": "ImageObject",
                url: "https://bengali-news.vercel.app/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://bengali-news.vercel.app/news/${article.id}`,
            },
          }),
        }}
      />
    </article>
  );
}
