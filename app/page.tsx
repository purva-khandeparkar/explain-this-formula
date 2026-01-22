"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [formula, setFormula] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    explanation: string;
    slug: string;
  }>(null);

  const searchParams = useSearchParams();
    const prefilledFormula = searchParams.get("formula");

    if (prefilledFormula) {
      setFormula(prefilledFormula);
    }

  async function explainFormula() {
  setLoading(true);
  setResult(null);

  const explainRes = await fetch("/api/explain", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ formula }),
  });

  if (!explainRes.ok) {
    const text = await explainRes.text();
    console.error("Explain API failed:", text);
    setLoading(false);
    return;
  }

  const { explanation } = await explainRes.json();

  const saveRes = await fetch("/api/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ formula, explanation }),
  });

  if (!saveRes.ok) {
    const text = await saveRes.text();
    console.error("Save API failed:", text);
    setLoading(false);
    return;
  }

  const { slug } = await saveRes.json();

  setResult({ explanation, slug });
  setLoading(false);
}


  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Explain Spreadsheet Formula
      </h1>

      <textarea
        className="w-full border p-3 font-mono"
        rows={4}
        placeholder="Paste formula here (e.g. =IF(A1>10,SUM(B1:B5),0))"
        value={formula}
        onChange={(e) => setFormula(e.target.value)}
      />

      <button
        onClick={explainFormula}
        disabled={!formula || loading}
        className="mt-4 px-4 py-2 bg-black text-white"
      >
        {loading ? "Explaining..." : "Explain"}
      </button>

      {result && (
        <div className="mt-6">
          <p className="mb-2">{result.explanation}</p>

          <input
            readOnly
            className="w-full border p-2"
            value={`${window.location.origin}/f/${result.slug}`}
          />
        </div>
      )}
    </main>
  );
}
