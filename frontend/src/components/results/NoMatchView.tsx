"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { EvaluatedCondition } from "@/lib/assessment-context";
import { AlertCircle, RotateCcw, Building2, ArrowRight } from "lucide-react";

interface NoMatchViewProps {
  failedConditions?: EvaluatedCondition[];
  district?: string;
  state?: string;
  className?: string;
}

export function NoMatchView({
  failedConditions = [],
  district = "Wardha",
  state = "Maharashtra",
  className = "",
}: NoMatchViewProps) {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  const partnerQuery = new URLSearchParams();
  if (district) partnerQuery.set("district", district);
  if (state) partnerQuery.set("state", state);
  const partnerUrl = `/partners?${partnerQuery.toString()}`;

  return (
    <div
      role="region"
      aria-labelledby="no-match-heading"
      className={`border border-paper-200 rounded-sm bg-paper-50 p-6 sm:p-8 space-y-6 ${className}`}
    >
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-ink-700 font-bold uppercase text-[11px] tracking-wider bg-paper-100 px-2.5 py-1 rounded-sm border border-paper-200">
          <AlertCircle className="w-4 h-4 text-accent" aria-hidden="true" />
          <span>{isHindi ? "मार्गदर्शन स्थिति" : "Guidance Status"}</span>
        </div>

        <h1
          id="no-match-heading"
          className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight"
        >
          {resT.noMatchHeading}
        </h1>

        <p className="text-sm text-ink-600 leading-relaxed max-w-2xl">
          {resT.noMatchSub}
        </p>
      </div>

      {/* Criteria Breakdown */}
      {failedConditions.length > 0 && (
        <div className="bg-paper-100 border border-paper-200 rounded-sm p-4 space-y-2.5 text-xs">
          <span className="font-bold text-ink-900 block text-[11px] uppercase tracking-wider">
            {isHindi ? "मापदंड जिनके कारण वर्तमान योजनाएं मेल नहीं खातीं" : "Criteria that prevented a direct match"}
          </span>

          <ul className="space-y-2 text-ink-700">
            {failedConditions.map((fc) => (
              <li key={fc.rule_id} className="flex items-start gap-2 leading-relaxed">
                <span className="text-accent font-bold" aria-hidden="true">
                  &bull;
                </span>
                <span>
                  {isHindi ? fc.reason_hi : fc.reason_en}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Informative Guidance */}
      <div className="text-xs text-ink-600 space-y-2 border-l-2 border-paper-200 pl-3">
        <p className="leading-relaxed">
          {isHindi
            ? "यह परिणाम आधिकारिक ऋण अस्वीकृति नहीं है। SAHAYAK AI केवल सार्वजनिक योजना दिशानिर्देशों के आधार पर प्रारंभिक नियम मिलान करता है। राज्य चैनल पार्टनर या बैंक अन्य योजनाओं या विशेष रियायती श्रेणियों की पहचान कर सकते हैं।"
            : "This result is not a loan rejection. SAHAYAK AI provides preliminary rule matching against public scheme limits. Authorized Channel Partners or banks may identify alternative state programs or special concession tiers."}
        </p>
      </div>

      {/* Clear Next Actions */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Link
          href="/assessment?step=review"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm border border-paper-200 bg-paper-100 hover:bg-paper-200 text-ink-900 font-semibold text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-ink-600" aria-hidden="true" />
          <span>{resT.secondaryReviewAnswers}</span>
        </Link>

        <Link
          href={partnerUrl}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-accent hover:bg-accent-hover text-white font-bold text-xs transition-colors"
        >
          <Building2 className="w-4 h-4 text-white" aria-hidden="true" />
          <span>{resT.primaryNextActionTitle}</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
