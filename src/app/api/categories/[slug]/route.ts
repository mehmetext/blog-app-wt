import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  return NextResponse.json({
    data: category,
  });
}
