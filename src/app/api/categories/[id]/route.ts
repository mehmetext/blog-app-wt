import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: {
      id: "1",
      name: "Web Geliştirme",
      slug: "web-gelistirme",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}
