import type { CurrencyCode } from "@/config/currencies";
import { CURRENCY_OPTIONS, CURRENCIES } from "@/config/currencies";

interface CurrencySelectProps {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
}

export function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-slate-700">Moneda</legend>
      <div className="flex flex-wrap gap-2">
        {CURRENCY_OPTIONS.map((code) => (
          <label
            key={code}
            className={[
              "flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 transition-colors focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-1",
              value === code
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
            ].join(" ")}
          >
            <input
              type="radio"
              name="currency"
              value={code}
              checked={value === code}
              onChange={() => onChange(code)}
              className="sr-only"
            />
            <span className="text-sm font-medium">
              {code} — {CURRENCIES[code].label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
