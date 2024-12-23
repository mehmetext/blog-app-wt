import prisma from "@/lib/prisma";
import { Post, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page =
    Number(searchParams.get("page")) < 1 ? 1 : Number(searchParams.get("page"));
  const limit = Number(searchParams.get("limit")) || 10;
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const sortBy = searchParams.get("sortBy");
  const sortDesc = searchParams.get("sortDesc");

  const orderBy: Prisma.PostOrderByWithRelationInput = {};

  if (sortBy) {
    switch (sortBy) {
      case "comments":
        orderBy.comments = {
          _count: sortDesc ? "desc" : "asc",
        };
        break;
      case "author":
        orderBy.author = {
          name: sortDesc ? "desc" : "asc",
        };
        break;
      case "deletedAt":
        orderBy.deletedAt = sortDesc ? "desc" : "asc";
        break;
      default:
        orderBy[sortBy as keyof Post] = sortDesc ? "desc" : "asc";
        break;
    }
  }

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      include: {
        category: true,
        author: true,
        comments: true,
      },
      orderBy,
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
