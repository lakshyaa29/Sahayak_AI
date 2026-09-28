"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { ClipboardList, ArrowRight } from "lucide-react";

interface IncompleteResultViewProps {
  className?: string;
}

export function IncompleteResultView({ className = "" }: IncompleteResultViewProps) {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  return (
    <div
      role="region"
      aria-labelledby="incomplete-heading"
      className={`max-w-xl mx-auto border border-paper-200 rounded-sm bg-paper-50 p-6 sm:p-8 space-y-6 text-center ${className}`}
    >
      <div className="w-12 h-12 rounded-sm bg-paper-100 text-ink-700 flex items-center justify-center mx-auto border border-paper-200">
        <ClipboardList className="w-6 h-6 stroke-[1.75]" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <h1
          id="incomplete-heading"
          className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight"
        >
          {resT.incompleteTitle}
        </h1>
        <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
          {resT.incompleteDesc}
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/assessment"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-accent hover:bg-accent-hover text-white font-bold text-sm transition-colors w-full sm:w-auto"
        >
          <span>{resT.takeAssessmentBtn}</span>
          <ArrowRight className="w-4 h-4 text-white" aria-hidden="true" />
        </Link>
      </div>

      <p className="text-[11px] text-ink-500">
        {isHindi
          ? "लगभग 3 मिनट लगते हैं • किसी दस्तावेज़ अपलोड या लॉगिन की आवश्यकता नहीं"
          : "Takes under 3 minutes • No document upload or login required"}
      </p>
    </div>
  );
}
