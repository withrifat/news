import { NextResponse } from "next/server";
import { fetchCategoriesServer } from "@/lib/server-news";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchCategoriesServer();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
