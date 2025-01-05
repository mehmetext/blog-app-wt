"use server";

import { Category, Comment, CommentStatus, Post, User } from "@prisma/client";
import { cookies } from "next/headers";

export const getPosts = async ({
  page = 1,
  q,
  category,
  limit = 10,
  sortBy,
  sortDesc,
  featured,
}: {
  page?: number;
  q?: string;
  category?: string | null;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
  featured?: boolean;
}) => {
  const searchParams = new URLSearchParams();

  if (page) searchParams.set("page", page.toString());
  if (limit) searchParams.set("limit", limit.toString());
  if (q) searchParams.set("q", q);
  if (category) searchParams.set("category", category);
  if (sortBy) searchParams.set("sortBy", sortBy);
  if (sortDesc) searchParams.set("sortDesc", sortDesc.toString());
  if (featured) searchParams.set("featured", featured.toString());

  const res = await fetch(
    `${process.env.API_URL}/api/posts?${searchParams.toString()}`
  );
  const json = await res.json();

  return json.data as {
    items: (Post & {
      category: Category;
      author: User;
      comments: Comment[];
    })[];
    limit: number;
    pageCount: number;
  };
};

export const getPost = async (slug: string) => {
  const res = await fetch(`${process.env.API_URL}/api/posts/${slug}`);
  const json = await res.json();

  return json.data as Post & {
    category: Category;
    author: User;
    comments: Comment[];
  };
};

export const getPostById = async (id: string) => {
  const res = await fetch(`${process.env.API_URL}/api/admin/posts/${id}`);
  const json = await res.json();

  return json.data as Post & {
    category: Category;
    author: User;
    comments: Comment[];
  };
};

export const updatePost = async (id: string, data: Partial<Post>) => {
  const res = await fetch(`${process.env.API_URL}/api/admin/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  const json = await res.json();

  return json.data as Post & {
    category: Category;
    author: User;
    comments: Comment[];
  };
};

export const getCategories = async () => {
  const res = await fetch(`${process.env.API_URL}/api/categories`);
  const json = await res.json();

  return json.data as (Category & { _count: { posts: number } })[];
};

export const getCategory = async (slug: string) => {
  const res = await fetch(`${process.env.API_URL}/api/categories/${slug}`);
  const json = await res.json();

  return json.data as Category;
};

export const createComment = async ({
  content,
  authorName,
  postId,
}: {
  content: string;
  authorName: string;
  postId: string;
}) => {
  const res = await fetch(`${process.env.API_URL}/api/comments`, {
    method: "POST",
    body: JSON.stringify({ content, authorName, postId }),
  });
  const json = await res.json();

  return json.data as Comment;
};

export const login = async (email: string, password: string) => {
  const cookieList = await cookies();

  const res = await fetch(`${process.env.API_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();

  if (!res.ok) {
    return { status: false, code: "invalid-credentials" };
  }

  const { accessToken, refreshToken } = json.data;

  cookieList.set({
    name: "access-token",
    value: accessToken,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 15, // 15 minutes
  });

  cookieList.set({
    name: "refresh-token",
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { status: true, code: "login-success" };
};

export const refreshTokens = async () => {
  const cookieList = await cookies();
  const refreshToken = cookieList.get("refresh-token")?.value;

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  const response = await fetch(`${process.env.API_URL}/api/auth/refresh`, {
    method: "GET",
    headers: {
      Cookie: `refresh-token=${refreshToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const json = await response.json();

  return json.data as { accessToken: string; refreshToken: string };
};

export const logout = async () => {
  const cookieList = await cookies();
  cookieList.delete("access-token");
  cookieList.delete("refresh-token");

  return { status: true, code: "logout-success" };
};

export const currentUser = async () => {
  try {
    const cookieList = await cookies();

    const res = await fetch(`${process.env.API_URL}/api/auth/current-user`, {
      headers: {
        Authorization: `Bearer ${cookieList.get("access-token")?.value}`,
      },
    });

    const json = await res.json();

    return json.data as User;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUsers = async () => {
  const res = await fetch(`${process.env.API_URL}/api/users`);
  const json = await res.json();

  return json.data as (User & { _count: { Post: number } })[];
};

export const getComments = async ({
  page = 1,
  q,
  limit = 10,
  sortBy,
  sortDesc,
}: {
  page?: number;
  q?: string;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}) => {
  const searchParams = new URLSearchParams();

  if (page) searchParams.set("page", page.toString());
  if (limit) searchParams.set("limit", limit.toString());
  if (q) searchParams.set("q", q);
  if (sortBy) searchParams.set("sortBy", sortBy);
  if (sortDesc) searchParams.set("sortDesc", sortDesc.toString());

  const res = await fetch(
    `${process.env.API_URL}/api/comments?${searchParams.toString()}`
  );
  const json = await res.json();

  return json.data as {
    items: (Comment & {
      post: Post & {
        category: Category;
      };
    })[];
    limit: number;
    pageCount: number;
  };
};

export const updateCommentStatus = async (
  id: string | string[],
  status: CommentStatus
) => {
  const res = await fetch(`${process.env.API_URL}/api/comments`, {
    method: "PUT",
    body: JSON.stringify({ id, status }),
  });
  const json = await res.json();

  return json.data;
};

export const createPost = async ({
  title,
  content,
  categoryId,
  coverImage,
}: {
  title: string;
  content: string;
  categoryId: string;
  coverImage: string;
}) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${process.env.API_URL}/api/posts`, {
    method: "POST",
    body: JSON.stringify({
      title,
      content,
      categoryId,
      coverImage,
      userId: user.id,
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message);
  }

  return json.data as Post;
};

export async function createCategory(data: { name: string }) {
  const res = await fetch(`${process.env.API_URL}/api/categories`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json = await res.json();

  return json.data as Category;
}

export async function updateCategory(id: string, data: { name: string }) {
  const res = await fetch(`${process.env.API_URL}/api/admin/categories/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json = await res.json();

  return json.data as Category;
}
