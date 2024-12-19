"use server";

export async function getPosts() {
  const posts = await fetch(`${process.env.API_URL}/api/posts`).then((res) =>
    res.json()
  );
  return posts.data as Post[];
}
