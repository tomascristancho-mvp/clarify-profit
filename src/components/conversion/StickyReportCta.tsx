"use client";

import { useEffect, useState } from "react";

// Mobile-only floating bar that keeps the premium report offer visible while
// the user scrolls through the results. Hides itself when the report section
// is already on screen to avoid covering its own CTA.
export function StickyReportCta() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("reporte-ejecutivo");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:hidden dark:border-slate-700 dark:bg-slate-900/95">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
            Reporte ejecutivo premium
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            <strong className="text-indigo-600 dark:text-indigo-400">$9.900 COP</strong> · Versión piloto
          </p>
        </div>
        <a
          href="#reporte-ejecutivo"
          className="flex-shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Ver reporte
        </a>
      </div>
    </div>
  );
}
