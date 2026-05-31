import { NextResponse } from "next/server";
import { hermesSystemPrompt } from "@/lib/hermesPersonality";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { message?: string; apiKeyOverride?: string };
    const apiKey = body.apiKeyOverride || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

    if (!apiKey || !body.message) {
      return NextResponse.json({ error: "Missing message or API key" }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3003",
        "X-Title": "James AI Operator Dashboard"
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4",
        max_tokens: 1000,
        messages: [
          { role: "system", content: hermesSystemPrompt },
          { role: "user", content: body.message }
        ]
      })
    });

    if (!response.ok) {
      return NextResponse.json({ error: "OpenRouter chat failed" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ reply: data?.choices?.[0]?.message?.content ?? "" });
  } catch {
    return NextResponse.json({ error: "Hermes chat failed" }, { status: 500 });
  }
}
