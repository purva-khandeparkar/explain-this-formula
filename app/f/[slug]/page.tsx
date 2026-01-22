import { supabase } from "@/lib/supabase";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FormulaPage({ params }: PageProps) {
  // ✅ unwrap params FIRST
  const { slug } = await params;

  const { data, error } = await supabase
    .from("formula_explanations")
    .select("formula, explanation")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return <p>Not found</p>;
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">
        Formula Explanation
      </h1>

      <pre className="bg-gray-100 p-3 mb-4">
        {data.formula}
      </pre>

      <div className="prose">
        {data.explanation}
      </div>
    </main>
  );
}
