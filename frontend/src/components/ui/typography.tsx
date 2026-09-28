import React, { HTMLAttributes } from "react";
import { cn, formatCurrencyINR } from "@/lib/utils";

export function DisplayHeading({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink-900 leading-[1.2]",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function PageHeading({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "text-2xl sm:text-3xl font-bold tracking-tight text-ink-900 leading-[1.25]",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function SectionHeading({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-xl sm:text-2xl font-semibold tracking-tight text-ink-900 leading-[1.3]",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function CardHeading({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg sm:text-xl font-semibold tracking-tight text-ink-900 leading-[1.35]",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function BodyLarge({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-lg text-neutral-700 leading-relaxed max-w-[70ch]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Body({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-base text-neutral-700 leading-normal max-w-[70ch]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function SupportingText({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm text-neutral-600 leading-relaxed max-w-[70ch]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function FormLabelText({
  className,
  children,
  required,
  ...props
}: HTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label
      className={cn(
        "block text-sm font-semibold text-ink-900 select-none leading-snug",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
    </label>
  );
}

export function Caption({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("text-xs text-neutral-600 leading-normal", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function FinancialFigure({
  amount,
  value,
  label,
  period,
  currency = "₹",
  highlight = false,
  className,
  size = "md",
}: {
  amount?: number | string;
  value?: number | string;
  label?: string;
  period?: string;
  currency?: string;
  highlight?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const numOrStr = amount !== undefined ? amount : (value !== undefined ? value : 0);
  const formattedAmount =
    typeof numOrStr === "number" ? formatCurrencyINR(numOrStr) : numOrStr;

  const sizeClasses = {
    sm: "text-base",
    md: "text-xl sm:text-2xl font-bold",
    lg: "text-2xl sm:text-3xl font-extrabold",
  };

  return (
    <div className={cn("inline-flex flex-col", className)}>
      {label && (
        <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-0.5">
          {label}
        </span>
      )}
      <div className="inline-flex items-baseline gap-1 tabular-nums">
        <span className="text-sm font-semibold text-neutral-600 select-none">
          {currency}
        </span>
        <span
          className={cn(
            "tracking-tight",
            sizeClasses[size],
            highlight ? "text-accent" : "text-ink-900"
          )}
        >
          {formattedAmount}
        </span>
        {period && (
          <span className="text-xs text-neutral-600 font-normal">
            /{period}
          </span>
        )}
      </div>
    </div>
  );
}
