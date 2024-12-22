"use client";

import { PaginationControls } from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H1 } from "@/components/ui/typography";
import homepageNuqs from "@/lib/nuqs/homepage";
import { Category, Comment, Post, User } from "@prisma/client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PostItem } from "./post-item";

export default function Posts({
  page,
  q,
  posts,
  pageCount,
}: {
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
        <H1>Yazılar</H1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(
              `/${homepageNuqs.serializer({
                page: null,
                q: query.trim() === "" ? null : query.trim(),
              })}`
            );
          }}
          className="flex justify-center items-center gap-2"
        >
          <Input
            placeholder="Yazılarda ara..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <Button className="shrink-0" size="icon">
            <Search />
          </Button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
      <PaginationControls
        currentPage={page}
        totalPages={pageCount}
        generatePageUrl={(page) => {
          return `/${homepageNuqs.serializer({
            page: page === 1 ? null : page,
            q: query,
          })}`;
        }}
      />
    </div>
  );
}
