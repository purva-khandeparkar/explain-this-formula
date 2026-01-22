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
                Explain this spreadsheet formula in plain English.

                Formula:
                ${formula}

                Explain:
                - What it does
                - What inputs it depends on
                - What the result means

                Keep it concise and clear.
                `,
            },
          ],
        },
      ],
    });

    return Response.json({
      explanation: response.text,
    });
  } catch (error) {
    console.error("Gemini error:", error);
    return Response.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
