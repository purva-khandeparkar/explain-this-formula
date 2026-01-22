import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { formula } = await req.json();

    if (!formula) {
      return Response.json(
        { error: "Formula is required" },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
                You are a JSON API.

                Explain the following formula.

                Formula:
                ${formula}

                Return ONLY a valid JSON object in the following format:

                {
                  "explanation": {
                    "description": "short plain English summary",
                    "function": "what the formula does",
                    "inputs": "what cells or values it depends on",
                    "result": "what the final result represents"
                  }
                }

                Rules:
                - Do not include markdown
                - Do not include backticks
                - Do not include any text outside JSON
                - Values must be strings
                `,
            },
          ],
        },
      ],
    });

    const raw: unknown = response?.text;

    let parsed: unknown;

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

    return Response.json(parsed);

  } catch (error) {
    console.error("Gemini error:", error);
    return Response.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
