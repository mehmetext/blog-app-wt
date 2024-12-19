import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: {
      id: "1",
      title: "Next.js ve TypeScript ile Modern Web Uygulamaları Geliştirme",
      content:
        "Modern web uygulamaları geliştirmek için Next.js ve TypeScript kullanımı hakkında detaylı bir rehber. Bu yazıda, Next.js'in sunduğu özellikler ve TypeScript ile nasıl güvenli kod yazabileceğinizi öğreneceksiniz.",
      slug: "nextjs-typescript-modern-web-uygulamalari",
      coverImage:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop",
      authorId: "1",
      categoryId: "1",
      category: { id: "1", name: "Web Geliştirme", slug: "web-gelistirme" },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}
