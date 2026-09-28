import React, { forwardRef, ButtonHTMLAttributes } from "react";
import Link, { LinkProps } from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
export type ButtonSize = "default" | "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const baseButtonStyles =
  "inline-flex items-center justify-center font-semibold rounded-[4px] border transition-colors duration-160 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent border-accent text-white hover:bg-accent-hover active:bg-accent-active shadow-none",
  secondary:
    "bg-surface border-2 border-ink-900 text-ink-900 hover:bg-paper-200 active:bg-paper-200/80 shadow-none",
  outline:
    "bg-surface border border-border-default text-ink-900 hover:bg-paper-100 hover:border-ink-800 active:bg-paper-200 shadow-none",
  ghost:
    "bg-transparent border-transparent text-ink-900 hover:bg-paper-200 active:bg-paper-200/80 shadow-none",
  destructive:
    "bg-destructive border-destructive text-white hover:bg-red-700 active:bg-red-800 shadow-none",
  link:
    "bg-transparent border-transparent text-link underline hover:text-link-hover p-0 min-h-0 font-normal inline",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "min-h-[44px] px-4 py-2 text-base gap-2",
  sm: "min-h-[40px] px-3 py-1 text-sm gap-1.5",
  md: "min-h-[44px] px-4 py-2 text-base gap-2",
  lg: "min-h-[48px] px-6 py-2.5 text-base font-bold gap-2.5",
  icon: "min-h-[44px] min-w-[44px] p-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      isLoading = false,
      leadingIcon,
      trailingIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseButtonStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          <>
            {leadingIcon && <span className="flex-shrink-0" aria-hidden="true">{leadingIcon}</span>}
            <span>{children}</span>
            {trailingIcon && <span className="flex-shrink-0" aria-hidden="true">{trailingIcon}</span>}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

/* -------------------------------------------------------------------------- */
/* StyledLink                                                                 */
/* -------------------------------------------------------------------------- */
export interface StyledLinkProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  target?: string;
  rel?: string;
}

export function StyledLink({
  variant = "primary",
  size = "default",
  className,
  children,
  leadingIcon,
  trailingIcon,
  ...props
}: StyledLinkProps) {
  return (
    <Link
      className={cn(baseButtonStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {leadingIcon && <span className="flex-shrink-0" aria-hidden="true">{leadingIcon}</span>}
      <span>{children}</span>
      {trailingIcon && <span className="flex-shrink-0" aria-hidden="true">{trailingIcon}</span>}
    </Link>
  );
}
