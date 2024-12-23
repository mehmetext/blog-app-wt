"use server";

import { Category, Comment, Post, User } from "@prisma/client";

type RequestConfig = {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export type PaginatedResponse<T> = {
  items: T[];
  limit: number;
  pageCount: number;
};

async function fetchAPI<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, cache, next } = config;

  try {
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      cache,
      next,
    };

    if (body) {
      requestConfig.body = JSON.stringify(body);
    }

    const response = await fetch(
      `${process.env.API_URL}/api/${endpoint}`,
      requestConfig
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export const getPosts = async (params: {
  page: number;
  q: string;
  category?: string | null;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}) =>
  fetchAPI<
    PaginatedResponse<
      Post & {
        category: Category;
        author: User;
        comments: Comment[];
      }
    >
  >(
    `posts?page=${params.page}&q=${params.q}${
      params.category ? `&category=${params.category}` : ""
    }${params.limit ? `&limit=${params.limit}` : ""}${
      params.sortBy ? `&sortBy=${params.sortBy}` : ""
    }${params.sortDesc ? `&sortDesc=${params.sortDesc}` : ""}`
  );

export const getPost = async (slug: string) =>
  fetchAPI<
    Post & {
      category: Category;
      author: User;
      comments: Comment[];
    }
  >(`posts/${slug}`);

export const getCategories = async () => fetchAPI<Category[]>("categories");

export const getCategory = async (slug: string) =>
  fetchAPI<Category>(`categories/${slug}`);

export const createComment = async (comment: {
  content: string;
  authorName: string;
  postId: string;
}) =>
  fetchAPI<Comment>("comments", {
    method: "POST",
    body: {
      content: comment.content,
      authorName: !comment.authorName ? null : comment.authorName,
      postId: comment.postId,
    },
  });

export const login = async (email: string, password: string) => {
  const response = await fetch(`${process.env.API_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json()) as { data: { accessToken: string } };

  console.log(data);
};
