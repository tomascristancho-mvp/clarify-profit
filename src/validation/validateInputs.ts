import type { FormInputs } from "@/domain/types";
import type { FieldErrors, ValidationResult } from "@/validation/types";
import { MAX_MONETARY_VALUE, MAX_UNITS } from "@/config/limits";

// Converts a raw string from a form field to a number.
// Returns NaN for empty strings (Number("") would wrongly return 0).
// Removes commas used as thousands separators (e.g. "2,000,000" → 2000000).
// The form UI in Phase 3 will restrict inputs to plain digits + one decimal point,
// so this parser intentionally does not handle dot-as-thousands-separator (ambiguous).
function parseNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === "") return NaN;
  const cleaned = trimmed.replace(/,/g, "");
  return Number(cleaned);
}

interface MonetaryOptions {
  allowZero?: boolean; // true = 0 is valid; false = must be > 0
}

function validateMonetaryField(
  value: string,
  fieldLabel: string,
  options: MonetaryOptions = {}
): string | null {
  const num = parseNumber(value);
  if (Number.isNaN(num)) {
    return `${fieldLabel} debe ser un número válido.`;
  }
  if (num < 0) {
    return `${fieldLabel} no puede ser un valor negativo.`;
  }
  if (!options.allowZero && num === 0) {
    return `${fieldLabel} debe ser mayor que cero.`;
  }
  if (num > MAX_MONETARY_VALUE) {
    return `${fieldLabel} supera el valor máximo permitido (${MAX_MONETARY_VALUE.toLocaleString("es-CO")}).`;
  }
  return null;
}

export function validateInputs(inputs: FormInputs): ValidationResult {
  const errors: FieldErrors = {};

  // Fixed monthly costs: 0 is valid (some businesses have no fixed costs)
  const fixedCostsError = validateMonetaryField(
    inputs.fixedCosts,
    "Los costos fijos mensuales",
    { allowZero: true }
  );
  if (fixedCostsError) errors.fixedCosts = fixedCostsError;

  // Variable cost per unit: 0 is valid (e.g. a digital product)
  const variableCostError = validateMonetaryField(
    inputs.variableCostPerUnit,
    "El costo variable por unidad",
    { allowZero: true }
  );
  if (variableCostError) errors.variableCostPerUnit = variableCostError;

  // Price per unit: must be strictly greater than 0
  const priceError = validateMonetaryField(
    inputs.pricePerUnit,
    "El precio de venta por unidad",
    { allowZero: false }
  );
  if (priceError) errors.pricePerUnit = priceError;

  // Estimated units: must be a non-negative whole number
  const rawUnits = parseNumber(inputs.estimatedUnits);
  if (Number.isNaN(rawUnits)) {
    errors.estimatedUnits = "Las unidades estimadas deben ser un número válido.";
  } else if (rawUnits < 0) {
    errors.estimatedUnits = "Las unidades estimadas no pueden ser negativas.";
  } else if (!Number.isInteger(rawUnits)) {
    errors.estimatedUnits =
      "Las unidades estimadas deben ser un número entero (sin decimales).";
  } else if (rawUnits > MAX_UNITS) {
    errors.estimatedUnits = `Las unidades estimadas superan el máximo permitido (${MAX_UNITS.toLocaleString("es-CO")}).`;
  }

  // Initial investment: 0 is valid (ROI and recovery will show "no aplica")
  const investmentError = validateMonetaryField(
    inputs.initialInvestment,
    "La inversión inicial",
    { allowZero: true }
  );
  if (investmentError) errors.initialInvestment = investmentError;

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      businessName: inputs.businessName.trim(),
      currency: inputs.currency,
      fixedCosts: parseNumber(inputs.fixedCosts),
      variableCostPerUnit: parseNumber(inputs.variableCostPerUnit),
      pricePerUnit: parseNumber(inputs.pricePerUnit),
      estimatedUnits: parseNumber(inputs.estimatedUnits),
      initialInvestment: parseNumber(inputs.initialInvestment),
    },
  };
}
