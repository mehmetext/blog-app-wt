"use server";

import { Category, Comment, Post, User } from "@prisma/client";

export const getPosts = async (params: {
  page: number;
  q: string;
  category?: string | null;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}) => {
  const response = await fetch(
    `${process.env.API_URL}/api/posts?page=${params.page}&q=${params.q}${
      params.category ? `&category=${params.category}` : ""
    }${params.limit ? `&limit=${params.limit}` : ""}${
      params.sortBy ? `&sortBy=${params.sortBy}` : ""
    }${params.sortDesc ? `&sortDesc=${params.sortDesc}` : ""}`
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data as PaginatedResponse<
    Post & { category: Category; author: User; comments: Comment[] }
  >;
};

export const getPost = async (slug: string) => {
  const response = await fetch(`${process.env.API_URL}/api/posts/${slug}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data as Post & {
    category: Category;
    author: User;
    comments: Comment[];
  };
};

export const getCategories = async () => {
  const response = await fetch(`${process.env.API_URL}/api/categories`);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data as Category[];
};

export const getCategory = async (slug: string) => {
  const response = await fetch(`${process.env.API_URL}/api/categories/${slug}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data as Category;
};

export const createComment = async (comment: {
  content: string;
  authorName: string;
  postId: string;
}) => {
  const response = await fetch(`${process.env.API_URL}/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: comment.content,
      authorName: !comment.authorName ? null : comment.authorName,
      postId: comment.postId,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data as Comment;
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${process.env.API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.accessToken;
};
