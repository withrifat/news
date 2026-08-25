import { NextResponse } from "next/server";
import { fetchPopularNewsServer } from "@/lib/server-news";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchPopularNewsServer();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch popular news" },
      { status: 500 }
    );
  }
}
