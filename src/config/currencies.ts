export type CurrencyCode = "COP" | "USD" | "EUR";

export interface CurrencyConfig {
  code: CurrencyCode;
  label: string;
  locale: string;
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  COP: { code: "COP", label: "Peso colombiano (COP)", locale: "es-CO", decimals: 0 },
  USD: { code: "USD", label: "Dólar estadounidense (USD)", locale: "en-US", decimals: 2 },
  EUR: { code: "EUR", label: "Euro (EUR)", locale: "es-ES", decimals: 2 },
};

export const DEFAULT_CURRENCY: CurrencyCode = "COP";

export const CURRENCY_OPTIONS: CurrencyCode[] = ["COP", "USD", "EUR"];
