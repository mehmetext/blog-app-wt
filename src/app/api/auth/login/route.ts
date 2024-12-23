import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  console.log(email, password);

  return NextResponse.json({
    data: { accessToken: "123" },
  });
}
