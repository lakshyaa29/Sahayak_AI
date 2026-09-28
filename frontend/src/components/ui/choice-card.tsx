import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface ChoiceCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  type?: "radio" | "checkbox";
  icon?: React.ReactNode;
  disabled?: boolean;
  name?: string;
  value?: string;
  className?: string;
}

export function ChoiceCard({
  title,
  description,
  selected,
  onSelect,
  type = "radio",
  icon,
  disabled = false,
  className,
}: ChoiceCardProps) {
  const isRadio = type === "radio";

  return (
    <div
      role={isRadio ? "radio" : "checkbox"}
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (!disabled) onSelect();
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "w-full text-left p-4 md:p-5 rounded-[4px] border-2 transition-colors duration-160 flex items-start gap-3.5 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus focus-visible:ring-offset-2",
        selected
          ? "border-ink-900 bg-surface shadow-none"
          : "border-border-default bg-surface hover:border-ink-700 hover:bg-paper-100",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none bg-paper-200",
        className
      )}
    >
      {/* Visual Indicator: Round for radio, square for checkbox. High contrast in grayscale. */}
      <div
        className={cn(
          "w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-colors",
          isRadio ? "rounded-full" : "rounded-[2px]",
          selected
            ? "border-ink-900 bg-ink-900 text-white"
            : "border-ink-700 bg-surface"
        )}
        aria-hidden="true"
      >
        {selected && (
          isRadio ? (
            <div className="w-2 h-2 rounded-full bg-white" />
          ) : (
            <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
          )
        )}
      </div>

      {icon && (
        <div
          className={cn(
            "p-2 rounded-[2px] flex-shrink-0 transition-colors border",
            selected ? "bg-paper-200 border-ink-900 text-ink-900" : "bg-paper-100 border-border-default text-ink-700"
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <span
          className={cn(
            "text-base font-bold block text-ink-900 leading-snug",
            selected && "text-ink-900"
          )}
        >
          {title}
        </span>
        {description && (
          <p className="text-sm text-neutral-700 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
