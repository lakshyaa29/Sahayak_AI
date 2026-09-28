"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";

interface WhyWeAskProps {
  explanation: string;
  title?: string;
  className?: string;
}

export function WhyWeAsk({ explanation, title, className = "" }: WhyWeAskProps) {
  const { t } = useLanguage();
  const heading = title || t.assessment.guided.whyWeAskTitle;

  return (
    <aside
      aria-label={heading}
      className={`border border-border bg-surface-muted/60 rounded-xs p-3.5 sm:p-4 text-xs text-secondary leading-relaxed ${className}`}
    >
      <div className="font-semibold text-ink text-xs uppercase tracking-wider mb-1">
        {heading}
      </div>
      <p className="text-secondary text-xs sm:text-sm leading-relaxed">{explanation}</p>
    </aside>
  );
}
