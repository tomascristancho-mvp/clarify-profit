const STEPS = [
  {
    number: "1",
    title: "Ingresa tus datos",
    description:
      "Costos fijos, costo por unidad, precio de venta y ventas estimadas. Sin registro, sin contabilidad.",
    accent: "bg-indigo-600",
  },
  {
    number: "2",
    title: "Recibe tu diagnóstico",
    description:
      "Utilidad mensual, punto de equilibrio, nivel de riesgo y qué pasaría si cambian tus números.",
    accent: "bg-violet-600",
  },
  {
    number: "3",
    title: "Decide con claridad",
    description:
      "Usa los resultados gratis, o pide el reporte ejecutivo premium con plan de acción de 30 días.",
    accent: "bg-emerald-600",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="border-b border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <h2
          id="how-it-works-heading"
          className="mb-2 text-center text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100"
        >
          Cómo funciona
        </h2>
        <p className="mx-auto mb-8 max-w-md text-center text-sm text-slate-500 dark:text-slate-400">
          Tres pasos, dos minutos, cero conocimientos contables.
        </p>

        <ol className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.number} className="flex gap-4 sm:flex-col sm:gap-3">
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${step.accent}`}
                aria-hidden="true"
              >
                {step.number}
              </span>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
