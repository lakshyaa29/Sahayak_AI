"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface LargeRadioGroupProps {
  name: string;
  legend: string;
  legendSrOnly?: boolean;
  instruction?: string;
  options: RadioOption[];
  value: string;
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function LargeRadioGroup({
  name,
  legend,
  legendSrOnly = true,
  instruction,
  options,
  value,
  onChange,
  error,
  disabled = false,
  className = "",
}: LargeRadioGroupProps) {
  const generatedId = useId();
  const errorId = `${generatedId}-error`;
  const instructionId = `${generatedId}-instruction`;

  return (
    <fieldset
      className={cn("space-y-3", className)}
      aria-invalid={Boolean(error)}
      aria-describedby={cn(
        instruction ? instructionId : undefined,
        error ? errorId : undefined
      )}
    >
      <legend
        className={cn(
          "font-semibold text-ink text-sm sm:text-base",
          legendSrOnly ? "sr-only" : "mb-2 block"
        )}
      >
        {legend}
      </legend>

      {instruction && (
        <p id={instructionId} className="text-xs sm:text-sm text-secondary mb-3">
          {instruction}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs sm:text-sm font-semibold text-error bg-error/10 border-l-3 border-error p-2.5 rounded-xs"
        >
          {error}
        </p>
      )}

      <div className="space-y-2.5" role="radiogroup" aria-labelledby={generatedId}>
        {options.map((option) => {
          const isSelected = value === option.value;
          const optionId = `${name}-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                "group relative flex items-start gap-3.5 p-4 rounded-xs border transition-colors cursor-pointer select-none min-h-[56px]",
                isSelected
                  ? "border-ink bg-surface-muted/60"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-muted/30",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {/* Radio Circle Indicator */}
              <span className="flex items-center justify-center pt-0.5">
                <input
                  type="radio"
                  id={optionId}
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  disabled={disabled}
                  onChange={() => onChange(option.value)}
                  className="sr-only peer"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all bg-surface",
                    isSelected
                      ? "border-ink ring-1 ring-ink"
                      : "border-border-strong group-hover:border-ink",
                    "peer-focus-visible:ring-3 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 peer-focus-visible:outline-hidden"
                  )}
                >
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-ink" />
                  )}
                </span>
              </span>

              {/* Text content */}
              <span className="flex-1 text-left flex flex-col justify-center min-h-[22px]">
                <span
                  className={cn(
                    "text-sm sm:text-base leading-snug tracking-tight",
                    isSelected ? "font-semibold text-ink" : "font-normal text-foreground"
                  )}
                >
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-xs sm:text-sm text-secondary mt-1 leading-relaxed">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
