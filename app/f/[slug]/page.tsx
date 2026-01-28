import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Sparkles,
  Info,
  FunctionSquare,
  ListTree,
  Sigma,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: { from?: string };
};

export default async function FormulaPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const fromExtension = searchParams?.from === "extension";

  const { data, error } = await supabase
    .from("formula_explanations")
    .select("formula, explanation")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-400">
        Not found
      </div>
    );
  }

  const explanation = data.explanation as {
    description?: string;
    function?: string;
    inputs?: string;
    result?: string;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 antialiased">
      <div className="w-full max-w-2xl bg-slate-800/40 border border-slate-700 rounded-3xl shadow-2xl backdrop-blur-md py-3 px-2 sm:p-8">

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-semibold text-white">
            Formula Explanation
          </h1>
        </div>

        {/* Formula */}
        <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 font-mono text-emerald-400 text-sm mb-8 wrap-break-word">
          {data.formula}
        </div>

        {/* Explanation */}
        <div className="bg-slate-900/40 py-4 px-2 sm:p-5 rounded-2xl border border-slate-700 space-y-6">

          {/* Description */}
          {explanation?.description && (
            <div className="flex gap-3">
              <Info className="w-4 h-4 mt-1 text-emerald-400 shrink-0" />
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {explanation.description}
              </p>
            </div>
          )}

          {/* Detail cards Start*/}
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                key: "function",
                label: "Function",
                icon: <FunctionSquare className="w-4 h-4 text-cyan-400" />,
                value: explanation?.function,
              },
              {
                key: "inputs",
                label: "Inputs",
                icon: <ListTree className="w-4 h-4 text-violet-400" />,
                value: explanation?.inputs,
              },
              {
                key: "result",
                label: "Result",
                icon: <Sigma className="w-4 h-4 text-emerald-400" />,
                value: explanation?.result,
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

        <Link
          href="/"
          className="mt-10 flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors"
        >
          <ArrowLeft size={16} />
          Explain another formula
        </Link>

        {fromExtension && (
          <Link
            href={`/f/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors"
          >
            <ExternalLink size={14} />
            Open in new tab
          </Link>
        )}
      </div>
    </div>
  );
}
