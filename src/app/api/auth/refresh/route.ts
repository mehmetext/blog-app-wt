import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh-token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(
      refreshToken,
      new TextEncoder().encode(process.env.JWT_REFRESH_SECRET)
    );

    const accessToken = await new SignJWT()
      .setSubject(payload.sub!)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const newRefreshToken = await new SignJWT()
      .setSubject(payload.sub!)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(process.env.JWT_REFRESH_SECRET));

    return NextResponse.json({
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
