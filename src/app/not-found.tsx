import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 px-4 text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-300">
        Error 404
      </p>
      <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Esta página no existe
      </h1>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-white/70">
        El enlace que seguiste no lleva a ningún lugar. La calculadora de
        rentabilidad te espera en la página principal.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-900 shadow-lg transition-colors hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Ir a la calculadora
        <span aria-hidden="true">→</span>
      </Link>
      <p className="mt-10 text-xs text-white/60">
        Negocio Claro · Un producto de AI Health Colombia
      </p>
    </main>
  );
}
