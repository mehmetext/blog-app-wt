"use client";

import { PaginationControls } from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H1 } from "@/components/ui/typography";
import homepageNuqs from "@/lib/nuqs/homepage";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PostItem } from "./post-item";

const DUMMY_POST: Post = {
  id: "1",
  title: "Next.js ve TypeScript ile Modern Web Uygulamaları Geliştirme",
  content:
    "Modern web uygulamaları geliştirmek için Next.js ve TypeScript kullanımı hakkında detaylı bir rehber. Bu yazıda, Next.js'in sunduğu özellikler ve TypeScript ile nasıl güvenli kod yazabileceğinizi öğreneceksiniz.",
  slug: "nextjs-typescript-modern-web-uygulamalari",
  coverImage:
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop",
  authorId: "1",
  categoryId: "1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const DUMMY_CATEGORY: Category = {
  id: "1",
  name: "Web Geliştirme",
  slug: "web-gelistirme",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function Posts({ page, q }: { page: number; q: string }) {
  const [query, setQuery] = useState(q ?? "");
  const router = useRouter();

  const TOTAL_PAGES = 10; // Bu değer API'den gelmeli

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostItem key={i} post={DUMMY_POST} category={DUMMY_CATEGORY} />
        ))}
      </div>
      <PaginationControls
        currentPage={page}
        totalPages={TOTAL_PAGES}
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
