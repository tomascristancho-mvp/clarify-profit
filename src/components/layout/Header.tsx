export function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900">
      {/* Decorative glows — aria-hidden */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-10 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        {/* Top badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium tracking-wide text-white/80 ring-1 ring-inset ring-white/20">
            <span aria-hidden="true" className="text-emerald-400">✦</span>
            Herramienta educativa gratuita para emprendedores
          </span>
        </div>

        {/* H1 */}
        <h1 className="mb-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          Descubre si tu negocio{" "}
          <span className="text-indigo-300">es rentable</span>
        </h1>

        {/* Subtitle */}
        <p className="mb-8 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
          Calcula punto de equilibrio, utilidad mensual y tiempo de recuperación.
          Sin conocimientos de contabilidad.
        </p>

        {/* Value badges */}
        <ul
          aria-label="Características de la herramienta"
          className="mb-10 flex flex-wrap gap-2"
        >
          {[
            "Sin registro",
            "100% gratuito",
            "Resultados inmediatos",
            "Sin fórmulas complicadas",
          ].map((v) => (
            <li
              key={v}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80 ring-1 ring-inset ring-white/10"
            >
              <span aria-hidden="true" className="font-bold text-emerald-400">
                ✓
              </span>
              {v}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#form-section"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-900 shadow-lg shadow-black/20 transition-all duration-200 hover:bg-indigo-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-900"
        >
          Calcular mi negocio
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}
