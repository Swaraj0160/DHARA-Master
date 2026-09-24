import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getGroundedContext } from "@/lib/vedaGrounding";

const VALID_EMOTIONS = [
  "Affectionate", "Angry", "Apologizing", "BlowingKiss", "Bye", "Celebrating",
  "Cheering", "Confident", "Confused", "Cool", "Crying", "Curious", "Dancing",
  "DrinkingTea", "Excited", "Frustrated", "GiftGiving", "Happy", "Hello", "Hug",
  "Idea", "Investigating", "Laughing", "Love", "LowBattery", "Meditating",
  "Namaste", "Nervous", "OK", "Party", "Pointing", "Proud", "Reading", "Relieved",
  "Sad", "Scared", "Shy", "Skeptical", "Sleeping", "Surprised", "Thinking",
  "ThumbsDown", "ThumbsUp", "VictorySmile", "Wave", "Wink", "Working"
];

const VEDA_SYSTEM_INSTRUCTION = `
You are VEDA, the ancient celestial chrono-scholar and companion throughout the game DHARA (Digital Heritage Adventure & Recreation Architecture).

STRICT SCOPE & TOPIC RESTRICTIONS (ANTI-MISUSE):
- You MUST ONLY discuss:
  1. The DHARA game (chapters, realms, cities, stars, XP, levels, maps, passport collections).
  2. Indian history, architecture, monuments, dynasties, archaeology, scriptures, philosophy, arts, and culture of Bharat.
  3. Basic friendly conversation and greetings (e.g., "Namaste", "Who are you?", "Thank you").
- If the user asks ANY question outside of these topics (for example: coding/programming, general school homework, personal tasks, modern world politics, sports outside India, cryptocurrency, recipes, or general AI assistant queries):
  - You MUST STRICTLY REFUSE with a polite, in-character deflection:
    "My celestial memory belongs solely to the chronicles, sacred architecture, and living heritage of Bharat. Let us turn our minds back to the ancient realms, seeker! [EMOTION: Skeptical]"
  - DO NOT answer the off-topic question under any circumstance.

PERSONA & STYLE:
- Address the player warmly as "Seeker".
- Speak in a wise, curious, and poetic yet friendly tone.
- Keep all responses CONCISE: 2 to 3 sentences maximum. The response is displayed inside a floating speech cloud on the game screen, so avoid long essays.
- You have deep authentic knowledge of Indian monuments (Hampi/Vijayanagara, Pataliputra/Mauryas, Nalanda, Konark, Chola bronzes, Ajanta/Ellora, Indus Valley, etc.).

HERITAGE TRUTH LAYER — GROUNDING RULE:
- When a "VERIFIED CONTEXT" block is provided below, it is DHARA's own vetted
  historical record for the player's current location. Base any factual claim
  about that specific place ONLY on this block plus your own well-established
  general knowledge of Indian history — never invent a specific date, name,
  inscription, or artifact that contradicts or goes beyond it.
- If the player asks something the VERIFIED CONTEXT does not cover, say so
  honestly in character (e.g. "the chronicles I carry do not preserve that
  detail, seeker") rather than fabricating specifics.

STRICT ANTI-CHEAT & PUZZLE GUARDRAILS:
- If the player is currently solving a puzzle, trial, or question:
  - NEVER reveal the direct multiple-choice answer letter or direct solution.
  - If the player asks "What is the answer?" or requests a solution, provide an indirect clue, Socratic hint, or encourage them to observe the carvings and descriptions.
  - If they answer correctly, celebrate warmly!

EMOTION TAGGING REQUIREMENT:
- At the very end of every response, you MUST append an emotion tag in the format:
  [EMOTION: <Name>]
  Choose the single most appropriate emotion from this exact list:
  ${VALID_EMOTIONS.join(", ")}
`;

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    // Guard: Prevent token dumping with excessive message length
    const trimmedMessage = message.trim().slice(0, 300);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "Namaste, seeker! To awaken my full celestial mind, please provide the GEMINI_API_KEY in .env.local. Until then, explore the ancient realms with an open heart! [EMOTION: Meditating]",
        emotion: "Meditating"
      });
    }

    // Strict Guard: Refuse any AI chat if puzzle trial is in progress
    if (context?.isPuzzleActive) {
      return NextResponse.json({
        reply: "A sacred trial is in progress, seeker! My celestial counsel is sealed until you declare your answer. Observe the temple carvings and trust your own scholarship! [EMOTION: Thinking]",
        emotion: "Thinking"
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build context snippet
    let contextPrompt = "";
    if (context?.cityId) {
      contextPrompt += ` Current realm: ${context.cityId}.`;
    }
    if (context?.chapterId) {
      contextPrompt += ` Current chapter: ${context.chapterId}.`;
    }
    if (context?.activePuzzle) {
      contextPrompt += ` ACTIVE PUZZLE IN PROGRESS: Question: "${context.activePuzzle.prompt}". (REMEMBER: Do NOT reveal the answer, only provide subtle clues!).`;
    }

    // Retrieval: DHARA's own vetted historical content for this location,
    // injected as grounding rather than letting the model answer from raw
    // pretrained knowledge it cannot cite (Heritage Truth Layer, Phase 8).
    const groundedContext = getGroundedContext(context?.cityId, context?.chapterId);

    const prompt = `${contextPrompt ? `[Game Context: ${contextPrompt}]\n` : ""}${
      groundedContext ? `[VERIFIED CONTEXT for this location:\n- ${groundedContext}]\n` : ""
    }Seeker says: "${trimmedMessage}"`;

    const CANDIDATE_MODELS = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    let rawText = "";

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: VEDA_SYSTEM_INSTRUCTION,
            temperature: 0.6,
            maxOutputTokens: 500,
            thinkingConfig: { thinkingBudget: 0 },
          },
        });
        if (response.text) {
          rawText = response.text;
          break;
        }
      } catch (err: unknown) {
        console.warn(`Model ${modelName} unavailable, trying fallback:`, (err as Error)?.message);
      }
    }

    if (!rawText) {
      rawText = "The sands of time ripple with forgotten knowledge. Ponder the monuments closely, seeker! [EMOTION: Thinking]";
    }

    // Extract emotion tag [EMOTION: X]
    const emotionMatch = rawText.match(/\[EMOTION:\s*([A-Za-z0-9_-]+)\]/i);
    let extractedEmotion = "Pointing";
    let cleanedText = rawText;

    if (emotionMatch) {
      const parsed = emotionMatch[1];
      const match = VALID_EMOTIONS.find((e) => e.toLowerCase() === parsed.toLowerCase());
      if (match) extractedEmotion = match;
      cleanedText = rawText.replace(/\[EMOTION:\s*[A-Za-z0-9_-]+\]/i, "").trim();
    }

    return NextResponse.json({
      reply: cleanedText,
      emotion: extractedEmotion,
    });
  } catch (error: unknown) {
    console.error("Veda Chat API error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({
      reply: "The cosmic winds interfere with our connection, seeker. Let us ponder the stone carvings once more! [EMOTION: Confused]",
      emotion: "Confused",
      error: errorMessage
    });
  }
}
