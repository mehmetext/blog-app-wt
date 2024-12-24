import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { SignJWT } from "jose";
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

  const accessToken = await new SignJWT()
    .setSubject(user.id)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  const refreshToken = await new SignJWT()
    .setSubject(user.id)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.JWT_REFRESH_SECRET));

  return NextResponse.json({
    data: { accessToken, refreshToken },
  });
}
