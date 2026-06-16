// Number of decimal places shown in percentage values across the app.
// Centralised here so it can be changed in one place.
const PERCENTAGE_DECIMALS = 1;

// Formats a value like 52 (meaning 52%) as "52,0 %" using es-CO locale.
// Intl.NumberFormat with style "percent" multiplies by 100 internally,
// so we divide by 100 before passing the value.
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "percent",
    minimumFractionDigits: PERCENTAGE_DECIMALS,
    maximumFractionDigits: PERCENTAGE_DECIMALS,
  }).format(value / 100);
}
