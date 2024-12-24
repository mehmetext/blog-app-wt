import { generateTokens } from "@/lib/utils";
import { jwtVerify } from "jose";
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

    return NextResponse.json({
      data: { ...(await generateTokens(payload.sub!)) },
    });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
