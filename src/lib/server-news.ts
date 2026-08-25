import type {
  Article,
  ArticleDetail,
  ArticleDetailResponse,
  CategoriesResponse,
  Category,
  CategoryNewsResponse,
  PopularResponse,
  SearchNewsResponse,
} from "@/types/news";

const DEFAULT_ONLINE_API = "https://news-api-fs.vercel.app/api";

export function getApiBaseUrl(): string {
  return (
    process.env.NEWS_API_BASE_URL ||
    process.env.NEXT_PUBLIC_NEWS_API_URL ||
    DEFAULT_ONLINE_API
  ).replace(/\/$/, "");
}

const CATEGORY_DEFINITIONS: Category[] = [
  { id: "main", title: "মূলপাতা" },
  { id: "politics", title: "রাজনীতি" },
  { id: "world", title: "বিশ্ব" },
  { id: "economics", title: "অর্থনীতি" },
  { id: "health", title: "স্বাস্থ্য" },
  { id: "sports", title: "খেলা" },
  { id: "technology", title: "প্রযুক্তি" },
  { id: "bangladesh", title: "বাংলাদেশ" },
  { id: "india", title: "ভারত" },
];

const TOPIC_FEED_MAP: Record<string, string> = {
  main: "https://news.google.com/rss?hl=bn&gl=BD&ceid=BD:bn",
  politics:
    "https://news.google.com/rss/search?q=%E0%A6%B0%E0%A6%BE%E0%A6%9C%E0%A6%A8%E0%A7%80%E0%A6%A4%E0%A6%BF&hl=bn&gl=BD&ceid=BD:bn",
  world:
    "https://news.google.com/rss/headlines/section/topic/WORLD?hl=bn&gl=BD&ceid=BD:bn",
  economics:
    "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=bn&gl=BD&ceid=BD:bn",
  health:
    "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=bn&gl=BD&ceid=BD:bn",
  sports:
    "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=bn&gl=BD&ceid=BD:bn",
  technology:
    "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=bn&gl=BD&ceid=BD:bn",
  bangladesh:
    "https://news.google.com/rss/search?q=%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A6%87%E0%A6%B6&hl=bn&gl=BD&ceid=BD:bn",
  india:
    "https://news.google.com/rss/search?q=%E0%A6%AD%E0%A6%BE%E0%A6%B0%E0%A6%A4&hl=bn&gl=BD&ceid=BD:bn",
};

function unescapeHtml(text: any): string {
  if (typeof text !== "string") return "";
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function stripHtml(html: any): string {
  if (typeof html !== "string") return "";
  return unescapeHtml(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function parseRssFeed(xml: string, categoryId?: string): Article[] {
  const articles: Article[] = [];
  const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/gi) || [];

  itemBlocks.forEach((block, index) => {
    const titleMatch =
      block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) ||
      block.match(/<title>([\s\S]*?)<\/title>/i);
    const linkMatch =
      block.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i) ||
      block.match(/<link>([\s\S]*?)<\/link>/i);
    const pubDateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
    const descMatch =
      block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) ||
      block.match(/<description>([\s\S]*?)<\/description>/i);
    const sourceMatch = block.match(/<source[^>]*>([\s\S]*?)<\/source>/i);

    let rawTitle = titleMatch ? titleMatch[1].trim() : "";
    let link = linkMatch ? linkMatch[1].trim() : "";
    let pubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString();
    let source = sourceMatch ? stripHtml(sourceMatch[1]) : "";
    let description = descMatch ? stripHtml(descMatch[1]) : "";

    let cleanTitle = stripHtml(rawTitle);
    if (source && cleanTitle.endsWith(` - ${source}`)) {
      cleanTitle = cleanTitle.slice(0, -(source.length + 3)).trim();
    }

    if (!cleanTitle) return;

    const id = `rss-${Buffer.from(link || cleanTitle).toString("base64url").slice(0, 16)}`;

    let isoDate = new Date().toISOString();
    try {
      isoDate = new Date(pubDate).toISOString();
    } catch {
      // keep fallback
    }

    articles.push({
      rank: index + 1,
      id,
      title: cleanTitle,
      link: link || `https://news.google.com`,
      url: link,
      scrapedAt: isoDate,
      publishedAt: isoDate,
      description: description || cleanTitle,
      category: categoryId,
      source: source || "Google News",
    });
  });

  return articles;
}

