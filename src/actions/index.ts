"use server";

import { Category, Comment, Post, User } from "@prisma/client";

async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${process.env.API_URL}/api/${endpoint}`);
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

export async function getPosts() {
  return fetchAPI<
    (Post & {
      category: Category;
      author: User;
      comments: Comment[];
    })[]
  >("posts");
}

export async function getPost(slug: string) {
  return fetchAPI<
    Post & {
      category: Category;
      author: User;
      comments: Comment[];
    }
  >(`posts/${slug}`);
}

export async function getCategories() {
  return fetchAPI<Category[]>("categories");
}

export async function getCategory(slug: string) {
  return fetchAPI<Category>(`categories/${slug}`);
}
