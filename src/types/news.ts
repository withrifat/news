export interface ArticleImage {
  url: string;
  caption?: string;
}

export interface Article {
  rank: number;
  id: string;
  title: string;
  link: string;
  url?: string;
  scrapedAt: string;
  publishedAt?: string;
  imageUrl?: string;
  images?: ArticleImage[];
  description?: string;
  category?: string;
  author?: string;
  source?: string;
}

export interface Category {
  id: string;
  title: string;
}

export interface PopularResponse {
  success: boolean;
  count: number;
  articles: Article[];
  scrapedAt?: string;
}

export interface CategoriesResponse {
  success: boolean;
  count: number;
  categories: Category[];
  scrapedAt: string;
}

export interface CategoryNewsResponse {
  success: boolean;
  count: number;
  categoryId?: string;
  categoryName?: string;
  articles: Article[];
}

export interface ArticleDetail {
  id: string;
  title: string;
  content: string;
  paragraphs?: string[];
  link?: string;
  url?: string;
  author?: string;
  publishedAt?: string;
  scrapedAt?: string;
  imageUrl?: string;
  images?: ArticleImage[];
  category?: string;
  description?: string;
  headline?: string;
}

export interface ArticleDetailResponse {
  success: boolean;
  article: ArticleDetail | null;
}

export interface SearchNewsResponse {
  success: boolean;
  count: number;
  query: string;
  articles: Article[];
}

export type CategoryId =
  | "main"
  | "politics"
  | "world"
  | "economics"
  | "health"
  | "sports"
  | "technology"
  | "bangladesh"
  | "india";