export function normalizeArticle(
  raw: any,
  index: number = 0,
  fallbackCategory?: string
): Article {
  const rank = typeof raw.rank === "number" ? raw.rank : index + 1;
  const link = raw.link || raw.url || "";
  let id = raw.id;
  if (!id) {
    if (link) {
      id = link.split("/").filter(Boolean).pop() || `art-${rank}`;
    } else {
      id = `art-${rank}-${Date.now()}`;
    }
  }

  let imageUrl = raw.imageUrl;
  let images = Array.isArray(raw.images) ? raw.images : undefined;
  if (!imageUrl && images && images.length > 0 && images[0]?.url) {
    imageUrl = images[0].url;
  }
  if (imageUrl && (!images || images.length === 0)) {
    images = [{ url: imageUrl }];
  }

  const scrapedAt =
    raw.scrapedAt || raw.publishedAt || raw.pubDate || new Date().toISOString();
  const publishedAt = raw.publishedAt || raw.scrapedAt || scrapedAt;

  return {
    rank,
    id: String(id),
    title: raw.title ? stripHtml(raw.title) : "সংবাদ শিরোনাম",
    link,
    url: link,
    scrapedAt,
    publishedAt,
    imageUrl,
    images,
    description: raw.description ? stripHtml(raw.description) : undefined,
    category: raw.category || fallbackCategory,
    author: raw.author,
    source: raw.source,
  };
}

export function normalizeArticleDetail(
  raw: any,
  id: string,
  fallbackCategory?: string
): ArticleDetail {
  let paragraphs: string[] = [];
  if (Array.isArray(raw.paragraphs) && raw.paragraphs.length > 0) {
    paragraphs = raw.paragraphs
      .map((p: any) => (typeof p === "string" ? stripHtml(p) : ""))
      .filter(Boolean);
  } else if (Array.isArray(raw.content) && raw.content.length > 0) {
    paragraphs = raw.content
      .map((p: any) => (typeof p === "string" ? stripHtml(p) : ""))
      .filter(Boolean);
  } else if (typeof raw.content === "string" && raw.content.trim()) {
    paragraphs = raw.content
      .split(/\n\s*\n|\n/)
      .map((p: string) => stripHtml(p))
      .filter(Boolean);
  }

  const content =
    paragraphs.join("\n\n") ||
    (typeof raw.content === "string" ? stripHtml(raw.content) : "");

  let imageUrl = raw.imageUrl;
  let images = Array.isArray(raw.images)
    ? raw.images
        .map((img: any) => ({
          url: typeof img === "string" ? img : img?.url,
          caption:
            typeof img === "object" && img?.caption ? img.caption : undefined,
        }))
        .filter((img: any) => Boolean(img.url))
    : undefined;

  if (!imageUrl && images && images.length > 0 && images[0]?.url) {
    imageUrl = images[0].url;
  }
  if (imageUrl && (!images || images.length === 0)) {
    images = [{ url: imageUrl }];
  }

  const link = raw.link || raw.url || "";
  const scrapedAt = raw.scrapedAt || raw.publishedAt || new Date().toISOString();
  const publishedAt =
    raw.publishedAt || raw.timestamp || raw.scrapedAt || scrapedAt;
  const description =
    raw.description || raw.headline || (paragraphs.length > 0 ? paragraphs[0] : "");

  return {
    id: String(id),
    title: raw.title ? stripHtml(raw.title) : "সংবাদ",
    headline: raw.headline ? stripHtml(raw.headline) : undefined,
    content,
    paragraphs,
    link,
    url: link,
    author: raw.author,
    publishedAt,
    scrapedAt,
    imageUrl,
    images,
    category: raw.category || fallbackCategory,
    description: description ? stripHtml(description) : undefined,
  };
}

