import { MetadataRoute } from "next";

const BASE_URL = "https://bengali-news.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 1,
    },
  ];

  const categoryPages = [
    "main",
    "politics",
    "world",
    "economics",
    "health",
    "sports",
    "technology",
    "bangladesh",
    "india",
  ].map((id) => ({
    url: `${BASE_URL}/category/${id}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages];
}
