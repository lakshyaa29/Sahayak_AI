import React, {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  forwardRef,
} from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Search, X } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Input                                                                      */
/* -------------------------------------------------------------------------- */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-ink-900 select-none">
            {label} {props.required && <span className="text-destructive" aria-hidden="true">*</span>}
          </label>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-neutral-600">
            {helperText}
          </p>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full min-h-[44px] rounded-[4px] border bg-surface px-3.5 py-2 text-base text-ink-900 transition-colors placeholder:text-neutral-500",
            "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus focus-visible:ring-offset-1 focus-visible:border-ink-900",
            "disabled:cursor-not-allowed disabled:bg-paper-200 disabled:opacity-60 disabled:border-border-default",
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
        {error && (
          <p id={`${inputId}-error`} className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1" role="alert">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

/* -------------------------------------------------------------------------- */
/* CurrencyInput                                                              */
/* -------------------------------------------------------------------------- */
export interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: number;
  onChange?: (value: number) => void;
  label?: string;
  error?: string;
  helperText?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ label, error, helperText, value, onChange, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      const parsed = raw ? parseInt(raw, 10) : 0;
      if (onChange) {
        onChange(parsed);
      }
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-ink-900 select-none">
            {label} {props.required && <span className="text-destructive" aria-hidden="true">*</span>}
          </label>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-neutral-600">
            {helperText}
          </p>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-600 font-semibold select-none">
            <span>₹</span>
          </div>
          <input
            id={inputId}
            ref={ref}
            type="text"
            inputMode="numeric"
            value={value ? value.toLocaleString("en-IN") : ""}
            onChange={handleChange}
            className={cn(
              "w-full min-h-[44px] rounded-[4px] border bg-surface pl-8 pr-4 py-2 text-base font-semibold tabular-nums text-ink-900 transition-colors placeholder:text-neutral-500",
              "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus focus-visible:ring-offset-1 focus-visible:border-ink-900",
              "disabled:cursor-not-allowed disabled:bg-paper-200 disabled:opacity-60 disabled:border-border-default",
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
          <p id={`${inputId}-error`} className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1" role="alert">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";

/* -------------------------------------------------------------------------- */
/* Textarea                                                                   */
/* -------------------------------------------------------------------------- */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-semibold text-ink-900 select-none">
            {label} {props.required && <span className="text-destructive" aria-hidden="true">*</span>}
          </label>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="text-xs text-neutral-600">
            {helperText}
          </p>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "w-full min-h-[96px] rounded-[4px] border bg-surface p-3 text-base text-ink-900 transition-colors placeholder:text-neutral-500",
            "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus focus-visible:ring-offset-1 focus-visible:border-ink-900",
            "disabled:cursor-not-allowed disabled:bg-paper-200 disabled:opacity-60 disabled:border-border-default",
            error
              ? "border-2 border-destructive focus-visible:border-destructive"
              : "border-border-default hover:border-ink-700",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1" role="alert">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

/* -------------------------------------------------------------------------- */
/* Select                                                                     */
/* -------------------------------------------------------------------------- */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, children, className, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-semibold text-ink-900 select-none">
            {label} {props.required && <span className="text-destructive" aria-hidden="true">*</span>}
          </label>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="text-xs text-neutral-600">
            {helperText}
          </p>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full min-h-[44px] rounded-[4px] border bg-surface px-3.5 py-2 pr-10 text-base text-ink-900 transition-colors appearance-none",
              "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus focus-visible:ring-offset-1 focus-visible:border-ink-900",
              "disabled:cursor-not-allowed disabled:bg-paper-200 disabled:opacity-60 disabled:border-border-default",
              error
                ? "border-2 border-destructive focus-visible:border-destructive"
                : "border-border-default hover:border-ink-700",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-ink-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1" role="alert">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

/* -------------------------------------------------------------------------- */
/* Checkbox                                                                   */
/* -------------------------------------------------------------------------- */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className, id, ...props }, ref) => {
    const checkId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1">
        <label htmlFor={checkId} className="flex items-start gap-3 cursor-pointer select-none min-h-[44px] py-1">
          <input
            id={checkId}
            ref={ref}
            type="checkbox"
            className={cn(
              "w-5 h-5 rounded-[2px] border-2 border-border-default text-ink-900 focus:ring-3 focus:ring-focus focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus mt-0.5 transition-colors cursor-pointer accent-[#C65D27]",
              className
            )}
            {...props}
          />
          <div className="text-sm text-ink-900">
            <span className="font-semibold block leading-tight">{label}</span>
            {description && (
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </label>
        {error && (
          <p className="text-xs font-medium text-destructive flex items-center gap-1.5 pl-8 mt-1" role="alert">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

/* -------------------------------------------------------------------------- */
/* SearchInput                                                                */
/* -------------------------------------------------------------------------- */
export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-600">
          <Search className="w-4 h-4" aria-hidden="true" />
        </div>
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            "w-full min-h-[44px] rounded-[4px] border border-border-default bg-surface pl-10 pr-10 py-2 text-base text-ink-900 placeholder:text-neutral-500",
            "focus-visible:outline-none focus-visible:border-ink-900 focus-visible:ring-3 focus-visible:ring-focus focus-visible:ring-offset-1 hover:border-ink-700",
            className
          )}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-600 hover:text-ink-900"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

/* -------------------------------------------------------------------------- */
/* FormErrorSummary                                                           */
/* -------------------------------------------------------------------------- */
export type FormErrorItem = string | { fieldId?: string; message: string };

export function FormErrorSummary({
  errors,
  title = "Please review the following errors:",
}: {
  errors: FormErrorItem[];
  title?: string;
}) {
  if (!errors.length) return null;

  return (
    <div
      role="alert"
      className="p-4 rounded-[4px] bg-[#F4DADA] border-2 border-destructive text-ink-900 text-sm space-y-2"
    >
      <div className="flex items-center gap-2 font-bold text-destructive">
        <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>{title}</span>
      </div>
      <ul className="list-disc list-inside space-y-1 text-xs pl-1">
        {errors.map((err, i) => {
          const msg = typeof err === "string" ? err : err.message;
          const fieldId = typeof err === "object" ? err.fieldId : undefined;
          return (
            <li key={i}>
              {fieldId ? (
                <a href={`#${fieldId}`} className="underline text-destructive font-semibold hover:text-red-900">
                  {msg}
                </a>
              ) : (
                msg
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
