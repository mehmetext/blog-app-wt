import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.headers.get("Authorization")?.split(" ")[1];

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { payload } = await jwtVerify(
    accessToken,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  return NextResponse.json({ data: user });
}
