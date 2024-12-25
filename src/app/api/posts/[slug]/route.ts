import prisma from "@/lib/prisma";
import { Post } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    include: {
      category: true,
      author: true,
      comments: {
        where: {
          deletedAt: null,
          status: "APPROVED",
        },
      },
    },
    where: {
      slug: slug,
      deletedAt: null,
    },
  });

  return NextResponse.json({
    data: post,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const data = (await request.json()) as Partial<Post>;

  if (data.isFeatured) {
    const [, post] = await prisma.$transaction([
      prisma.post.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false },
      }),
      prisma.post.update({
        where: { slug },
        data: {
          ...data,
        },
      }),
    ]);

    return NextResponse.json({ data: post });
  } else {
    const post = await prisma.post.update({
      where: { slug },
      data: {
        ...data,
      },
    });

    return NextResponse.json({ data: post });
  }
}
