import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? "";
  return NextResponse.json({
    openRouterConfigured: Boolean(apiKey)
  });
}
