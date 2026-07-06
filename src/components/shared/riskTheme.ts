import type { RiskLevel } from "@/domain/diagnosis";

// Single source of truth for how each risk level is presented across the UI.
// Domain code never imports this — Tailwind classes belong to the components layer.
export interface RiskTheme {
  label: string;
  icon: string;
  // Solid badge: bg-*-100 / text-*-800 / ring-*-200 (chips on cards)
  badgeClass: string;
  // Soft badge: bg-*-50 / border-*-200 / text-*-700 (inline, lower emphasis)
  softBadgeClass: string;
  // Card border tint used by the report preview
  borderClass: string;
}

export const RISK_THEME: Record<RiskLevel, RiskTheme> = {
  bajo: {
    label: "Bajo riesgo",
    icon: "✓",
    badgeClass:
      "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:ring-emerald-800",
    softBadgeClass:
      "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-800",
    borderClass: "border-emerald-200 dark:border-emerald-800",
  },
  medio: {
    label: "Riesgo moderado",
    icon: "!",
    badgeClass:
      "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:ring-amber-800",
    softBadgeClass:
      "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/50 dark:border-amber-800",
    borderClass: "border-amber-200 dark:border-amber-800",
  },
  alto: {
    label: "Riesgo alto",
    icon: "⚠",
    badgeClass:
      "bg-orange-100 text-orange-800 ring-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:ring-orange-800",
    softBadgeClass:
      "text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-300 dark:bg-orange-950/50 dark:border-orange-800",
    borderClass: "border-orange-200 dark:border-orange-800",
  },
  no_viable: {
    label: "No viable",
    icon: "✕",
    badgeClass:
      "bg-red-100 text-red-800 ring-red-200 dark:bg-red-900/50 dark:text-red-300 dark:ring-red-800",
    softBadgeClass:
      "text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950/50 dark:border-red-800",
    borderClass: "border-red-200 dark:border-red-800",
  },
};
