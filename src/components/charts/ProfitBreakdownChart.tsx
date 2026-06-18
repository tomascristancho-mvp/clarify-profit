import type { CurrencyCode } from "@/config/currencies";
import { formatCurrency } from "@/format/currency";

interface ProfitBreakdownChartProps {
  monthlyRevenue: number;
  totalVariableCosts: number;
  totalCosts: number;
  operatingProfit: number;
  currency: CurrencyCode;
}

// SVG layout constants (user units)
const VIEW_W = 480;
const VIEW_H = 248;
const CHART_TOP = 36;
const CHART_H = 160;
const LABELS_Y = 224;
const SECTION_W = VIEW_W / 4; // 120
const BAR_W = 72;
const BAR_PADDING = (SECTION_W - BAR_W) / 2; // 24
const MIN_H = 4;

const COLORS = {
  revenue:  { bar: "#6366f1", label: "#4338ca" }, // indigo-500/700
  variable: { bar: "#fbbf24", label: "#b45309" }, // amber-400/700
  fixed:    { bar: "#94a3b8", label: "#475569" }, // slate-400/600
  profit:   { bar: "#10b981", label: "#047857" }, // emerald-500/700
  loss:     { bar: "#ef4444", label: "#b91c1c" }, // red-500/700
  breakeven:{ bar: "#94a3b8", label: "#64748b" }, // slate-400/500
  axis:   "#e2e8f0",
  bridge: "#cbd5e1",
} as const;