export async function fetchPopularNewsServer(): Promise<PopularResponse> {
  const baseUrl = getApiBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/popular`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.articles) && data.articles.length > 0) {
        const articles = data.articles.map((art: any, i: number) =>
          normalizeArticle(art, i)
        );
        return {
          success: true,
          count: articles.length,
          articles,
          scrapedAt: data.scrapedAt || new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn("Primary popular news fetch failed, falling back to Google News RSS:", err);
  }

  // Fallback to Google News top stories RSS
  try {
    const rssRes = await fetch(TOPIC_FEED_MAP.main, {
      next: { revalidate: 120 },
    });
    if (rssRes.ok) {
      const xml = await rssRes.text();
      const articles = parseRssFeed(xml, "main");
      return {
        success: true,
        count: articles.length,
        articles,
        scrapedAt: new Date().toISOString(),
      };
    }
  } catch (rssErr) {
    console.error("RSS fallback also failed for popular news:", rssErr);
  }

  return {
    success: false,
    count: 0,
    articles: [],
    scrapedAt: new Date().toISOString(),
  };
}

export async function fetchCategoriesServer(): Promise<CategoriesResponse> {
  const baseUrl = getApiBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/categories`, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.categories) && data.categories.length > 0) {
        return {
          success: true,
          count: data.categories.length,
          categories: data.categories,
          scrapedAt: data.scrapedAt || new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn("Primary categories fetch failed, using default list:", err);
  }

  return {
    success: true,
    count: CATEGORY_DEFINITIONS.length,
    categories: CATEGORY_DEFINITIONS,
    scrapedAt: new Date().toISOString(),
  };
}

export async function fetchCategoryNewsServer(
  categoryId: string
): Promise<CategoryNewsResponse> {
  const baseUrl = getApiBaseUrl();

  // Try primary online API first
  try {
    const res = await fetch(`${baseUrl}/categories/${categoryId}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.articles) && data.articles.length > 0) {
        const articles = data.articles.map((art: any, i: number) =>
          normalizeArticle(art, i, categoryId)
        );
        return {
          success: true,
          count: articles.length,
          categoryId: data.categoryId || categoryId,
          categoryName: data.categoryName,
          articles,
        };
      }
    }
  } catch (err) {
    console.warn(`Primary category fetch failed for "${categoryId}", falling back to RSS:`, err);
  }

  // Fallback to topic RSS feed
  const feedUrl = TOPIC_FEED_MAP[categoryId] || TOPIC_FEED_MAP.main;
  try {
    const rssRes = await fetch(feedUrl, {
      next: { revalidate: 120 },
    });
    if (rssRes.ok) {
      const xml = await rssRes.text();
      const articles = parseRssFeed(xml, categoryId);
      return {
        success: true,
        count: articles.length,
        categoryId,
        categoryName:
          CATEGORY_DEFINITIONS.find((c) => c.id === categoryId)?.title || categoryId,
        articles,
      };
    }
  } catch (rssErr) {
    console.error(`RSS fallback failed for category "${categoryId}":`, rssErr);
  }

  return {
    success: false,
    count: 0,
    categoryId,
    articles: [],
  };
}

export async function fetchArticleDetailServer(
  id: string
): Promise<ArticleDetailResponse> {
  const baseUrl = getApiBaseUrl();

  // Check if id is an RSS ID
  if (id.startsWith("rss-")) {
    return {
      success: true,
      article: {
        id,
        title: "সংবাদ বিস্তারিত",
        content: "এই সংবাদটির সম্পূর্ণ বিবরণ পড়তে মূল সূত্রে ক্লিক করুন।",
        paragraphs: ["এই সংবাদটির সম্পূর্ণ বিবরণ পড়তে মূল সূত্রে ক্লিক করুন।"],
        scrapedAt: new Date().toISOString(),
      },
    };
  }

  try {
    const res = await fetch(`${baseUrl}/news/${id}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.article) {
        const article = normalizeArticleDetail(data.article, id);
        return {
          success: true,
          article,
        };
      }
    }
  } catch (err) {
    console.warn(`Primary article fetch failed for "${id}":`, err);
  }

  return {
    success: false,
    article: null,
  };
}

export async function searchNewsServer(
  query: string
): Promise<SearchNewsResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { success: true, count: 0, query: "", articles: [] };
  }

  const searchUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
    trimmed
  )}&hl=bn&gl=BD&ceid=BD:bn`;

  try {
    const res = await fetch(searchUrl, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const xml = await res.text();
      const articles = parseRssFeed(xml);
      return {
        success: true,
        count: articles.length,
        query: trimmed,
        articles,
      };
    }
  } catch (err) {
    console.error("Search fetch failed:", err);
  }

  return {
    success: false,
    count: 0,
    query: trimmed,
    articles: [],
  };
}
