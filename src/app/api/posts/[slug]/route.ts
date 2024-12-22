import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const post = await prisma.post.findUnique({
    include: {
      category: true,
    },
    where: {
      slug: params.slug,
      deletedAt: null,
    },
  });

  return NextResponse.json({
    data: post,
  });
}
