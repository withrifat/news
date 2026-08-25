import type {
  PopularResponse,
  CategoriesResponse,
  CategoryNewsResponse,
  ArticleDetailResponse,
  SearchNewsResponse,
} from "@/types/news";

const isServer = typeof window === "undefined";

const defaultOptions: RequestInit = {
  next: { revalidate: 60 },
};

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = isServer
    ? `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api${endpoint}`
    : `/api${endpoint}`;

  try {
    const res = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (clientErr) {
    // If relative API fails on client or internal fetch fails, try online fallback directly
    console.warn(`Local API fetch failed for ${endpoint}, falling back to public online API:`, clientErr);
  }

  // Fallback to direct public online API
  const directBase =
    process.env.NEXT_PUBLIC_NEWS_API_URL ||
    process.env.NEWS_API_BASE_URL ||
    "https://news-api-fs.vercel.app/api";

  const directRes = await fetch(`${directBase}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  if (!directRes.ok) {
    throw new Error(`API error: ${directRes.status} ${directRes.statusText}`);
  }

  return directRes.json();
}

export async function getPopularNews(): Promise<PopularResponse> {
  if (isServer) {
    const { fetchPopularNewsServer } = await import("@/lib/server-news");
    return fetchPopularNewsServer();
  }
  return fetchApi<PopularResponse>("/popular");
}

export async function getCategories(): Promise<CategoriesResponse> {
  if (isServer) {
    const { fetchCategoriesServer } = await import("@/lib/server-news");
    return fetchCategoriesServer();
  }
  return fetchApi<CategoriesResponse>("/categories");
}

export async function getCategoryNews(
  categoryId: string
): Promise<CategoryNewsResponse> {
  if (isServer) {
    const { fetchCategoryNewsServer } = await import("@/lib/server-news");
    return fetchCategoryNewsServer(categoryId);
  }
  return fetchApi<CategoryNewsResponse>(`/categories/${categoryId}`);
}

export async function getArticleDetail(
  id: string
): Promise<ArticleDetailResponse> {
  if (isServer) {
    const { fetchArticleDetailServer } = await import("@/lib/server-news");
    return fetchArticleDetailServer(id);
  }
  return fetchApi<ArticleDetailResponse>(`/news/${id}`);
}

export async function searchNews(
  query: string
): Promise<SearchNewsResponse> {
  if (isServer) {
    const { searchNewsServer } = await import("@/lib/server-news");
    return searchNewsServer(query);
  }
  return fetchApi<SearchNewsResponse>(`/search?q=${encodeURIComponent(query)}`);
}
