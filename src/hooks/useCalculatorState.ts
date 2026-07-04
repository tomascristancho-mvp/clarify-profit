"use client";

import { useState, useCallback } from "react";
import type {
  FormInputs,
  ValidatedInputs,
  CalculationResult,
  ScenarioResult,
  InterpretationMessage,
} from "@/domain/types";
import type { FieldErrors } from "@/validation/types";
import { validateInputs } from "@/validation/validateInputs";
import { calcular } from "@/domain/calculations";
import { calcularEscenarios } from "@/domain/scenarios";
import { generarInterpretaciones } from "@/domain/interpretations";
import { INITIAL_FORM_INPUTS, EXAMPLE_FORM_INPUTS } from "@/config/exampleInputs";
import type { DiagnosisResult } from "@/domain/diagnosis";
import { diagnosticarNegocio } from "@/domain/diagnosis";
import type { WhatIfSimulation } from "@/domain/whatIf";
import { simularCambios } from "@/domain/whatIf";

export interface CalculatorResults {
  validatedInputs: ValidatedInputs;
  calculation: CalculationResult;
  scenarios: ScenarioResult[];
  interpretations: InterpretationMessage[];
  diagnosis: DiagnosisResult;
  simulations: WhatIfSimulation[];
}

function computeResults(data: ValidatedInputs): CalculatorResults {
  const calculation = calcular(data);
  const scenarios = calcularEscenarios(data);
  const interpretations = generarInterpretaciones(data, calculation, scenarios);
  const diagnosis = diagnosticarNegocio(data, calculation, scenarios);
  const simulations = simularCambios(data, calculation);
  return { validatedInputs: data, calculation, scenarios, interpretations, diagnosis, simulations };
}

export function useCalculatorState() {
  const [inputs, setInputs] = useState<FormInputs>(INITIAL_FORM_INPUTS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const handleChange = useCallback(
    (field: keyof FormInputs, value: string) => {
      setInputs((prev) => ({ ...prev, [field]: value } as FormInputs));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const handleCalculate = useCallback(() => {
    const validation = validateInputs(inputs);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setResults(computeResults(validation.data));
  }, [inputs]);

  const handleLoadExample = useCallback(() => {
    setInputs(EXAMPLE_FORM_INPUTS);
    setErrors({});
    const validation = validateInputs(EXAMPLE_FORM_INPUTS);
    setResults(validation.valid ? computeResults(validation.data) : null);
  }, []);

  const handleReset = useCallback(() => {
    setInputs(INITIAL_FORM_INPUTS);
    setErrors({});
    setResults(null);
  }, []);

  return {
    inputs,
    errors,
    results,
    handleChange,
    handleCalculate,
    handleLoadExample,
    handleReset,
  };
}
