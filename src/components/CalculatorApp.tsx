"use client";

import { useCalculatorState } from "@/hooks/useCalculatorState";
import { CalculatorForm } from "@/components/form/CalculatorForm";
import { ResultsSummary } from "@/components/results/ResultsSummary";
import { IndicatorsGrid } from "@/components/results/IndicatorsGrid";
import { InterpretationMessages } from "@/components/results/InterpretationMessages";
import { ScenariosComparison } from "@/components/scenarios/ScenariosComparison";
import { ConceptExplanations } from "@/components/shared/ConceptExplanations";
import { MethodologyNote } from "@/components/shared/MethodologyNote";
import { ExecutiveDiagnosis } from "@/components/results/ExecutiveDiagnosis";
import { WhatIfSimulator } from "@/components/results/WhatIfSimulator";
import { ReverseCalculator } from "@/components/results/ReverseCalculator";
import { ExecutiveReportTeaser } from "@/components/conversion/ExecutiveReportTeaser";
import { ReportMiniCta } from "@/components/conversion/ReportMiniCta";

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
    <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Announcement region for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {results
          ? "Cálculo completado. Revisa los resultados a continuación."
          : ""}
      </div>

      <div className="flex flex-col gap-8">
        {/* Form — centered and width-capped so it doesn't stretch too wide */}
        <section
          id="form-section"
          aria-labelledby="form-heading"
          className="mx-auto w-full max-w-4xl"
        >
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
          <div className="animate-fade-in-up flex flex-col gap-6">
            {/* ── Top dashboard: resultado principal + veredicto ────────────────
                Side by side on lg+, stacked on mobile.                         */}
            <div className="grid gap-6 lg:grid-cols-2">
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
                  riskLevel={results.diagnosis.riskLevel}
                  breakevenMinUnits={
                    results.calculation.breakevenUnits.status === "valido"
                      ? results.calculation.breakevenUnits.value.minimumWholeUnits
                      : null
                  }
                />
              </section>

              <ExecutiveDiagnosis diagnosis={results.diagnosis} />
            </div>

            {/* ── Mini CTA: reporte premium — aparece antes de los indicadores ── */}
            <ReportMiniCta />

            {/* ── Remaining sections ── */}
            <IndicatorsGrid
              result={results.calculation}
              currency={results.validatedInputs.currency}
            />

            <WhatIfSimulator
              simulations={results.simulations}
              currency={results.validatedInputs.currency}
            />

            <ReverseCalculator
              calculation={results.calculation}
              validatedInputs={results.validatedInputs}
            />

            <InterpretationMessages messages={results.interpretations} />

            <ScenariosComparison
              scenarios={results.scenarios}
              currency={results.validatedInputs.currency}
            />

            <ExecutiveReportTeaser
              businessName={results.validatedInputs.businessName}
            />

            <MethodologyNote />

            <ConceptExplanations />
          </div>
        )}
      </div>
    </main>
  );
}
