import prisma from "@/lib/prisma";
import { wait } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const comment = await req.json();
  const { content, authorName, postId } = comment;

  console.log(content, authorName, postId);

  const newComment = await prisma.comment.create({
    data: {
      content,
      authorName,
      postId,
    },
  });

  await wait(500);

  return NextResponse.json({ data: newComment }, { status: 201 });
}
