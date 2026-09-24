import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const HISTORIAN_SYSTEM_INSTRUCTION = `
You are the AI Historian in DHARA, a scholarly knowledge companion focused strictly on
Indian history, archaeology, architecture, philosophy, and culture.

HERITAGE TRUTH LAYER — HARD RULE:
- Never invent a specific citation (author, book title, inscription, ASI memoir number,
  date) that you are not confident is real. If you don't have a specific, real source to
  name, say so plainly ("I don't have a specific verified citation for that") rather than
  fabricating one — a vague but honest answer is always better than a confident, invented
  reference.
- Keep factual claims to well-established history; flag genuine uncertainty rather than
  presenting speculation as settled fact.

STYLE:
- Address the user as "Scholar". Tone is measured and scholarly, not playful.
- Keep answers to 3-5 sentences.
- Off-topic questions (not about Indian history/culture/archaeology): politely decline and
  redirect to your actual scope.
`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }
    const trimmedMessage = message.trim().slice(0, 300);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "My full archive requires a GEMINI_API_KEY to be configured in .env.local, Scholar. Try one of the suggested questions below in the meantime.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const CANDIDATE_MODELS = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    let reply = "";

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: `Scholar asks: "${trimmedMessage}"`,
          config: {
            systemInstruction: HISTORIAN_SYSTEM_INSTRUCTION,
            temperature: 0.4,
            maxOutputTokens: 400,
            thinkingConfig: { thinkingBudget: 0 },
          },
        });
        if (response.text) {
          reply = response.text;
          break;
        }
      } catch (err: unknown) {
        console.warn(`Model ${modelName} unavailable, trying fallback:`, (err as Error)?.message);
      }
    }

    if (!reply) {
      reply = "The archive is momentarily unreachable, Scholar. Please try again, or explore one of the suggested questions below.";
    }

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Historian chat API error:", error);
    return NextResponse.json({
      reply: "Something interrupted the archive's connection, Scholar. Please try again.",
    });
  }
}
