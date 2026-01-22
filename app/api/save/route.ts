import { supabase } from "@/lib/supabase";

function generateSlug() {
  return Math.random().toString(36).substring(2, 8);
}

export async function POST(req: Request) {
  const { formula, explanation } = await req.json();

  const slug = generateSlug();

  const { error } = await supabase
    .from("formula_explanations")
    .insert([{ slug, formula, explanation }]);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ slug });
}
