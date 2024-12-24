import { clsx, type ClassValue } from "clsx";
import { SignJWT } from "jose";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wait(ms: number = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateTokens(userId: string) {
  const accessToken = await new SignJWT()
    .setSubject(userId)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  const refreshToken = await new SignJWT()
    .setSubject(userId)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.JWT_REFRESH_SECRET));

  return { accessToken, refreshToken };
}
