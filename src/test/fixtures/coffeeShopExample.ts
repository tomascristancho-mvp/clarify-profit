import type { ValidatedInputs } from "@/domain/types";

// Reference example from the project spec (section 10).
// All expected values are derived from the spec and serve as the single source of truth
// for cross-checking calculation correctness across all test files.
export const COFFEE_SHOP_INPUTS: ValidatedInputs = {
  businessName: "Cafetería de ejemplo",
  currency: "COP",
  fixedCosts: 2_000_000,
  variableCostPerUnit: 12_000,
  pricePerUnit: 25_000,
  estimatedUnits: 250,
  initialInvestment: 5_000_000,
};

export const COFFEE_SHOP_EXPECTED = {
  monthlyRevenue: 6_250_000,         // 25_000 × 250
  totalVariableCosts: 3_000_000,      // 12_000 × 250
  totalCosts: 5_000_000,             // 2_000_000 + 3_000_000
  operatingProfit: 1_250_000,        // 6_250_000 − 5_000_000
  contributionMarginPerUnit: 13_000, // 25_000 − 12_000
  contributionMarginPct: 52,         // (13_000 / 25_000) × 100
  // 2_000_000 / 13_000 ≈ 153.846...
  breakevenExact: 2_000_000 / 13_000,
  breakevenWholeUnits: 154,          // Math.ceil(153.846...)
  // 2_000_000 / (13_000 / 25_000) ≈ 3_846_153.846...
  breakevenTheoreticalRevenue: 2_000_000 / (13_000 / 25_000),
  // 154 × 25_000
  breakevenRevenueAtWholeUnits: 154 * 25_000,
  monthlyROI: 25,                    // (1_250_000 / 5_000_000) × 100
  recoveryTimeMonths: 4,             // 5_000_000 / 1_250_000
};
