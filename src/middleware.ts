import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { refreshTokens } from "./actions";

export default async function middleware(req: NextRequest) {
  const cookieList = await cookies();
  const accessToken = cookieList.get("access-token");

  // Routes that will always continue with next()
  if (
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/admin/login") ||
    req.nextUrl.pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Special check for admin routes
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  try {
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    // Validate access token
    // Access token'ı doğrula
    await jwtVerify(
      accessToken.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return NextResponse.next();
  } catch {
    // Token is invalid or expired, try to refresh with refresh token
    const refreshToken = cookieList.get("refresh-token");

    if (!refreshToken) {
      // If it's an admin route and there's no refresh token, redirect to login
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      // If it's not an admin route, continue
      return NextResponse.next();
    }

    try {
      const tokens = await refreshTokens();
      const nextResponse = NextResponse.next();

      // Set new tokens
      nextResponse.cookies.set({
        name: "access-token",
        value: tokens.accessToken,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 15, // 15 minutes
      });

      nextResponse.cookies.set({
        name: "refresh-token",
        value: tokens.refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return nextResponse;
    } catch {
      cookieList.delete("refresh-token");
      cookieList.delete("access-token");
      // If refresh token is also invalid and it's an admin route, redirect to login
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      // If it's not an admin route, continue
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
