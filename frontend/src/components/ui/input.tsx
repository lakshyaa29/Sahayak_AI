import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixSymbol?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, prefixSymbol, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-ink-900 select-none"
          >
            {label} {props.required && <span className="text-destructive" aria-hidden="true">*</span>}
          </label>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-neutral-600">
            {helperText}
          </p>
        )}
        <div className="relative">
          {prefixSymbol && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-600 font-semibold select-none">
              <span>{prefixSymbol}</span>
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "w-full min-h-[44px] rounded-[4px] border bg-surface px-3.5 py-2 text-base text-ink-900 transition-colors placeholder:text-neutral-500",
              "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus focus-visible:ring-offset-1 focus-visible:border-ink-900",
              "disabled:cursor-not-allowed disabled:bg-paper-200 disabled:opacity-60 disabled:border-border-default",
              prefixSymbol ? "pl-9" : "",
              error
                ? "border-2 border-destructive focus-visible:border-destructive"
                : "border-border-default hover:border-ink-700",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1"
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
