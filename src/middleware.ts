import { jwtVerify } from "jose";
import { NextConfig } from "next";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  // check if path is admin
  if (
    req.nextUrl.pathname.startsWith("/admin") &&
    !req.nextUrl.pathname.startsWith("/admin/login")
  ) {
    const cookieList = await cookies();
    const accessToken = cookieList.get("access-token");

    try {
      if (!accessToken) {
        // if access token is not found
        throw new Error("Access token not found");
      }

      // verify access token
      await jwtVerify(
        accessToken.value,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );

      return NextResponse.next();
    } catch {
      // if access token is invalid
      // try to refresh access token
      const refreshToken = cookieList.get("refresh-token");

      if (!refreshToken) {
        // if refresh token is not found
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      const response = await fetch(`${process.env.API_URL}/api/auth/refresh`, {
        method: "GET",
        headers: {
          Cookie: `refresh-token=${refreshToken.value}`,
        },
      });

      if (!response.ok) {
        // if refresh token is invalid
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      const {
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      } = await response.json();

      cookieList.set({
        name: "access-token",
        value: newAccessToken,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 5, // 5 minutes
      });

      cookieList.set({
        name: "refresh-token",
        value: newRefreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 hour
      });

      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config: NextConfig = {
  matcher: ["/admin/:path*"],
};
