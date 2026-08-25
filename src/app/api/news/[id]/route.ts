import { NextRequest, NextResponse } from "next/server";
import { fetchArticleDetailServer } from "@/lib/server-news";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await fetchArticleDetailServer(id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || `Failed to fetch news article ${params.id}`,
      },
      { status: 500 }
    );
  }
}
