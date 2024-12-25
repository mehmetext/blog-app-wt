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
      const refreshStatus = await refreshTokens();

      if (!refreshStatus) {
        throw new Error("Failed to refresh token");
      }

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
