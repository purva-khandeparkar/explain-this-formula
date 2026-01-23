import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function generateSlug() {
  return Math.random().toString(36).substring(2, 8);
}

export async function POST(req: Request) {
  try {
    const { context } = await req.json();

    if (!context) {
      return Response.json({ error: "Context is required" }, { status: 400 });
    }

    const {
      selectionText,
      srcUrl,
      pageUrl,
      frameUrl,
      mediaType,
    } = context;

    let parts: any[] = [];

    // 🟢 IMAGE CONTEXT
    if (srcUrl && mediaType === "image") {
      const imageRes = await fetch(srcUrl);
      if (!imageRes.ok) {
        return Response.json(
          { error: "Failed to fetch image" },
          { status: 500 }
        );
      }

      const buffer = await imageRes.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType =
        imageRes.headers.get("content-type") || "image/svg+xml";

      parts.push(
        {
          inlineData: {
            mimeType,
            data: base64,
          },
        },
        {
          text: `
You are a JSON API.

An image of a mathematical formula is provided.
The image comes from this page:
${pageUrl || "unknown"}

Return ONLY a valid JSON object in the following format:

{
  "explanation": {
    "description": "short plain English summary",
    "function": "what the formula does",
    "inputs": "what variables or values it depends on",
    "result": "what the final result represents"
  }
}

Rules:
- Do not include markdown
- Do not include backticks
- Do not include any text outside JSON
- All values must be strings
          `,
        }
      );
    }

    // 🟢 TEXT CONTEXT
    else if (selectionText) {
      parts.push({
        text: `
You are a JSON API.

Explain the following formula or text:

${selectionText}

Return ONLY a valid JSON object in the following format:

{
  "explanation": {
    "description": "short plain English summary",
    "function": "what the formula does",
    "inputs": "what variables or values it depends on",
    "result": "what the final result represents"
  }
}

Rules:
- Do not include markdown
- Do not include backticks
- Do not include any text outside JSON
- All values must be strings
        `,
      });
    } else {
      return Response.json(
        { error: "No usable text or image found" },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts,
        },
      ],
    });

    const dummyResponse = {
      text: {
        "explanation": {
          "description": "Evaluates a condition and returns different text values based on the result.",
          "function": "Checks whether the value in cell C2 is greater than 100 and chooses an output accordingly.",
          "inputs": "The value in cell C2 and the fixed text values \"High\" and \"Low\".",
          "result": "Either the text \"High\" if the condition is true or \"Low\" if the condition is false."
        }
      }
    }

    const raw: unknown = dummyResponse.text; //response?.text;
    let parsed: unknown;

    // 🛡️ Defensive parsing (same as your existing API)
    if (typeof raw === "string") {
      try {
        parsed = JSON.parse(raw.trim());
      } catch (err) {
        console.error("Invalid JSON from Gemini:", raw);
        return Response.json(
          { error: "AI returned invalid JSON" },
          { status: 500 }
        );
      }
    } else if (typeof raw === "object" && raw !== null) {
      parsed = raw;
    } else {
      return Response.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("explanation" in parsed)
    ) {
      return Response.json(
        { error: "Malformed AI response" },
        { status: 500 }
      );
    }

    const slug = generateSlug();

    await supabase.from("formula_explanations").insert([
      {
        slug,
        formula: selectionText || srcUrl,
        explanation: (parsed as any).explanation,
      },
    ]);

    return Response.json({ ...(parsed as object), slug });

  } catch (error) {
    console.error("Explain-context error:", error);
    return Response.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
