import type { FormInputs } from "@/domain/types";
import type { FieldErrors } from "@/validation/types";
import type { CurrencyCode } from "@/config/currencies";
import { FormField } from "./FormField";
import { CurrencySelect } from "./CurrencySelect";
import { FormActions } from "./FormActions";

interface CalculatorFormProps {
  inputs: FormInputs;
  errors: FieldErrors;
  onChange: (field: keyof FormInputs, value: string) => void;
  onCalculate: () => void;
  onLoadExample: () => void;
  onReset: () => void;
}

export function CalculatorForm({
  inputs,
  errors,
  onChange,
  onCalculate,
  onLoadExample,
  onReset,
}: CalculatorFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      noValidate
      aria-label="Formulario de datos del negocio"
      className="flex flex-col gap-6"
    >
      <FormField
        id="businessName"
        label="Nombre del negocio o producto"
        value={inputs.businessName}
        onChange={(v) => onChange("businessName", v)}
        hint="Opcional. Solo para personalizar los resultados."
        inputMode="text"
      />

      <CurrencySelect
        value={inputs.currency}
        onChange={(v: CurrencyCode) => onChange("currency", v)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="fixedCosts"
          label="Costos fijos mensuales"
          value={inputs.fixedCosts}
          onChange={(v) => onChange("fixedCosts", v)}
          error={errors.fixedCosts}
          required
        />
        <FormField
          id="variableCostPerUnit"
          label="Costo variable por unidad"
          value={inputs.variableCostPerUnit}
          onChange={(v) => onChange("variableCostPerUnit", v)}
          error={errors.variableCostPerUnit}
          required
        />
        <FormField
          id="pricePerUnit"
          label="Precio de venta por unidad"
          value={inputs.pricePerUnit}
          onChange={(v) => onChange("pricePerUnit", v)}
          error={errors.pricePerUnit}
          required
        />
        <FormField
          id="estimatedUnits"
          label="Unidades estimadas al mes"
          value={inputs.estimatedUnits}
          onChange={(v) => onChange("estimatedUnits", v)}
          error={errors.estimatedUnits}
          inputMode="numeric"
          required
        />
      </div>

      <FormField
        id="initialInvestment"
        label="Inversión inicial"
        value={inputs.initialInvestment}
        onChange={(v) => onChange("initialInvestment", v)}
        error={errors.initialInvestment}
        hint="Ingresa 0 si no tuviste inversión inicial."
        required
      />

      <FormActions onLoadExample={onLoadExample} onReset={onReset} />
    </form>
  );
}
