import type { ReactNode } from "react";
import type { IndicatorResult } from "@/domain/types";

interface IndicatorCardProps<T> {
  title: string;
  result: IndicatorResult<T>;
  formatValue: (value: T) => ReactNode;
  explanation: string;
}

export function IndicatorCard<T>({
  title,
  result,
  formatValue,
  explanation,
}: IndicatorCardProps<T>) {
  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-medium text-slate-500">{title}</h3>

      {result.status === "valido" ? (
        <p className="mb-3 text-xl font-semibold text-slate-900">
          {formatValue(result.value)}
        </p>
      ) : (
        <div className="mb-3">
          <p className="text-base font-medium text-slate-400">
            {result.status === "no_aplica" ? "No aplica" : "No alcanzable"}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{result.reason}</p>
        </div>
      )}

      <details className="mt-auto text-xs">
        <summary className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-800">
          ¿Qué es esto?
        </summary>
        <p className="mt-1 leading-relaxed text-slate-600">{explanation}</p>
      </details>
    </article>
  );
}
