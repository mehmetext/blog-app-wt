import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { name } = data;

  const slug = slugify(name, { lower: true, strict: true });

  const category = await prisma.category.create({
    data: {
      name,
      slug,
    },
  });

  return NextResponse.json({ data: category }, { status: 201 });
}

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { posts: true } },
    },
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ data: categories });
}
