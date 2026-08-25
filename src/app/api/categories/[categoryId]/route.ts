import { NextRequest, NextResponse } from "next/server";
import { fetchCategoryNewsServer } from "@/lib/server-news";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = params;
    const data = await fetchCategoryNewsServer(categoryId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || `Failed to fetch news for category ${params.categoryId}`,
      },
      { status: 500 }
    );
  }
}