export function ProfitBreakdownChart({
  monthlyRevenue,
  totalVariableCosts,
  totalCosts,
  operatingProfit,
  currency,
}: ProfitBreakdownChartProps) {
  if (monthlyRevenue <= 0 && totalCosts <= 0) return null;

  const R  = monthlyRevenue;
  const VC = totalVariableCosts;
  // Clamp to 0 so a rounding edge case never produces a negative bar height.
  const FC = Math.max(0, totalCosts - totalVariableCosts);
  const CM = R - VC; // contribution margin
  const P  = operatingProfit;

  // Scale: top = revenue, bottom = min(0, profit)
  const maxVal = R;
  const minVal = Math.min(0, P);
  const range  = maxVal - minVal;

  // Maps a financial value to an SVG y-coordinate.
  // Higher values → smaller y (closer to the top of the chart).
  const toY = (v: number): number => {
    if (range === 0) return CHART_TOP + CHART_H / 2;
    return CHART_TOP + CHART_H * (maxVal - v) / range;
  };

  const zeroY = toY(0);

  // Helpers for bar x positions
  const bX = (i: number): number => i * SECTION_W + BAR_PADDING;
  const cX = (i: number): number => bX(i) + BAR_W / 2;

  const isProfit    = P > 0;
  const isLoss      = P < 0;
  const isBreakeven = P === 0;

  const profitColor = isLoss
    ? COLORS.loss
    : isBreakeven
    ? COLORS.breakeven
    : COLORS.profit;

  // ── Bar geometries ──────────────────────────────────────────────────────────
  // 1. Revenue: solid bar from zero up to revenue level
  const revY = toY(R);
  const revH = Math.max(zeroY - revY, MIN_H);

  // 2. Variable costs: floating bar from revenue level down to contribution margin
  const vcY = toY(R);
  const vcH = Math.max(toY(CM) - toY(R), MIN_H);

  // 3. Fixed costs: floating bar from contribution margin down to profit level
  const fcY = toY(CM);
  const fcH = Math.max(toY(P) - toY(CM), MIN_H);

  // 4. Profit/loss: solid bar from zero to profit
  //    Positive → bar grows upward; negative → bar grows downward below zero axis.
  const pBarY = isLoss
    ? zeroY
    : isBreakeven
    ? zeroY - MIN_H / 2
    : toY(P);
  const pBarH = isBreakeven
    ? MIN_H
    : Math.max(Math.abs(zeroY - toY(P)), MIN_H);

  // ── Value label positions ───────────────────────────────────────────────────
  const revLabelY = revY - 6;
  const vcLabelY  = toY(R) - 6;
  const fcLabelY  = toY(CM) - 6;
  const pLabelY: number = isLoss ? pBarY + pBarH + 8 : toY(P) - 6;
  const pBaseline: "auto" | "hanging" = isLoss ? "hanging" : "auto";

  const profitDisplayValue = isLoss
    ? `−${formatCurrency(Math.abs(P), currency)}`
    : formatCurrency(Math.abs(P), currency);

  // ── Accessibility ───────────────────────────────────────────────────────────
  const ariaLabel =
    `Desglose financiero mensual. ` +
    `Ingresos: ${formatCurrency(R, currency)}. ` +
    `Costos variables: ${formatCurrency(VC, currency)}. ` +
    `Costos fijos: ${formatCurrency(FC, currency)}. ` +
    `${isLoss ? "Pérdida" : "Utilidad"}: ${formatCurrency(Math.abs(P), currency)}.`;

  const categoryLabels = [
    { text: "Ingresos",     fill: COLORS.revenue.label },
    { text: "Costos var.",  fill: COLORS.variable.label },
    { text: "Costos fijos", fill: COLORS.fixed.label },
    {
      text: isLoss ? "Pérdida" : isBreakeven ? "Equilibrio" : "Utilidad",
      fill: profitColor.label,
    },
  ];

  return (
    <figure role="img" aria-label={ariaLabel} className="w-full">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        width="100%"
        aria-hidden="true"
      >
        {/* ── 1. Revenue bar ─────────────────────────────────────── */}
        <rect x={bX(0)} y={revY} width={BAR_W} height={revH} fill={COLORS.revenue.bar} rx={3} />
        <text
          x={cX(0)} y={revLabelY}
          textAnchor="middle" dominantBaseline="auto"
          fontSize={11} fontWeight="600" fill={COLORS.revenue.label}
        >
          {formatCurrency(R, currency)}
        </text>

        {/* Bridge: revenue level → start of variable costs bar */}
        <line
          x1={bX(0) + BAR_W} y1={toY(R)} x2={bX(1)} y2={toY(R)}
          stroke={COLORS.bridge} strokeWidth={1} strokeDasharray="3 2"
        />

        {/* ── 2. Variable costs floating bar ────────────────────── */}
        <rect x={bX(1)} y={vcY} width={BAR_W} height={vcH} fill={COLORS.variable.bar} rx={3} />
        <text
          x={cX(1)} y={vcLabelY}
          textAnchor="middle" dominantBaseline="auto"
          fontSize={11} fontWeight="600" fill={COLORS.variable.label}
        >
          −{formatCurrency(VC, currency)}
        </text>

        {/* Bridge: contribution margin level → start of fixed costs bar */}
        <line
          x1={bX(1) + BAR_W} y1={toY(CM)} x2={bX(2)} y2={toY(CM)}
          stroke={COLORS.bridge} strokeWidth={1} strokeDasharray="3 2"
        />

        {/* ── 3. Fixed costs floating bar ───────────────────────── */}
        <rect x={bX(2)} y={fcY} width={BAR_W} height={fcH} fill={COLORS.fixed.bar} rx={3} />
        <text
          x={cX(2)} y={fcLabelY}
          textAnchor="middle" dominantBaseline="auto"
          fontSize={11} fontWeight="600" fill={COLORS.fixed.label}
        >
          −{formatCurrency(FC, currency)}
        </text>

        {/* Bridge: profit level → profit bar top (only when profitable) */}
        {isProfit && (
          <line
            x1={bX(2) + BAR_W} y1={toY(P)} x2={bX(3)} y2={toY(P)}
            stroke={COLORS.bridge} strokeWidth={1} strokeDasharray="3 2"
          />
        )}

        {/* ── 4. Profit / Loss bar ───────────────────────────────── */}
        <rect x={bX(3)} y={pBarY} width={BAR_W} height={pBarH} fill={profitColor.bar} rx={3} />
        <text
          x={cX(3)} y={pLabelY}
          textAnchor="middle" dominantBaseline={pBaseline}
          fontSize={11} fontWeight="600" fill={profitColor.label}
        >
          {profitDisplayValue}
        </text>

        {/* ── Zero axis (drawn last so it renders above the bars) ── */}
        <line x1={0} y1={zeroY} x2={VIEW_W} y2={zeroY} stroke={COLORS.axis} strokeWidth={2} />

        {/* ── Category labels ────────────────────────────────────── */}
        {categoryLabels.map(({ text, fill }, i) => (
          <text
            key={text}
            x={cX(i)} y={LABELS_Y}
            textAnchor="middle" dominantBaseline="hanging"
            fontSize={11} fontWeight="500" fill={fill}
          >
            {text}
          </text>
        ))}
      </svg>
    </figure>
  );
}
