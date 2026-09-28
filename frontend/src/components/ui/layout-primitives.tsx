import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* PageContainer                                                              */
/* -------------------------------------------------------------------------- */
export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "narrow" | "wide" | "form";
}

export function PageContainer({
  variant = "default",
  className,
  children,
  ...props
}: PageContainerProps) {
  const maxWidths = {
    narrow: "max-w-narrow",   // ~42rem / 672px
    default: "max-w-content", // ~68rem / 1088px
    form: "max-w-form",       // ~45rem / 720px
    wide: "max-w-wide",       // ~80rem / 1280px
  };

  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        maxWidths[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                    */
/* -------------------------------------------------------------------------- */
export interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "default" | "lg";
}

export function Section({
  spacing = "default",
  className,
  children,
  ...props
}: SectionProps) {
  const spacings = {
    sm: "py-4 md:py-6",
    default: "py-6 md:py-10",
    lg: "py-10 md:py-14",
  };

  return (
    <section className={cn(spacings[spacing], className)} {...props}>
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Stack                                                                      */
/* -------------------------------------------------------------------------- */
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: 2 | 3 | 4 | 6 | 8 | 10 | 12;
}

export function Stack({ gap = 4, className, children, ...props }: StackProps) {
  const gapClasses = {
    2: "space-y-2",
    3: "space-y-3",
    4: "space-y-4",
    6: "space-y-6",
    8: "space-y-8",
    10: "space-y-10",
    12: "space-y-12",
  };

  return (
    <div className={cn("flex flex-col", gapClasses[gap], className)} {...props}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ResponsiveGrid                                                             */
/* -------------------------------------------------------------------------- */
export interface ResponsiveGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
}

export function ResponsiveGrid({
  columns = 3,
  className,
  children,
  ...props
}: ResponsiveGridProps) {
  const colClasses = {
    2: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6",
    3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
    4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6",
  };

  return (
    <div className={cn(colClasses[columns], className)} {...props}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PageHeader                                                                 */
/* -------------------------------------------------------------------------- */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  badge,
  className,
  children,
}: {
  title: string;
  description?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-3 pb-6 border-b border-border", className)}>
      {breadcrumbs && <div className="text-xs">{breadcrumbs}</div>}
      {badge && <div>{badge}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-900 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex-shrink-0 flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FormSection                                                                */
/* -------------------------------------------------------------------------- */
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("space-y-4 border border-border bg-surface p-5 sm:p-6 rounded-[4px]", className)}>
      {title && (
        <legend className="text-base font-bold text-ink-900 px-1 leading-snug">
          {title}
        </legend>
      )}
      {description && (
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed -mt-2">
          {description}
        </p>
      )}
      <div className="space-y-4 pt-1">{children}</div>
    </fieldset>
  );
}
