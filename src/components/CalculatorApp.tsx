"use client";

import { useCalculatorState } from "@/hooks/useCalculatorState";
import { CalculatorForm } from "@/components/form/CalculatorForm";
import { ResultsSummary } from "@/components/results/ResultsSummary";
import { IndicatorsGrid } from "@/components/results/IndicatorsGrid";
import { InterpretationMessages } from "@/components/results/InterpretationMessages";
import { ScenariosComparison } from "@/components/scenarios/ScenariosComparison";
import { ConceptExplanations } from "@/components/shared/ConceptExplanations";

export function CalculatorApp() {
  const {
    inputs,
    errors,
    results,
    handleChange,
    handleCalculate,
    handleLoadExample,
    handleReset,
  } = useCalculatorState();

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Announcement region for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {results
          ? "Cálculo completado. Revisa los resultados a continuación."
          : ""}
      </div>

      <div className="flex flex-col gap-10">
        {/* Introduction */}
        <section aria-labelledby="intro-heading">
          <h2
            id="intro-heading"
            className="mb-2 text-xl font-semibold text-slate-800"
          >
            ¿Qué calcula esta herramienta?
          </h2>
          <p className="leading-relaxed text-slate-600">
            Ingresa los datos básicos de tu negocio para estimar tus ingresos,
            costos, utilidad, punto de equilibrio y el tiempo aproximado para
            recuperar tu inversión. No necesitas conocimientos de contabilidad.
            Puedes usar el botón{" "}
            <strong className="font-medium text-slate-800">Cargar ejemplo</strong>{" "}
            para ver cómo funciona con una cafetería de referencia.
          </p>
        </section>

        {/* Form */}
        <section aria-labelledby="form-heading">
          <h2
            id="form-heading"
            className="mb-4 text-xl font-semibold text-slate-800"
          >
            Datos del negocio
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <CalculatorForm
              inputs={inputs}
              errors={errors}
              onChange={handleChange}
              onCalculate={handleCalculate}
              onLoadExample={handleLoadExample}
              onReset={handleReset}
            />
          </div>
        </section>

        {/* Results — rendered only after a successful calculation */}
        {results && (
          <div className="flex flex-col gap-8">
            <section aria-labelledby="results-heading">
              <h2
                id="results-heading"
                className="mb-4 text-xl font-semibold text-slate-800"
              >
                Resultado principal
                {results.validatedInputs.businessName && (
                  <span className="ml-1 text-base font-normal text-slate-500">
                    {" — "}{results.validatedInputs.businessName}
                  </span>
                )}
              </h2>
              <ResultsSummary
                operatingProfit={results.calculation.operatingProfit}
                currency={results.validatedInputs.currency}
              />
            </section>

            <IndicatorsGrid
              result={results.calculation}
              currency={results.validatedInputs.currency}
            />

            <InterpretationMessages messages={results.interpretations} />

            <ScenariosComparison
              scenarios={results.scenarios}
              currency={results.validatedInputs.currency}
            />

            <ConceptExplanations />
          </div>
        )}
      </div>
    </main>
  );
}
