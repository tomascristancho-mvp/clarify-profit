"use client";

import { useState } from "react";
import type { CalculationResult, ValidatedInputs } from "@/domain/types";
import { calcularMetaUtilidad } from "@/domain/reverseCalculator";
import { formatCurrency } from "@/format/currency";

interface ReverseCalculatorProps {
  calculation: CalculationResult;
  validatedInputs: ValidatedInputs;
}

function parseTargetInput(raw: string): { value: number; error: string | null } | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;

  // Strip common thousands separators (dots and commas), then parse as integer
  const digits = trimmed.replace(/[\s.,]/g, "");
  if (!/^\d+$/.test(digits)) {
    return { value: NaN, error: "Ingresa un número válido (solo dígitos)." };
  }
  const value = parseInt(digits, 10);
  if (value < 0) {
    return { value, error: "La meta debe ser un valor positivo o cero." };
  }
  return { value, error: null };
}

export function ReverseCalculator({ calculation, validatedInputs }: ReverseCalculatorProps) {
  const [rawInput, setRawInput] = useState("");

  const { currency, fixedCosts, pricePerUnit } = validatedInputs;
  const { contributionMarginPerUnit } = calculation;

  const parsed = parseTargetInput(rawInput);
  const hasInput = rawInput.trim() !== "";
  const inputError = parsed?.error ?? null;
  const targetProfit = parsed !== null && parsed.error === null ? parsed.value : null;

  const result =
    targetProfit !== null
      ? calcularMetaUtilidad(targetProfit, contributionMarginPerUnit, fixedCosts, pricePerUnit)
      : null;

  return (
    <section aria-labelledby="reverse-heading">
      <h3 id="reverse-heading" className="mb-1 text-lg font-semibold text-slate-800">
        Calculadora inversa
      </h3>
      <p className="mb-4 text-sm text-slate-500">
        Define una meta de utilidad mensual y descubre cuánto necesitas vender para alcanzarla.
      </p>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* Input field */}
        <div className="mb-5">
          <label htmlFor="target-profit" className="mb-1 block text-sm font-medium text-slate-700">
            Quiero ganar al mes
          </label>
          <input
            id="target-profit"
            type="text"
            inputMode="numeric"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:max-w-xs"
            placeholder="Ej: 500000"
            aria-describedby="reverse-desc"
          />
          <div id="reverse-desc" className="mt-1 min-h-[1.25rem]">
            {inputError ? (
              <p role="alert" className="text-xs text-red-600">
                {inputError}
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Ingresa el valor en {currency}. Usa 0 para calcular el punto de equilibrio.
              </p>
            )}
          </div>
        </div>

        {/* Empty state */}
        {!hasInput && (
          <p className="text-sm text-slate-400">
            Ingresa una meta para ver qué necesitas vender.
          </p>
        )}

        {/* No alcanzable */}
        {result !== null && result.status === "no_alcanzable" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="flex items-start gap-2 text-sm text-red-700">
              <span aria-hidden="true" className="mt-0.5 flex-shrink-0 font-bold">
                ✕
              </span>
              <span>
                <span className="font-semibold">Meta no alcanzable con estos datos. </span>
                {result.reason}
              </span>
            </p>
          </div>
        )}

        {/* Alcanzable */}
        {result !== null && result.status === "alcanzable" && targetProfit !== null && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-indigo-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-400">
                  Unidades necesarias
                </p>
                <p className="text-2xl font-bold text-indigo-800">
                  {result.unitsNeeded.toLocaleString("es-CO")}
                </p>
                <p className="mt-1 text-xs text-indigo-600">unidades al mes</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Ventas necesarias
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatCurrency(result.revenueNeeded, currency)}
                </p>
                <p className="mt-1 text-xs text-slate-500">en ingresos al mes</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600">
              {targetProfit === 0
                ? `Para cubrir todos tus costos sin ganar ni perder (punto de equilibrio) necesitas vender al menos ${result.unitsNeeded.toLocaleString("es-CO")} unidades al mes.`
                : `Para alcanzar una utilidad de ${formatCurrency(targetProfit, currency)} al mes necesitas vender al menos ${result.unitsNeeded.toLocaleString("es-CO")} unidades, lo que equivale a ingresos de ${formatCurrency(result.revenueNeeded, currency)}.`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
