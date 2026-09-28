"use client";

import React from "react";
import { PolicySourceMeta } from "@/lib/assessment-context";
import { useLanguage } from "@/lib/language-context";
import { formatIndianDate } from "@/lib/financial-formatting";
import { ExternalLink, ShieldCheck, Scale } from "lucide-react";

interface InformationSourceProps {
  sourceMeta?: PolicySourceMeta;
  providerName: string;
  isDemonstration?: boolean;
  className?: string;
}

export function InformationSource({
  sourceMeta,
  providerName,
  isDemonstration = false,
  className = "",
}: InformationSourceProps) {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  return (
    <section aria-labelledby="sources-heading" className={`space-y-3 ${className}`}>
      <div className="border-b border-paper-200 pb-2">
        <h2
          id="sources-heading"
          className="text-lg sm:text-xl font-bold text-ink-900 tracking-tight"
        >
          {resT.informationSourceTitle}
        </h2>
      </div>

      <div className="bg-paper-50 border border-paper-200 rounded-sm p-4 text-xs space-y-3">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Authority */}
          <div>
            <dt className="text-[11px] font-semibold text-ink-500 block mb-0.5">
              {resT.sourceAuthorityLabel}
            </dt>
            <dd className="font-medium text-ink-900 leading-snug">
              {providerName}
            </dd>
          </div>

          {/* Guideline / Circular */}
          <div>
            <dt className="text-[11px] font-semibold text-ink-500 block mb-0.5">
              {resT.sourceDocumentLabel}
            </dt>
            <dd className="font-mono text-ink-900 text-[11px] leading-snug">
              {sourceMeta?.document_ref ? (
                <>
                  <span>{sourceMeta.document_ref}</span>
                  {sourceMeta.clause && (
                    <span className="block font-sans text-ink-600 mt-0.5">
                      {sourceMeta.clause}
                    </span>
                  )}
                </>
              ) : (
                <span className="font-sans text-ink-500">
                  {isHindi ? "परिपत्र संदर्भ उपलब्ध नहीं" : "Reference circular unavailable"}
                </span>
              )}
            </dd>
          </div>

          {/* Effective Date */}
          <div>
            <dt className="text-[11px] font-semibold text-ink-500 block mb-0.5">
              {resT.effectiveDateLabel}
            </dt>
            <dd className="font-medium text-ink-900">
              {sourceMeta?.effective_date
                ? formatIndianDate(sourceMeta.effective_date, isHindi)
                : isHindi
                ? "उपलब्ध नहीं"
                : "Not available"}
            </dd>
          </div>

          {/* Last Reviewed Date */}
          <div>
            <dt className="text-[11px] font-semibold text-ink-500 block mb-0.5">
              {resT.lastReviewedLabel}
            </dt>
            <dd className="font-medium text-ink-900">
              {sourceMeta?.source_checked_date
                ? formatIndianDate(sourceMeta.source_checked_date, isHindi)
                : isHindi
                ? "उपलब्ध नहीं"
                : "Not available"}
            </dd>
          </div>
        </dl>

        {/* Prototype / Demo Notice */}
        {isDemonstration ? (
          <div className="flex items-start gap-2 bg-amber-100/60 p-2.5 rounded-sm border border-amber-200 text-amber-950 text-[11px]">
            <Scale className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">{resT.demoNotice}</p>
          </div>
        ) : (
          <div className="flex items-start gap-2 bg-paper-100 p-2.5 rounded-sm border border-paper-200 text-ink-700 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">{resT.sourceNotice}</p>
          </div>
        )}

        {/* Official URL Link */}
        <div className="pt-1 border-t border-paper-200">
          {sourceMeta?.official_url ? (
            <a
              href={sourceMeta.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-link-default hover:text-link-hover font-semibold text-xs"
            >
              <span>{resT.openOfficialDoc}</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          ) : (
            <p className="text-[11px] text-ink-500 italic">
              {resT.sourceUnavailableNotice}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
