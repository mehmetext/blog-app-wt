"use server";

import { Category, Comment, Post, User } from "@prisma/client";

export async function getPosts() {
  const posts = await fetch(`${process.env.API_URL}/api/posts`).then((res) =>
    res.json()
  );
  return posts.data as (Post & { category: Category })[];
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

export async function getCategory(slug: string) {
  const category = await fetch(
    `${process.env.API_URL}/api/categories/${slug}`
  ).then((res) => res.json());
  return category.data as Category;
}
