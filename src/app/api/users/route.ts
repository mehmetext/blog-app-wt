import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          Post: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    },
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ data: users });
}
