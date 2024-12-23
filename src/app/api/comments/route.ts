import prisma from "@/lib/prisma";
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
