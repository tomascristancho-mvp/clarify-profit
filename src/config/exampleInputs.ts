import type { FormInputs } from "@/domain/types";
import { DEFAULT_CURRENCY } from "@/config/currencies";

export const INITIAL_FORM_INPUTS: FormInputs = {
  businessName: "",
  currency: DEFAULT_CURRENCY,
  fixedCosts: "",
  variableCostPerUnit: "",
  pricePerUnit: "",
  estimatedUnits: "",
  initialInvestment: "",
};

// Reference example: cafetería from spec section 10
export const EXAMPLE_FORM_INPUTS: FormInputs = {
  businessName: "Cafetería de ejemplo",
  currency: "COP",
  fixedCosts: "2000000",
  variableCostPerUnit: "12000",
  pricePerUnit: "25000",
  estimatedUnits: "250",
  initialInvestment: "5000000",
};
