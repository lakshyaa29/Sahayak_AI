import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepItem {
  id: number;
  label: string;
}

interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <nav aria-label="Assessment Progress" className={cn("w-full mb-6", className)}>
      {/* Mobile step label */}
      <div className="md:hidden flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-primary-700 tracking-wider uppercase">
          Step {currentStep} of {steps.length}
        </span>
        <span className="text-sm font-bold text-neutral-950">
          {steps[currentStep - 1]?.label}
        </span>
      </div>

      {/* Progress bar line for mobile */}
      <div className="md:hidden w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-primary-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>

      {/* Desktop Stepper */}
      <ol className="hidden md:flex items-center justify-between w-full">
        {steps.map((step, idx) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isFuture = step.id > currentStep;

          return (
            <li
              key={step.id}
              className={cn(
                "flex-1 flex items-center",
                idx !== steps.length - 1 ? "after:content-[''] after:w-full after:h-0.5 after:border-b after:border-neutral-300 after:inline-block after:mx-2" : "",
                isCompleted && idx !== steps.length - 1 ? "after:border-primary-600" : ""
              )}
            >
              <button
                type="button"
                disabled={isFuture || !onStepClick}
                onClick={() => onStepClick && onStepClick(step.id)}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md p-1",
                  isFuture && "cursor-not-allowed opacity-60"
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors select-none",
                    isCompleted
                      ? "bg-primary-600 text-white"
                      : isCurrent
                      ? "bg-primary-100 text-primary-800 border-2 border-primary-600 font-extrabold"
                      : "bg-neutral-100 text-neutral-600 border border-neutral-300"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold whitespace-nowrap",
                    isCurrent ? "text-primary-700 font-bold" : isCompleted ? "text-neutral-900" : "text-neutral-500"
                  )}
                >
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
