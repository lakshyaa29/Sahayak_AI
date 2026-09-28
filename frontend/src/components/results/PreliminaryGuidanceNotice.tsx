"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { Info } from "lucide-react";

interface PreliminaryGuidanceNoticeProps {
  className?: string;
}

export function PreliminaryGuidanceNotice({ className = "" }: PreliminaryGuidanceNoticeProps) {
  const { t } = useLanguage();
  const resT = t.results;

  return (
    <div
      role="region"
      aria-label={resT.preliminaryStatusLabel}
      className={`border-l-4 border-accent bg-paper-100 p-4 rounded-sm text-xs text-ink-700 space-y-1.5 ${className}`}
    >
      <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-ink-900 text-[11px]">
        <Info className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
        <span>{resT.preliminaryStatusLabel}</span>
      </div>
      <p className="leading-relaxed text-ink-700">
        {resT.preliminaryDisclaimer}
      </p>
    </div>
  );
}
