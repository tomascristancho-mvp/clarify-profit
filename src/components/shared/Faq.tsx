// FAQ content lives here and is also consumed by page.tsx to build the
// FAQPage JSON-LD, so the visible text and the structured data never diverge.
export const FAQ_ITEMS = [
  {
    question: "¿La calculadora es gratis?",
    answer:
      "Sí, la calculadora es 100% gratuita y sin registro. Ingresas tus datos, obtienes tu utilidad estimada, punto de equilibrio, nivel de riesgo y escenarios al instante. Solo el reporte ejecutivo premium tiene un costo de $9.900 COP (precio piloto).",
  },
  {
    question: "¿Necesito saber de contabilidad para usarla?",
    answer:
      "No. Solo necesitas conocer cinco datos básicos de tu negocio: costos fijos mensuales, costo por unidad, precio de venta, ventas estimadas e inversión inicial. La herramienta explica cada término en lenguaje sencillo.",
  },
  {
    question: "¿Qué pasa con mis datos?",
    answer:
      "Nada: no se guardan ni se envían a ningún servidor. Todos los cálculos ocurren en tu propio navegador. Si cierras la página, los datos desaparecen.",
  },
  {
    question: "¿Qué es el punto de equilibrio?",
    answer:
      "Es la cantidad mínima de unidades que debes vender al mes para cubrir todos tus costos, sin ganar ni perder. Por encima de esa cifra empiezas a generar utilidad. Es uno de los números más importantes para cualquier negocio.",
  },
  {
    question: "¿Qué incluye el reporte ejecutivo premium?",
    answer:
      "Un diagnóstico financiero completo de tu negocio: plan de acción de 30 días, checklist operativo semanal, análisis de sensibilidad de todas las variables, recomendaciones según tu nivel de riesgo y metas de venta semanales. Se solicita por WhatsApp y cuesta $9.900 COP (precio piloto).",
  },
  {
    question: "¿Esto reemplaza a un contador o asesor financiero?",
    answer:
      "No. Negocio Claro es una herramienta educativa de apoyo a la toma de decisiones. Los resultados son estimaciones basadas en los datos que ingresas. Para decisiones importantes de inversión, crédito o impuestos, consulta con un contador o asesor de confianza.",
  },
] as const;

export function Faq() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <h2
          id="faq-heading"
          className="mb-2 text-center text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100"
        >
          Preguntas frecuentes
        </h2>
        <p className="mx-auto mb-8 max-w-md text-center text-sm text-slate-500 dark:text-slate-400">
          Lo que otros emprendedores preguntan antes de calcular su negocio.
        </p>

        <div className="flex flex-col gap-2">
          {FAQ_ITEMS.map(({ question, answer }) => (
            <details
              key={question}
              className="group rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60"
            >
              <summary className="flex cursor-pointer select-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                {question}
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                >
                  ▾
                </span>
              </summary>
              <p className="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-300">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
