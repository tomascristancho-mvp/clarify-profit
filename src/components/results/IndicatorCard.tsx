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
    <article className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h4>

      {result.status === "valido" ? (
        <p className="mb-3 text-2xl font-bold text-slate-900">
          {formatValue(result.value)}
        </p>
      ) : (
        <div className="mb-3">
          <p className="text-base font-semibold text-slate-400">
            {result.status === "no_aplica" ? "No aplica" : "No alcanzable"}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
            {result.reason}
          </p>
        </div>
      )}

      <details className="mt-auto text-xs">
        <summary className="cursor-pointer select-none font-medium text-indigo-600 transition-colors hover:text-indigo-800">
          ¿Qué es esto?
        </summary>
        <p className="mt-2 leading-relaxed text-slate-500">{explanation}</p>
      </details>
    </article>
  );
}
