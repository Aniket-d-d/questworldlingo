import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { LingoDotDevEngine } from "@lingo.dev/_sdk";
import { SCHOLAR_CONFIGS } from "@/constants/scholars";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ kingdom: string }> },
) {
  try {
    const { kingdom } = await params;
    const { message, history, locale } = await request.json();

    const config = SCHOLAR_CONFIGS[kingdom];
    if (!config) {
      return NextResponse.json({ error: "Unknown kingdom" }, { status: 400 });
    }

    const systemPrompt = config.aiSystemPrompt ?? config.systemPrompt;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    // Build conversation history in Gemini format
    const geminiHistory = (history ?? []).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }),
    );

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);
    const fullText = result.response.text();

    // Extract difficulty level tag (only present in first response)
    const levelMatch = fullText.match(/\[LEVEL:([123])\]/);
    const suggestedLevel = levelMatch
      ? (parseInt(levelMatch[1]) as 1 | 2 | 3)
      : null;

    // Strip level tag before displaying
    let displayText = fullText.replace(/\[LEVEL:[0-3]\]\s*/g, "").trim();

    // Use Lingo.dev SDK to translate to selected app locale if non-English
    if (locale && locale !== "en") {
      try {
        const engine = new LingoDotDevEngine({
          apiKey: process.env.LINGODOTDEV_API_KEY!,
        });
        displayText = await engine.localizeText(displayText, {
          sourceLocale: null,
          targetLocale: locale,
          fast: true,
        });
      } catch {
        // Fall back to untranslated text on SDK error
      }
    }

    return NextResponse.json({ reply: displayText, suggestedLevel });
  } catch (err) {
    console.error("Scholar chat error:", err);
    return NextResponse.json(
      { error: "The scholar does not respond." },
      { status: 500 },
    );
  }
}
