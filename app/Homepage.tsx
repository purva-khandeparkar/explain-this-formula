"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Terminal,
  Info,
  FunctionSquare,
  ListTree,
  Sigma,
} from "lucide-react";

type Explanation = {
  description?: string;
  function?: string;
  inputs?: string;
  result?: string;
};

type Result = {
  explanation: Explanation | null;
  slug: string;
};

export default function Homepage() {
  const searchParams = useSearchParams();
  const prefilledFormula = searchParams.get("formula");

  const [formula, setFormula] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prefilledFormula) {
      setFormula(prefilledFormula);
    }
  }, [prefilledFormula]);

  async function explainFormula() {
    setLoading(true);
    setResult(null);

    const explainRes = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formula }),
    });

    if (!explainRes.ok) {
      console.error(await explainRes.text());
      setLoading(false);
      return;
    }

    const { explanation } = await explainRes.json();

    const saveRes = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formula, explanation }),
    });

    if (!saveRes.ok) {
      console.error(await saveRes.text());
      setLoading(false);
      return;
    }

    const { slug } = await saveRes.json();

    setResult({ explanation, slug });
    setLoading(false);
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/f/${result.slug}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 antialiased">
      <div className="w-full max-w-2xl bg-slate-800/40 border border-slate-700 rounded-3xl shadow-2xl backdrop-blur-md py-3 px-2 sm:p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-semibold text-white">
            Explain This Formula
          </h1>
        </div>

        {/* Input */}
        <div className="rounded-xl p-4 border border-slate-700 bg-slate-900/90 focus-within:border-emerald-400 transition-colors">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Terminal size={14} />
            <span className="text-[10px] uppercase font-bold">Editor</span>
          </div>

          <textarea
            className="w-full h-36 text-emerald-400 font-mono focus:outline-none"
            placeholder="Paste formula here..."
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
          />
        </div>

        <button
          onClick={explainFormula}
          disabled={!formula || loading}
          className="w-full mt-6 py-4 bg-emerald-600 disabled:bg-slate-700 text-white font-bold rounded-xl"
        >
          {loading ? "Analyzing..." : "Explain"}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-10 space-y-6">
            <div className="bg-slate-900/40 py-4 px-2 sm:p-5 rounded-2xl border border-slate-700 space-y-6">

              {result.explanation?.description && (
                <div className="flex gap-3">
                  <Info className="w-4 h-4 mt-1 text-emerald-400 shrink-0" />
                  <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                    {result.explanation.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    key: "function",
                    label: "Function",
                    icon: <FunctionSquare className="w-4 h-4 text-cyan-400" />,
                    value: result.explanation?.function,
                  },
                  {
                    key: "inputs",
                    label: "Inputs",
                    icon: <ListTree className="w-4 h-4 text-violet-400" />,
                    value: result.explanation?.inputs,
                  },
                  {
                    key: "result",
                    label: "Result",
                    icon: <Sigma className="w-4 h-4 text-emerald-400" />,
                    value: result.explanation?.result,
                  },
                ]
                  .filter((item) => Boolean(item.value))
                  .map((item) => (
                    <div
                      key={item.key}
                      className="bg-slate-950/70 p-4 rounded-xl border border-slate-700/60"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {item.icon}
                        <h4 className="text-xs uppercase tracking-widest font-mono text-slate-400">
                          {item.label}
                        </h4>
                      </div>

                      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                        {item.value}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Share link */}
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700 p-2 rounded-xl">
              <span className="text-xs text-slate-400 font-mono truncate">
                {window.location.origin}/f/{result.slug}
              </span>

              <button
                onClick={handleCopy}
                className="ml-auto flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <Copy size={14} />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
