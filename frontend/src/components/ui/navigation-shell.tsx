"use client";

import React, { HTMLAttributes } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/* SkipToContent                                                              */
/* -------------------------------------------------------------------------- */
export function SkipToContent({ targetId = "main-content" }: { targetId?: string }) {
  return (
    <a href={`#${targetId}`} className="skip-to-content focus:outline-none">
      Skip to main content
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/* BackLink                                                                   */
/* -------------------------------------------------------------------------- */
export interface BackLinkProps {
  href: string;
  label?: string;
  className?: string;
}

export function BackLink({ href, label = "Back", className }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-input p-1 focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      <span>{label}</span>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* StickyMobileActionBar                                                      */
/* -------------------------------------------------------------------------- */
export interface ActionConfig {
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

export interface StickyMobileActionBarProps extends HTMLAttributes<HTMLDivElement> {
  backAction?: React.ReactNode | ActionConfig;
  secondaryAction?: React.ReactNode | ActionConfig;
  primaryAction: React.ReactNode | ActionConfig;
}

function renderAction(action: React.ReactNode | ActionConfig, isPrimary = true) {
  if (!action) return null;
  if (React.isValidElement(action)) return action;

  const config = action as ActionConfig;
  if (config.href) {
    return (
      <Link href={config.href} className="w-full block">
        <Button
          variant={isPrimary ? "primary" : "outline"}
          size="sm"
          className="w-full"
          disabled={config.disabled}
        >
          {config.label}
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant={isPrimary ? "primary" : "outline"}
      size="sm"
      className="w-full"
      onClick={config.onClick}
      disabled={config.disabled}
    >
      {config.label}
    </Button>
  );
}

export function StickyMobileActionBar({
  backAction,
  secondaryAction,
  primaryAction,
  className,
  ...props
}: StickyMobileActionBarProps) {
  const leftItem = secondaryAction ?? backAction;

  return (
    <div
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-md border-t border-border p-3 px-4 shadow-floating flex items-center justify-between gap-3 safe-area-bottom",
        className
      )}
      {...props}
    >
      {leftItem ? (
        <div className="flex-shrink-0 min-w-[80px]">{renderAction(leftItem, false)}</div>
      ) : (
        <div />
      )}
      <div className="flex-1 max-w-xs">{renderAction(primaryAction, true)}</div>
    </div>
  );
}
