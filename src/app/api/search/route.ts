import { NextRequest, NextResponse } from "next/server";
import { searchNewsServer } from "@/lib/server-news";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("query") || "";
    const data = await searchNewsServer(query);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to search news",
      },
      { status: 500 }
    );
  }
}
