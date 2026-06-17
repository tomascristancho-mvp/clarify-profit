interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  inputMode?: "decimal" | "numeric" | "text";
  required?: boolean;
}

export function FormField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  inputMode = "decimal",
  required = false,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy =
    [error ? errorId : null, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-red-500">
            *
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-xs text-slate-400">
          {hint}
        </p>
      )}

      <input
        id={id}
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        aria-required={required}
        className={[
          "rounded-lg border px-3 py-3 text-sm text-slate-900 transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          error
            ? "border-red-400 bg-red-50 focus:ring-red-400/30"
            : "border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-400 focus:ring-indigo-400/30",
        ].join(" ")}
      />

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1 text-xs text-red-600"
        >
          <span aria-hidden="true" className="flex-shrink-0 font-bold">
            ⚠
          </span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
