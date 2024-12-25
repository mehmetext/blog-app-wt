import prisma from "@/lib/prisma";
import { Comment, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const comment = await req.json();
  const { content, authorName, postId } = comment;

  const newComment = await prisma.comment.create({
    data: {
      content,
      authorName,
      postId,
    },
  });

  return NextResponse.json({ data: newComment }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const comment = await req.json();
  const { id, status } = comment;

  if (Array.isArray(id)) {
    const updatedComments = await prisma.comment.updateMany({
      where: { id: { in: id } },
      data: { status },
    });

    return NextResponse.json({ data: updatedComments }, { status: 200 });
  } else {
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ data: updatedComment }, { status: 200 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page =
    Number(searchParams.get("page")) < 1 ? 1 : Number(searchParams.get("page"));
  const limit = Number(searchParams.get("limit")) || 10;
  const q = searchParams.get("q");
  const sortBy = searchParams.get("sortBy");
  const sortDesc = searchParams.get("sortDesc");

  const orderBy: Prisma.CommentOrderByWithRelationInput = {};

  if (sortBy) {
    switch (sortBy) {
      case "postTitle":
        orderBy.post = {
          title: sortDesc ? "desc" : "asc",
        };
        break;
      default:
        orderBy[sortBy as keyof Comment] = sortDesc ? "desc" : "asc";
        break;
    }
  }

  const [comments, total] = await prisma.$transaction([
    prisma.comment.findMany({
      include: {
        post: {
          include: {
            category: true,
          },
        },
      },
      orderBy,
      take: limit,
      skip: (page - 1) * limit,
      where: {
        // Only show posts that are not deleted
        deletedAt: null,
        ...(q
          ? {
              OR: [
                {
                  content: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
                {
                  authorName: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
    }),
    prisma.comment.count({
      where: {
        deletedAt: null,
        ...(q
          ? {
              OR: [
                {
                  content: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
                {
                  authorName: {
                    contains: q,
                    mode: "insensitive",
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
      items: comments,
      limit,
      pageCount: Math.ceil(total / limit),
    },
  });
}
