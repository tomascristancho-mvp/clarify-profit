import type { InterpretationMessage } from "@/domain/types";

interface InterpretationMessagesProps {
  messages: InterpretationMessage[];
}

const TYPE_CONFIG = {
  alerta: {
    borderClass: "border-l-red-400",
    iconClass: "text-red-400",
    textClass: "text-red-700 dark:text-red-300",
    icon: "⚠",
    srLabel: "Alerta",
  },
  informacion: {
    borderClass: "border-l-blue-400",
    iconClass: "text-blue-400",
    textClass: "text-blue-700 dark:text-blue-300",
    icon: "ℹ",
    srLabel: "Información",
  },
  positivo: {
    borderClass: "border-l-emerald-400",
    iconClass: "text-emerald-500",
    textClass: "text-emerald-700 dark:text-emerald-300",
    icon: "✓",
    srLabel: "Positivo",
  },
} as const;

export function InterpretationMessages({ messages }: InterpretationMessagesProps) {
  if (messages.length === 0) return null;

  return (
    <section aria-labelledby="interpretation-heading">
      <h3
        id="interpretation-heading"
        className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400"
      >
        Lectura rápida
      </h3>
      <ul className="flex flex-col gap-2" role="list">
        {messages.map((message, index) => {
          const config = TYPE_CONFIG[message.type];
          return (
            <li
              key={index}
              className={`flex items-start gap-3 rounded-lg border-l-4 bg-white px-3 py-3 shadow-sm dark:bg-slate-900 ${config.borderClass}`}
            >
              <span
                className={`flex-shrink-0 font-bold ${config.iconClass}`}
                aria-hidden="true"
              >
                {config.icon}
              </span>
              <p className={`text-xs leading-relaxed ${config.textClass}`}>
                <span className="sr-only">{config.srLabel}: </span>
                {message.message}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
