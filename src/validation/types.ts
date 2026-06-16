import type { FormInputs, ValidatedInputs } from "@/domain/types";

export type FieldErrors = Partial<Record<keyof FormInputs, string>>;

export type ValidationResult =
  | { valid: true; data: ValidatedInputs }
  | { valid: false; errors: FieldErrors };
