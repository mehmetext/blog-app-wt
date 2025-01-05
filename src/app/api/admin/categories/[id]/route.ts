import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();

  const slug = slugify(data.name, { lower: true, strict: true });

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug,
    },
  });

  return NextResponse.json({ data: category }, { status: 200 });
}
