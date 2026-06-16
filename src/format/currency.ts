import type { CurrencyCode } from "@/config/currencies";
import { CURRENCIES } from "@/config/currencies";

// Formats a number as a currency string using the locale and decimal rules
// configured per currency in config/currencies.ts.
// Rounding to the configured number of decimal places is handled by Intl.NumberFormat.
// COP uses 0 decimal places; USD and EUR use 2.
export function formatCurrency(value: number, currency: CurrencyCode): string {
  const { locale, code, decimals } = CURRENCIES[currency];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
