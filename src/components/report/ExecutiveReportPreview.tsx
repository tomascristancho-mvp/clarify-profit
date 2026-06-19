import type { ValidatedInputs, CalculationResult } from "@/domain/types";
import type { DiagnosisResult, RiskLevel } from "@/domain/diagnosis";
import type { WhatIfSimulation } from "@/domain/whatIf";
import { formatCurrency } from "@/format/currency";
import { formatPercentage } from "@/format/percentage";
import { buildWhatsAppReportUrl } from "@/components/conversion/whatsappReportUrl";
import {
  getMostDangerousVariable,
  getWeeklyBreakevenTarget,
} from "@/components/report/reportInsights";

interface ExecutiveReportPreviewProps {
  validatedInputs: ValidatedInputs;
  calculation: CalculationResult;
  diagnosis: DiagnosisResult;
  simulations: WhatIfSimulation[];
}

const RISK_STYLE: Record<
  RiskLevel,
  { border: string; badge: string; label: string }
> = {
  bajo: { border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-800", label: "Bajo riesgo" },
  medio: { border: "border-amber-200", badge: "bg-amber-100 text-amber-800", label: "Riesgo moderado" },
  alto: { border: "border-orange-200", badge: "bg-orange-100 text-orange-800", label: "Riesgo alto" },
  no_viable: { border: "border-red-200", badge: "bg-red-100 text-red-800", label: "No viable" },
};

// ── Locked section ───────────────────────────────────────────────────────────

function LockedSection({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      {/* Placeholder bars — blurred, not readable */}
      <div
        className="pointer-events-none select-none space-y-1.5 p-3 opacity-20 blur-sm"
        aria-hidden="true"
      >
        {["w-full", "w-4/5", "w-3/5"].map((w, i) => (
          <div key={i} className={`h-2 rounded-full bg-slate-500 ${w}`} />
        ))}
      </div>
      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-slate-50/90 p-3 text-center">
        <p className="text-[11px] font-bold leading-tight text-slate-700">{title}</p>
        <p className="text-[10px] leading-tight text-slate-500">{hint}</p>
        <span className="mt-0.5 text-[10px] font-semibold text-indigo-600">
          Solo en el reporte completo
        </span>
      </div>
    </div>
  );
}

// ── WhatsApp icon ────────────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.862L0 24l6.29-1.508A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.373l-.36-.214-3.733.895.947-3.64-.235-.374A9.818 9.818 0 1112 21.818z" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ExecutiveReportPreview({
  validatedInputs,
  calculation,
  diagnosis,
  simulations,
}: ExecutiveReportPreviewProps) {
  const riskStyle = RISK_STYLE[diagnosis.riskLevel];
  const whatsappUrl = buildWhatsAppReportUrl(validatedInputs.businessName);
  const mostDangerous = getMostDangerousVariable(simulations);

  const breakevenMinUnits =
    calculation.breakevenUnits.status === "valido"
      ? calculation.breakevenUnits.value.minimumWholeUnits
      : null;
  const weeklyTarget =
    breakevenMinUnits !== null ? getWeeklyBreakevenTarget(breakevenMinUnits) : null;

  const today = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const profit = calculation.operatingProfit;
  const isLoss = profit < 0;

  return (
    // id="reporte-ejecutivo" inherited from ExecutiveReportTeaser — keeps ReportMiniCta link working
    <section id="reporte-ejecutivo" aria-labelledby="report-preview-heading">
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="bg-slate-900 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3
              id="report-preview-heading"
              className="text-sm font-bold tracking-tight text-white"
            >
              {validatedInputs.businessName
                ? `Reporte — ${validatedInputs.businessName}`
                : "Reporte ejecutivo premium"}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-indigo-500/25 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 ring-1 ring-indigo-400/30">
                Vista previa
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60 ring-1 ring-white/15">
                Piloto
              </span>
            </div>
          </div>
          <p className="mt-0.5 text-[10px] text-slate-500">{today}</p>
        </div>

        {/* ── Métricas clave ──────────────────────────────────────── */}
        <div className="border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Métricas clave
          </p>
          <div className="grid grid-cols-3 gap-2">

            {/* Utilidad / Pérdida */}
            <div className="min-w-0">
              <p className="mb-0.5 text-[10px] leading-tight text-slate-500">
                Utilidad mensual
              </p>
              <p
                className={`truncate text-sm font-bold tracking-tight sm:text-base ${
                  isLoss
                    ? "text-red-700"
                    : profit === 0
                    ? "text-slate-700"
                    : "text-emerald-700"
                }`}
              >
                {isLoss && "−"}
                {formatCurrency(Math.abs(profit), validatedInputs.currency)}
              </p>
              <p className="text-[10px] leading-tight text-slate-400">
                {isLoss ? "pérdida" : profit === 0 ? "equilibrio" : "utilidad"}
              </p>
            </div>

            {/* Margen de contribución */}
            {calculation.contributionMarginPct.status === "valido" && (
              <div className="min-w-0">
                <p className="mb-0.5 text-[10px] leading-tight text-slate-500">
                  Margen contrib.
                </p>
                <p className="truncate text-sm font-bold tracking-tight text-slate-800 sm:text-base">
                  {formatPercentage(calculation.contributionMarginPct.value)}
                </p>
                <p className="text-[10px] leading-tight text-slate-400">del precio</p>
              </div>
            )}

            {/* Punto de equilibrio */}
            {calculation.breakevenUnits.status === "valido" && (
              <div className="min-w-0">
                <p className="mb-0.5 text-[10px] leading-tight text-slate-500">
                  Pto. equilibrio
                </p>
                <p className="truncate text-sm font-bold tracking-tight text-slate-800 sm:text-base">
                  {calculation.breakevenUnits.value.minimumWholeUnits.toLocaleString(
                    "es-CO"
                  )}
                </p>
                <p className="text-[10px] leading-tight text-slate-400">uds. / mes</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Diagnóstico ──────────────────────────────────────────── */}
        <div className="border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Diagnóstico
          </p>
          <div className={`rounded-lg border p-3 ${riskStyle.border}`}>
            <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${riskStyle.badge}`}
              >
                {riskStyle.label}
              </span>
              {diagnosis.mainRiskFactor !== null && (
                <span className="text-[10px] text-slate-500">
                  {diagnosis.mainRiskFactor}
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed text-slate-700">
              {diagnosis.summary}
            </p>
          </div>
        </div>

        {/* ── Variable más peligrosa ───────────────────────────────── */}
        <div className="border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Variable más peligrosa
          </p>
          {mostDangerous !== null ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50/60 px-3 py-2.5">
              <p className="min-w-0 truncate text-xs font-semibold text-red-800">
                {mostDangerous.label}
              </p>
              <p className="flex-shrink-0 text-sm font-bold text-red-700">
                −{formatCurrency(
                  Math.abs(mostDangerous.profitDelta),
                  validatedInputs.currency
                )}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              No se identificaron variables de riesgo crítico.
            </p>
          )}
        </div>

        {/* ── Meta mínima semanal ──────────────────────────────────── */}
        {weeklyTarget !== null && breakevenMinUnits !== null && (
          <div className="border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Meta mínima semanal
            </p>
            <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight text-indigo-700">
                  {weeklyTarget.toLocaleString("es-CO")}
                </span>
                <span className="text-xs text-indigo-500">unidades / semana</span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                Piso mínimo para no operar en pérdida (equivalente a{" "}
                {breakevenMinUnits.toLocaleString("es-CO")} unidades al mes).
              </p>
            </div>
          </div>
        )}

        {/* ── Secciones bloqueadas ─────────────────────────────────── */}
        <div className="border-b border-slate-100 bg-slate-50/40 px-4 py-3 sm:px-6">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Solo en el reporte completo
          </p>
          <div className="grid grid-cols-2 gap-2">
            <LockedSection
              title="Plan de acción — 30 días"
              hint="Pasos concretos por semana según tu diagnóstico."
            />
            <LockedSection
              title="Checklist operativo"
              hint="7 acciones para revisar costos, precio y ventas."
            />
            <LockedSection
              title="Recomendaciones por riesgo"
              hint="Guía personalizada según tu nivel de riesgo."
            />
            <LockedSection
              title="Análisis de sensibilidad"
              hint="Ranking de variables por impacto en utilidad."
            />
          </div>
        </div>

        {/* ── CTA WhatsApp ─────────────────────────────────────────── */}
        <div className="bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <WhatsAppIcon />
              Solicitar reporte completo
            </a>
            <p className="text-[10px] leading-relaxed text-slate-400">
              <strong className="text-slate-500">$9.900 COP</strong> · Versión
              piloto · Sin registro obligatorio
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
