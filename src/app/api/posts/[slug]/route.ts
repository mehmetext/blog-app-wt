import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    include: {
      category: true,
      author: true,
      comments: true,
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
