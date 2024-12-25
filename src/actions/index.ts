"use server";

import { Category, Comment, CommentStatus, Post, User } from "@prisma/client";
import { cookies } from "next/headers";

export const getPosts = async (params: {
  page?: number;
  q?: string;
  category?: string | null;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}) => {
  const response = await fetch(
    `${process.env.API_URL}/api/posts?page=${params.page ?? 1}${
      params.q ? `&q=${params.q}` : ""
    }${params.category ? `&category=${params.category}` : ""}${
      params.limit ? `&limit=${params.limit}` : ""
    }${params.sortBy ? `&sortBy=${params.sortBy}` : ""}${
      params.sortDesc ? `&sortDesc=${params.sortDesc}` : ""
    }`
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
  const cookieList = await cookies();

  const response = await fetch(`${process.env.API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      Cookie: cookieList
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; "),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    return { status: false, code: data.error };
  }

  cookieList.set({
    name: "access-token",
    value: data.data.accessToken,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 5, // 5 minutes
  });

  cookieList.set({
    name: "refresh-token",
    value: data.data.refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hour
  });

  return { status: true, code: "login-success" };
};

export const currentUser = async () => {
  const cookieList = await cookies();

  const accessToken = cookieList.get("access-token")?.value;

  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${process.env.API_URL}/api/auth/current-user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data as User;
};

export const getUsers = async () => {
  const response = await fetch(`${process.env.API_URL}/api/users`);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data as User[];
};

export const getComments = async (params: {
  page?: number;
  q?: string;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}) => {
  const response = await fetch(
    `${process.env.API_URL}/api/comments?page=${params.page ?? 1}${
      params.q ? `&q=${params.q}` : ""
    }${params.limit ? `&limit=${params.limit}` : ""}${
      params.sortBy ? `&sortBy=${params.sortBy}` : ""
    }${params.sortDesc ? `&sortDesc=${params.sortDesc}` : ""}`
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data as PaginatedResponse<
    Comment & { post: Post & { category: Category } }
  >;
};

export const updateCommentStatus = async (
  id: string | string[],
  status: CommentStatus
) => {
  const response = await fetch(`${process.env.API_URL}/api/comments`, {
    method: "PUT",
    body: JSON.stringify({ id, status }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();

  return Array.isArray(id) ? (data.data as Comment[]) : (data.data as Comment);
};
