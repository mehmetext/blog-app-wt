import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "invalid-credentials" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "invalid-credentials" }, { status: 401 });
  }

  const isPasswordValid = await compare(password, user.hashedPassword);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "invalid-credentials" }, { status: 401 });
  }

  const accessToken = "example-access-token";
  const refreshToken = "example-refresh-token";

  return NextResponse.json({
    data: { accessToken, refreshToken },
  });
}
