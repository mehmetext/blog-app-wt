import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { refreshTokens } from "./actions";

export default async function middleware(req: NextRequest) {
  const cookieList = await cookies();
  const accessToken = cookieList.get("access-token");

  // Her zaman next() ile devam edecek olan rotalar
  if (
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/admin/login") ||
    req.nextUrl.pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Admin rotaları için özel kontrol
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  try {
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    // Access token'ı doğrula
    await jwtVerify(
      accessToken.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return NextResponse.next();
  } catch {
    // Token geçersiz veya expire olmuş, refresh token ile yenilemeyi dene
    const refreshToken = cookieList.get("refresh-token");

    if (!refreshToken) {
      // Eğer admin rotasıysa ve refresh token yoksa login'e yönlendir
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      // Admin rotası değilse devam et
      return NextResponse.next();
    }

    try {
      const tokens = await refreshTokens();
      const nextResponse = NextResponse.next();

      // Yeni tokenları set et
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
      // Refresh token da geçersizse ve admin rotasıysa login'e yönlendir
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      // Admin rotası değilse devam et
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
