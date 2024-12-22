"use server";

import { Category, Comment, Post, User } from "@prisma/client";

export async function getPosts() {
  const posts = await fetch(`${process.env.API_URL}/api/posts`).then((res) =>
    res.json()
  );
  return posts.data as (Post & {
    category: Category;
    author: User;
    comments: Comment[];
  })[];
}

export async function getPost(slug: string) {
  const post = await fetch(`${process.env.API_URL}/api/posts/${slug}`).then(
    (res) => res.json()
  );
  return post.data as Post & {
    category: Category;
    author: User;
    comments: Comment[];
  };
}

export async function getCategories() {
  const categories = await fetch(`${process.env.API_URL}/api/categories`).then(
    (res) => res.json()
  );
  return categories.data as Category[];
}

export async function getCategory(slug: string) {
  try {
    const category = await fetch(
      `${process.env.API_URL}/api/categories/${slug}`
    ).then((res) => res.json());
    return category.data as Category;
  } catch (error) {
    console.error(error);
    return null;
  }
}
