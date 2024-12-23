import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page =
    Number(searchParams.get("page")) < 1 ? 1 : Number(searchParams.get("page"));
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const limit = 6;

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      include: {
        category: true,
        author: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
      where: {
        // Only show posts that are not deleted
        deletedAt: null,
        // Only show posts that are in the category
        ...(category
          ? {
              category: {
                slug: category,
              },
            }
          : {}),
        // Search for posts that contain the query in the title or content
        ...(q
          ? {
              OR: [
                {
                  title: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
                {
                  content: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
                {
                  comments: {
                    some: { content: { contains: q, mode: "insensitive" } },
                  },
                },
              ],
            }
          : {}),
      },
    }),
    prisma.post.count({
      where: {
        deletedAt: null,
        ...(category
          ? {
              category: {
                slug: category,
              },
            }
          : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { content: { contains: q, mode: "insensitive" } },
                {
                  comments: {
                    some: { content: { contains: q, mode: "insensitive" } },
                  },
                },
              ],
            }
          : {}),
      },
    }),
  ]);

  return NextResponse.json({
    data: {
      items: posts,
      limit,
      pageCount: Math.ceil(total / limit),
    },
  });
}
