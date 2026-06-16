import type { CurrencyCode } from "@/config/currencies";
import type { ScenarioKey } from "@/config/scenarios";

export type { CurrencyCode };

// Three-state result for indicators that can be:
//   "valido"       — has a calculable numeric value
//   "no_aplica"    — the question has no meaning (e.g. ROI when there is no investment)
//   "no_alcanzable"— the question is meaningful but impossible (e.g. breakeven when margin ≤ 0)
//
// Using a discriminated union means TypeScript prevents accessing .value
// without first checking .status — no NaN/Infinity can leak to the UI.
export type IndicatorResult<T> =
  | { status: "valido"; value: T }
  | { status: "no_aplica"; reason: string }
  | { status: "no_alcanzable"; reason: string };

// Raw strings from the form inputs
export interface FormInputs {
  businessName: string;
  currency: CurrencyCode;
  fixedCosts: string;
  variableCostPerUnit: string;
  pricePerUnit: string;
  estimatedUnits: string;
  initialInvestment: string;
}

// Parsed and validated numbers ready for calculations
export interface ValidatedInputs {
  businessName: string;
  currency: CurrencyCode;
  fixedCosts: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
  estimatedUnits: number;
  initialInvestment: number;
}

export interface BreakevenUnits {
  exact: number;
  minimumWholeUnits: number; // Math.ceil(exact) — the fewest whole units to cover all costs
}

export interface BreakevenRevenue {
  theoretical: number;         // fixedCosts ÷ (contributionMarginPct / 100)
  atMinimumWholeUnits: number; // minimumWholeUnits × pricePerUnit
}

export interface CalculationResult {
  monthlyRevenue: number;
  totalVariableCosts: number;
  totalCosts: number;
  operatingProfit: number; // negative = operating loss
  contributionMarginPerUnit: number;
  contributionMarginPct: IndicatorResult<number>;
  breakevenUnits: IndicatorResult<BreakevenUnits>;
  breakevenRevenue: IndicatorResult<BreakevenRevenue>;
  monthlyROI: IndicatorResult<number>;
  recoveryTimeMonths: IndicatorResult<number>;
}

export interface ScenarioResult {
  key: ScenarioKey;
  label: string;
  factor: number;
  units: number; // Math.round(estimatedUnits × factor) — always a whole number
  revenue: number;
  variableCosts: number;
  totalCosts: number;
  operatingProfit: number;
  operatingMarginPct: IndicatorResult<number>; // no_aplica when revenue = 0
}

export interface InterpretationMessage {
  type: "alerta" | "informacion" | "positivo";
  message: string;
}
