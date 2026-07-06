import type { ScenarioResult } from "@/domain/types";
import type { CurrencyCode } from "@/config/currencies";
import { formatCurrency } from "@/format/currency";

interface ScenarioChartProps {
  scenarios: ScenarioResult[];
  currency: CurrencyCode;
}

// Tailwind fill classes — dark variants keep labels readable in dark mode.
const SCENARIO_STYLE = {
  pesimista: {
    barClass: "fill-red-400",
    labelClass: "fill-red-700 dark:fill-red-300",
    shortLabel: "Pesimista",
  },
  esperado: {
    barClass: "fill-indigo-500",
    labelClass: "fill-indigo-700 dark:fill-indigo-300",
    shortLabel: "Esperado",
  },
  optimista: {
    barClass: "fill-emerald-500",
    labelClass: "fill-emerald-700 dark:fill-emerald-300",
    shortLabel: "Optimista",
  },
} as const;

const LOSS_BAR_CLASS = "fill-red-400";
const LOSS_LABEL_CLASS = "fill-red-700 dark:fill-red-300";
const ZERO_BAR_CLASS = "fill-slate-400";
const ZERO_LABEL_CLASS = "fill-slate-500 dark:fill-slate-400";
const AXIS_CLASS = "stroke-slate-200 dark:stroke-slate-700";
const GRID_CLASS = "stroke-slate-100 dark:stroke-slate-800";

// SVG layout constants (user units)
const VIEW_W = 420;
const VIEW_H = 248;
const CHART_TOP = 36;
const CHART_H = 142;
const LABELS_Y = 212;
const SECTION_W = VIEW_W / 3;             // 140
const BAR_W = 88;
const BAR_PADDING = (SECTION_W - BAR_W) / 2; // 26
const MIN_H = 4; // minimum visible height for zero-value bars
const GRIDLINES = 4;

export function ScenarioChart({ scenarios, currency }: ScenarioChartProps) {
  const profits = scenarios.map((s) => s.operatingProfit);
  const maxVal = Math.max(0, ...profits);
  const minVal = Math.min(0, ...profits);
  const range = maxVal - minVal;

  // Maps a financial value to an SVG y-coordinate.
  // Larger values → smaller y (closer to top of chart).
  const toY = (v: number): number => {
    if (range === 0) return CHART_TOP + CHART_H / 2;
    return CHART_TOP + CHART_H * (maxVal - v) / range;
  };

  const zeroY = toY(0);

  const gridYs = Array.from(
    { length: GRIDLINES },
    (_, i) => CHART_TOP + (CHART_H * (i + 1)) / (GRIDLINES + 1)
  );

  const ariaLabel =
    "Comparación de escenarios. " +
    scenarios
      .map((s) => {
        const sign = s.operatingProfit < 0 ? "−" : "";
        return `${SCENARIO_STYLE[s.key].shortLabel}: ${sign}${formatCurrency(Math.abs(s.operatingProfit), currency)}`;
      })
      .join(". ") +
    ".";

  return (
    <figure role="img" aria-label={ariaLabel} className="w-full">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        width="100%"
        aria-hidden="true"
      >
        {/* Gridlines (behind everything) */}
        {gridYs.map((y) => (
          <line
            key={y}
            x1={0} y1={y} x2={VIEW_W} y2={y}
            className={GRID_CLASS}
            strokeWidth={1}
          />
        ))}

        {/* Zero axis */}
        <line
          x1={0}
          y1={zeroY}
          x2={VIEW_W}
          y2={zeroY}
          className={AXIS_CLASS}
          strokeWidth={2}
        />

        {scenarios.map((scenario, i) => {
          const style = SCENARIO_STYLE[scenario.key];
          const profit = scenario.operatingProfit;
          const barX = i * SECTION_W + BAR_PADDING;
          const centerX = barX + BAR_W / 2;

          let rectY: number;
          let rectHeight: number;
          let barClass: string;
          let valueLabelY: number;
          let valueDominantBaseline: "auto" | "hanging";
          let valueLabelClass: string;

          if (profit > 0) {
            rectY = toY(profit);
            rectHeight = zeroY - rectY;
            barClass = style.barClass;
            valueLabelY = rectY - 6;
            valueDominantBaseline = "auto";
            valueLabelClass = style.labelClass;
          } else if (profit < 0) {
            rectY = zeroY;
            rectHeight = toY(profit) - zeroY;
            barClass = LOSS_BAR_CLASS;
            valueLabelY = rectY + rectHeight + 8;
            valueDominantBaseline = "hanging";
            valueLabelClass = LOSS_LABEL_CLASS;
          } else {
            // profit === 0: minimal bar centered on zero axis
            rectY = zeroY - MIN_H / 2;
            rectHeight = MIN_H;
            barClass = ZERO_BAR_CLASS;
            valueLabelY = zeroY - 8;
            valueDominantBaseline = "auto";
            valueLabelClass = ZERO_LABEL_CLASS;
          }

          const displayValue =
            (profit < 0 ? "−" : "") +
            formatCurrency(Math.abs(profit), currency);

          return (
            <g key={scenario.key}>
              <rect
                x={barX}
                y={rectY}
                width={BAR_W}
                height={Math.max(rectHeight, MIN_H)}
                className={barClass}
                rx={3}
              />
              <text
                x={centerX}
                y={valueLabelY}
                textAnchor="middle"
                dominantBaseline={valueDominantBaseline}
                fontSize={12}
                fontWeight="600"
                className={valueLabelClass}
              >
                {displayValue}
              </text>
              <text
                x={centerX}
                y={LABELS_Y}
                textAnchor="middle"
                dominantBaseline="hanging"
                fontSize={11}
                fontWeight="500"
                className={style.labelClass}
              >
                {style.shortLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
