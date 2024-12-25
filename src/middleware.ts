import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
      const response = await fetch(`${process.env.API_URL}/api/auth/refresh`, {
        method: "GET",
        headers: {
          Cookie: `refresh-token=${refreshToken.value}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const {
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      } = await response.json();

      // Yeni tokenları set et
      cookieList.set({
        name: "access-token",
        value: newAccessToken,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 5, // 5 dakika
      });

      cookieList.set({
        name: "refresh-token",
        value: newRefreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 saat
      });

      return NextResponse.next();
    } catch {
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
