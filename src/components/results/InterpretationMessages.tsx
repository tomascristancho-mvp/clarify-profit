import type { InterpretationMessage } from "@/domain/types";

interface InterpretationMessagesProps {
  messages: InterpretationMessage[];
}

const TYPE_CONFIG = {
  alerta: {
    containerClass: "border-red-200 bg-red-50",
    iconClass: "text-red-500",
    textClass: "text-red-800",
    icon: "⚠",
    srLabel: "Alerta",
  },
  informacion: {
    containerClass: "border-blue-200 bg-blue-50",
    iconClass: "text-blue-500",
    textClass: "text-blue-800",
    icon: "ℹ",
    srLabel: "Información",
  },
  positivo: {
    containerClass: "border-emerald-200 bg-emerald-50",
    iconClass: "text-emerald-600",
    textClass: "text-emerald-800",
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
        className="mb-3 text-lg font-semibold text-slate-800"
      >
        Interpretación educativa
      </h3>
      <ul className="flex flex-col gap-2" role="list">
        {messages.map((message, index) => {
          const config = TYPE_CONFIG[message.type];
          return (
            <li
              key={index}
              className={`flex items-start gap-3 rounded-md border px-4 py-3 ${config.containerClass}`}
            >
              <span
                className={`flex-shrink-0 font-bold ${config.iconClass}`}
                aria-hidden="true"
              >
                {config.icon}
              </span>
              <p className={`text-sm leading-relaxed ${config.textClass}`}>
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
