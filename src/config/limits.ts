// Upper bound for monetary inputs (≈ 1 trillion).
// Covers any realistic small-to-medium business while preventing
// values that could overflow display components or produce misleading results.
export const MAX_MONETARY_VALUE = 999_999_999_999;

// Upper bound for monthly units sold (100 million).
// No real small business sells more; values beyond this are likely data-entry errors.
export const MAX_UNITS = 100_000_000;
