const CONCEPTS = [
  {
    term: "Costos fijos",
    definition:
      "Gastos que debes pagar cada mes independientemente de cuánto vendas. Ejemplos: arriendo, servicios públicos, nómina fija.",
  },
  {
    term: "Costo variable por unidad",
    definition:
      "Lo que cuesta producir o adquirir cada unidad. Aumenta en proporción directa a las ventas. Ejemplos: materia prima, empaque, comisión por venta.",
  },
  {
    term: "Margen de contribución",
    definition:
      "La diferencia entre el precio de venta y el costo variable por unidad. Indica cuánto aporta cada venta para cubrir los costos fijos. Si es negativo o cero, las ventas agravan las pérdidas.",
  },
  {
    term: "Punto de equilibrio",
    definition:
      "Cantidad mínima de unidades que debes vender al mes para que los ingresos igualen los costos totales. Por debajo hay pérdida; por encima hay utilidad.",
  },
  {
    term: "ROI mensual estimado",
    definition:
      "Retorno mensual estimado sobre la inversión inicial, calculado como la utilidad dividida entre la inversión. Es una aproximación de referencia, no una tasa contable definitiva.",
  },
  {
    term: "Tiempo de recuperación",
    definition:
      "Estimación de cuántos meses necesitarías para recuperar la inversión inicial con la utilidad mensual actual. Solo tiene sentido cuando hay utilidad positiva.",
  },
];

export function ConceptExplanations() {
  return (
    <section aria-label="Glosario de términos">
      <details className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60">
          Glosario de términos
        </summary>
        <div className="border-t border-slate-100 dark:border-slate-800">
          <dl className="divide-y divide-slate-100 dark:divide-slate-800">
            {CONCEPTS.map(({ term, definition }) => (
              <div key={term} className="px-4 py-3">
                <dt className="text-sm font-medium text-slate-800 dark:text-slate-100">{term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {definition}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </details>
    </section>
  );
}
