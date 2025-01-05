import prisma from "@/lib/prisma";
import { Post } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  return NextResponse.json({
    data: post,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = (await request.json()) as Partial<Post>;

  if (data.isFeatured) {
    await prisma.post.updateMany({
      where: { isFeatured: true },
      data: { isFeatured: false },
    });
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...data,
    },
  });

  return NextResponse.json({
    data: post,
  });
}
