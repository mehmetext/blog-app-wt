"use client";

import { PaginationControls } from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H1, Muted } from "@/components/ui/typography";
import postsNuqs from "@/lib/nuqs/posts";
import { Category, Comment, Post, User } from "@prisma/client";
import { FileX, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PostItem } from "./post-item";

export default function Posts({
  category,
  page,
  q,
  posts,
  pageCount,
}: {
  category?: Category;
  page: number;
  q: string;
  posts: (Post & {
    category: Category;
    author: User;
    comments: Comment[];
  })[];
  pageCount: number;
}) {
  const [query, setQuery] = useState(q);
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-6">
        <H1>{category ? `${category.name} Posts` : "Posts"}</H1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(
              `/${category?.slug ?? ""}${postsNuqs.serializer({
                page: null,
                q: query.trim() === "" ? null : query.trim(),
              })}`
            );
          }}
          className="flex justify-center items-center gap-2"
        >
          <Input
            placeholder="Search in posts..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <Button className="shrink-0" size="icon">
            <Search />
          </Button>
        </form>
      </div>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <FileX className="h-12 w-12 text-muted-foreground" />
          <Muted>
            {category ? "No posts found in this category." : "No posts found."}
          </Muted>
        </div>
      )}
      {pageCount > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={pageCount}
          generatePageUrl={(page) => {
            return `/${category?.slug ?? ""}${postsNuqs.serializer({
              page: page === 1 ? null : page,
              q: query,
            })}`;
          }}
        />
      )}
    </div>
  );
}
