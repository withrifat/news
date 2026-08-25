import type { Metadata } from "next";
import { getCategoryName } from "@/lib/utils";
import CategoryPageClient from "./client";

type Props = {
  params: { categoryId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = getCategoryName(params.categoryId);
  return {
    title: `${name} — সংবাদ`,
    description: `${name} বিভাগের সর্বশেষ সংবাদ। বাংলাদেশ ও বিশ্বের সংবাদ পড়ুন।`,
    openGraph: {
      title: `${name} | সংবাদ`,
      description: `${name} বিভাগের সর্বশেষ সংবাদ।`,
      type: "website",
      siteName: "সংবাদ",
      locale: "bn_BD",
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  return <CategoryPageClient categoryId={params.categoryId} />;
}
