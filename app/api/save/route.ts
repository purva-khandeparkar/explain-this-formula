import { supabase } from "@/lib/supabase";

function generateSlug() {
  return Math.random().toString(36).substring(2, 8);
}

export async function POST(req: Request) {
  try {
    const { formula, explanation } = await req.json();

    if (!formula || !explanation || typeof explanation !== "object") {
      return Response.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const slug = generateSlug();

    const { error } = await supabase
      .from("formula_explanations")
      .insert([
        {
          slug,
          formula,
          explanation,
        },
      ]);

    if (error) {
      console.error("Save error:", error);
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ slug });
  } catch (err) {
    console.error("Save API error:", err);
    return Response.json(
      { error: "Failed to save explanation" },
      { status: 500 }
    );
  }
}
