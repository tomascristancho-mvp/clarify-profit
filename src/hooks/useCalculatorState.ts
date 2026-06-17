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

function runCalculation(inputs: FormInputs): CalculatorResults | null {
  const validation = validateInputs(inputs);
  if (!validation.valid) return null;
  const calculation = calcular(validation.data);
  const scenarios = calcularEscenarios(validation.data);
  const interpretations = generarInterpretaciones(
    validation.data,
    calculation,
    scenarios
  );
  const diagnosis = diagnosticarNegocio(validation.data, calculation, scenarios);
  const simulations = simularCambios(validation.data, calculation);
  return { validatedInputs: validation.data, calculation, scenarios, interpretations, diagnosis, simulations };
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
    const calculation = calcular(validation.data);
    const scenarios = calcularEscenarios(validation.data);
    const interpretations = generarInterpretaciones(
      validation.data,
      calculation,
      scenarios
    );
    const diagnosis = diagnosticarNegocio(validation.data, calculation, scenarios);
    const simulations = simularCambios(validation.data, calculation);
    setResults({ validatedInputs: validation.data, calculation, scenarios, interpretations, diagnosis, simulations });
  }, [inputs]);

  const handleLoadExample = useCallback(() => {
    setInputs(EXAMPLE_FORM_INPUTS);
    setErrors({});
    setResults(runCalculation(EXAMPLE_FORM_INPUTS));
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
