"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { AlertCircle, RotateCcw, ArrowRight } from "lucide-react";

interface ResultErrorViewProps {
  onRetry: () => void;
  className?: string;
}

export function ResultErrorView({ onRetry, className = "" }: ResultErrorViewProps) {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  return (
    <div
      role="alert"
      aria-labelledby="error-heading"
      className={`border border-paper-200 rounded-sm bg-paper-50 p-6 sm:p-8 space-y-6 ${className}`}
    >
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-ink-700 font-bold uppercase text-[11px] tracking-wider bg-paper-100 px-2.5 py-1 rounded-sm border border-paper-200">
          <AlertCircle className="w-4 h-4 text-accent" aria-hidden="true" />
          <span>{isHindi ? "सिस्टम सूचना" : "System Notice"}</span>
        </div>

        <h1
          id="error-heading"
          className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight"
        >
          {resT.errorHeading}
        </h1>

        <p className="text-sm text-ink-600 leading-relaxed max-w-2xl">
          {resT.errorSub}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-accent hover:bg-accent-hover text-white font-bold text-xs transition-colors"
        >
          <span>{resT.retryBtn}</span>
        </button>

        <Link
          href="/assessment?step=review"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm border border-paper-200 bg-paper-100 hover:bg-paper-200 text-ink-900 font-semibold text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-ink-600" aria-hidden="true" />
          <span>{resT.secondaryReviewAnswers}</span>
        </Link>
      </div>
    </div>
  );
}
