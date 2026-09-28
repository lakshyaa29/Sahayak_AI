import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface JourneyStep {
  id: number;
  label: string;
  href?: string;
}

export const JOURNEY_STEPS: JourneyStep[] = [
  { id: 1, label: "Discovery", href: "/" },
  { id: 2, label: "Assessment", href: "/assessment" },
  { id: 3, label: "Schemes", href: "/results" },
  { id: 4, label: "Calculator", href: "/calculator" },
  { id: 5, label: "Partners", href: "/partners" },
];

export interface JourneyProgressIndicatorProps {
  currentStep: number;
  steps?: JourneyStep[];
  className?: string;
}

export function JourneyProgressIndicator({
  currentStep,
  steps = JOURNEY_STEPS,
  className,
}: JourneyProgressIndicatorProps) {
  return (
    <nav aria-label="Journey Progress" className={cn("w-full", className)}>
      {/* Mobile progress indicator */}
      <div className="md:hidden space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-primary uppercase tracking-wider">
            Step {currentStep} of {steps.length}
          </span>
          <span className="font-semibold text-foreground">
            {steps[currentStep - 1]?.label}
          </span>
        </div>
        <div
          className="w-full bg-surface-muted h-2 rounded-full overflow-hidden border border-border"
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={steps.length}
        >
          <div
            className="bg-primary h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop step indicators */}
      <ol className="hidden md:flex items-center justify-between w-full">
        {steps.map((step, idx) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <li
              key={step.id}
              className={cn(
                "flex-1 flex items-center",
                idx !== steps.length - 1 &&
                  "after:content-[''] after:w-full after:h-0.5 after:border-b after:border-border after:inline-block after:mx-2",
                isCompleted && idx !== steps.length - 1 && "after:border-primary"
              )}
            >
              <div
                aria-current={isCurrent ? "step" : undefined}
                className="flex items-center gap-2 text-left"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors flex-shrink-0 border",
                    isCompleted && "bg-primary border-primary text-white",
                    isCurrent && "bg-primary/10 border-primary text-primary ring-2 ring-primary ring-offset-2",
                    !isCompleted && !isCurrent && "bg-surface border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold whitespace-nowrap",
                    isCurrent && "text-primary font-bold",
                    isCompleted && "text-foreground",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
