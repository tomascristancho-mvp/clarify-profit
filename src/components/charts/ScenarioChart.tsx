import type { ScenarioResult } from "@/domain/types";
import type { CurrencyCode } from "@/config/currencies";
import { formatCurrency } from "@/format/currency";

interface ScenarioChartProps {
  scenarios: ScenarioResult[];
  currency: CurrencyCode;
}

const SCENARIO_STYLE = {
  pesimista: {
    fill: "#f87171",      // red-400
    labelFill: "#b91c1c", // red-700
    shortLabel: "Pesimista",
  },
  esperado: {
    fill: "#6366f1",      // indigo-500
    labelFill: "#4338ca", // indigo-700
    shortLabel: "Esperado",
  },
  optimista: {
    fill: "#10b981",      // emerald-500
    labelFill: "#047857", // emerald-700
    shortLabel: "Optimista",
  },
} as const;

const LOSS_FILL = "#f87171";
const LOSS_LABEL_FILL = "#b91c1c";

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
        {/* Zero axis */}
        <line
          x1={0}
          y1={zeroY}
          x2={VIEW_W}
          y2={zeroY}
          stroke="#e2e8f0"
          strokeWidth={2}
        />

        {scenarios.map((scenario, i) => {
          const style = SCENARIO_STYLE[scenario.key];
          const profit = scenario.operatingProfit;
          const barX = i * SECTION_W + BAR_PADDING;
          const centerX = barX + BAR_W / 2;

          let rectY: number;
          let rectHeight: number;
          let fill: string;
          let valueLabelY: number;
          let valueDominantBaseline: "auto" | "hanging";
          let valueLabelFill: string;

          if (profit > 0) {
            rectY = toY(profit);
            rectHeight = zeroY - rectY;
            fill = style.fill;
            valueLabelY = rectY - 6;
            valueDominantBaseline = "auto";
            valueLabelFill = style.labelFill;
          } else if (profit < 0) {
            rectY = zeroY;
            rectHeight = toY(profit) - zeroY;
            fill = LOSS_FILL;
            valueLabelY = rectY + rectHeight + 8;
            valueDominantBaseline = "hanging";
            valueLabelFill = LOSS_LABEL_FILL;
          } else {
            // profit === 0: minimal bar centered on zero axis
            rectY = zeroY - MIN_H / 2;
            rectHeight = MIN_H;
            fill = "#94a3b8"; // slate-400
            valueLabelY = zeroY - 8;
            valueDominantBaseline = "auto";
            valueLabelFill = "#64748b"; // slate-500
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
                fill={fill}
                rx={3}
              />
              <text
                x={centerX}
                y={valueLabelY}
                textAnchor="middle"
                dominantBaseline={valueDominantBaseline}
                fontSize={12}
                fontWeight="600"
                fill={valueLabelFill}
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
                fill={style.labelFill}
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
