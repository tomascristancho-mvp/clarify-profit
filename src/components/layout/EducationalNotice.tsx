export function EducationalNotice() {
  return (
    <footer className="bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-5 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
          <p className="text-sm leading-relaxed text-slate-300">
            Los resultados son{" "}
            <strong className="font-semibold text-white">estimaciones educativas</strong>{" "}
            calculadas con los datos que ingresaste. No tienen en cuenta impuestos,
            costos de oportunidad ni imprevistos. Antes de tomar decisiones financieras
            importantes,{" "}
            <strong className="font-semibold text-white">
              consulta con un contador o asesor de confianza.
            </strong>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            ¿Tienes preguntas sobre estos resultados? Compártelos con tu contador o asesor
            de confianza — ellos pueden ayudarte a interpretar las cifras dentro del
            contexto real de tu negocio.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-0.5 sm:items-start">
            <p className="text-sm font-semibold text-white">Negocio Claro</p>
            <p className="text-xs text-slate-500">
              Un producto de{" "}
              <span className="font-medium text-slate-400">AI Health Colombia</span>
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Herramienta educativa gratuita para emprendedores · Hecho en Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
