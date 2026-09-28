import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "destructive"
  | "neutral"
  | "demo";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "default";
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-[#F5E1D4] text-ink-900 border-[#C65D27]",
  secondary: "bg-paper-200 text-ink-900 border-ink-800",
  success: "bg-[#DAEBDD] text-green-700 border-green-600/50",
  warning: "bg-[#F7E9C8] text-amber-800 border-amber-500/50",
  error: "bg-[#F4DADA] text-red-800 border-destructive/50",
  destructive: "bg-[#F4DADA] text-red-800 border-destructive/50",
  neutral: "bg-paper-100 text-ink-900 border-border-default",
  demo: "bg-paper-200 text-ink-900 border-border-strong font-bold tracking-wide",
};

export function Badge({
  className,
  variant = "neutral",
  size = "default",
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    default: "px-2.5 py-0.5 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[2px] font-medium border select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* StatusBadge (Always pairs text with an icon)                               */
/* -------------------------------------------------------------------------- */
export type OperationalStatus =
  | "ACTIVE_ELIGIBLE"
  | "HIGH_NPA_RESTRICTED"
  | "QUOTA_EXHAUSTED"
  | "UNDER_REVIEW"
  | "verified"
  | "active"
  | "pending"
  | "sample"
  | "disabled";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: OperationalStatus;
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const normalizedStatus: "ACTIVE_ELIGIBLE" | "HIGH_NPA_RESTRICTED" | "QUOTA_EXHAUSTED" | "UNDER_REVIEW" =
    status === "verified" || status === "active"
      ? "ACTIVE_ELIGIBLE"
      : status === "disabled" || status === "HIGH_NPA_RESTRICTED"
      ? "HIGH_NPA_RESTRICTED"
      : status === "sample" || status === "QUOTA_EXHAUSTED"
      ? "QUOTA_EXHAUSTED"
      : "UNDER_REVIEW";

  const configs = {
    ACTIVE_ELIGIBLE: {
      label: "Active · Eligible for routing",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-700 flex-shrink-0" aria-hidden="true" />,
      variant: "success" as BadgeVariant,
    },
    HIGH_NPA_RESTRICTED: {
      label: "Restricted (Gross NPA > 5%)",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-destructive flex-shrink-0" aria-hidden="true" />,
      variant: "destructive" as BadgeVariant,
    },
    QUOTA_EXHAUSTED: {
      label: "Annual quota saturated",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" aria-hidden="true" />,
      variant: "warning" as BadgeVariant,
    },
    UNDER_REVIEW: {
      label: "Operational status under review",
      icon: <Clock className="w-3.5 h-3.5 text-ink-600 flex-shrink-0" aria-hidden="true" />,
      variant: "neutral" as BadgeVariant,
    },
  };

  const config = configs[normalizedStatus];

  return (
    <Badge variant={config.variant} className={cn("gap-1.5 py-1 px-2.5", className)} {...props}>
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
}

/* -------------------------------------------------------------------------- */
/* DataFreshnessBadge                                                         */
/* -------------------------------------------------------------------------- */
export function DataFreshnessBadge({
  date = "Q4 2024",
  className,
}: {
  date?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] text-neutral-600 bg-paper-100 border border-border-default px-2 py-0.5 rounded-[2px]",
        className
      )}
    >
      <Clock className="w-3 h-3 text-ink-600" aria-hidden="true" />
      <span>Audit: {date}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* DemoDataBadge                                                              */
/* -------------------------------------------------------------------------- */
export function DemoDataBadge({ className }: { className?: string }) {
  return (
    <Badge variant="demo" size="sm" className={cn("text-[10px] uppercase font-bold", className)}>
      Prototype · Sample data
    </Badge>
  );
}
