import type { Metadata } from "next";
import { getArticleDetail } from "@/lib/api";
import ArticleDetailClient from "./client";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const data = await getArticleDetail(params.id);
    const article = data.article;

    if (!article) {
      return { title: "সংবাদ পাওয়া যায়নি" };
    }

    const description =
      article.description || article.title?.slice(0, 160) || "";
    const title = article.title;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        publishedTime: article.publishedAt,
        images: article.imageUrl ? [{ url: article.imageUrl }] : [],
        siteName: "সংবাদ",
        locale: "bn_BD",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: article.imageUrl ? [article.imageUrl] : [],
      },
    };
  } catch {
    return { title: "সংবাদ" };
  }
}

export default async function ArticlePage({ params }: Props) {
  return <ArticleDetailClient id={params.id} />;
}
