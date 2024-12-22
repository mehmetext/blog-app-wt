"use server";

import { Category, Comment, Post, User } from "@prisma/client";

type RequestConfig = {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

type PaginatedResponse<T> = {
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

export const getPosts = async (params: { page: number; q: string }) =>
  fetchAPI<
    PaginatedResponse<
      Post & {
        category: Category;
        author: User;
        comments: Comment[];
      }
    >
  >(`posts?page=${params.page}&q=${params.q}`);

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
