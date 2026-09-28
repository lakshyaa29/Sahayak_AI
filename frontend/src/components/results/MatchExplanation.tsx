"use client";

import React from "react";
import { SchemeEvaluationOutcome } from "@/lib/assessment-context";
import { useLanguage } from "@/lib/language-context";
import { formatRupees } from "@/lib/financial-formatting";
import { Check, AlertCircle, FileCheck, HelpCircle } from "lucide-react";

interface MatchExplanationProps {
  scheme: SchemeEvaluationOutcome;
  userAnswers: {
    purpose: string;
    totalCost: number;
    annualFamilyIncome: number;
    communityDeclaration: string;
    courseName?: string;
    businessDescription?: string;
    studyLocation?: string;
  };
  className?: string;
}

interface CriterionRowData {
  categoryTitleEn: string;
  categoryTitleHi: string;
  userValueText: string;
  schemeRuleTextEn: string;
  schemeRuleTextHi: string;
  resultTextEn: string;
  resultTextHi: string;
  status: "MATCHED" | "NEEDS_VERIFICATION" | "NOT_ASSESSED";
  verificationNoteEn?: string;
  verificationNoteHi?: string;
}

export function MatchExplanation({
  scheme,
  userAnswers,
  className = "",
}: MatchExplanationProps) {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  // Build factual criterion rows connecting user input -> scheme rule -> outcome
  const rows: CriterionRowData[] = [];

  // 1. Purpose
  const isBusiness = userAnswers.purpose === "business";
  const purposeUserText = isBusiness
    ? isHindi
      ? `व्यवसाय या स्वरोजगार (${userAnswers.businessDescription || "उद्यम"})`
      : `Business or self-employment (${userAnswers.businessDescription || "Enterprise"})`
    : isHindi
    ? `व्यावसायिक शिक्षा (${userAnswers.courseName || "पाठ्यक्रम"})`
    : `Professional education (${userAnswers.courseName || "Course"})`;

  const purposeRuleEn = isBusiness
    ? "Supports eligible income-generating activities, machinery purchase, and self-employment units"
    : "Supports tuition and hostel fees for approved professional degrees and technical diplomas";

  const purposeRuleHi = isBusiness
    ? "पात्र आय-सृजन गतिविधियों, मशीनरी खरीद और स्वरोजगार इकाइयों के लिए सहायता"
    : "मान्यता प्राप्त व्यावसायिक डिग्री और तकनीकी डिप्लोमा के लिए शुल्क एवं छात्रावास सहायता";

  rows.push({
    categoryTitleEn: "Supported purpose",
    categoryTitleHi: "समर्थित उद्देश्य",
    userValueText: purposeUserText,
    schemeRuleTextEn: purposeRuleEn,
    schemeRuleTextHi: purposeRuleHi,
    resultTextEn: "Matches the scheme's supported purpose",
    resultTextHi: "योजना के समर्थित उद्देश्य के अनुकूल",
    status: "MATCHED",
  });

  // 2. Project Cost Bounds
  const costLimitEn =
    scheme.code === "SC_MICRO_FINANCE"
      ? "Up to ₹1,40,000 for tiny ventures"
      : scheme.code === "SC_TERM_LOAN"
      ? "₹1,40,001 up to ₹50,00,000 for viable projects"
      : scheme.code === "SC_EDUCATION_LOAN"
      ? "Up to ₹20,00,000 in India (up to ₹30,00,000 abroad)"
      : "Within statutory scheme outlay limits";

  const costLimitHi =
    scheme.code === "SC_MICRO_FINANCE"
      ? "सूक्ष्म उद्यमों के लिए ₹1,40,000 तक"
      : scheme.code === "SC_TERM_LOAN"
      ? "व्यावसायिक परियोजनाओं के लिए ₹1,40,001 से ₹50,00,000 तक"
      : scheme.code === "SC_EDUCATION_LOAN"
      ? "भारत में ₹20,00,000 तक (विदेश में ₹30,00,000 तक)"
      : "वैधानिक योजना लागत सीमाओं के भीतर";

  rows.push({
    categoryTitleEn: "Project cost threshold",
    categoryTitleHi: "परियोजना लागत सीमा",
    userValueText: formatRupees(userAnswers.totalCost),
    schemeRuleTextEn: costLimitEn,
    schemeRuleTextHi: costLimitHi,
    resultTextEn: "Within the scheme's stated project-cost limits",
    resultTextHi: "योजना की निर्धारित लागत सीमा के भीतर",
    status: "MATCHED",
    verificationNoteEn: "Cost estimate will be verified against formal quotations or institution fee structure.",
    verificationNoteHi: "लागत अनुमान का सत्यापन औपचारिक कोटेशन या संस्थान शुल्क विवरण के आधार पर किया जाएगा।",
  });

  // 3. Family Income
  const incomeCeilingEn = "Statutory family income ceiling up to ₹5,00,000 per year";
  const incomeCeilingHi = "वार्षिक पारिवारिक आय की वैधानिक अधिकतम सीमा ₹5,00,000 तक";

  rows.push({
    categoryTitleEn: "Annual family income",
    categoryTitleHi: "वार्षिक पारिवारिक आय",
    userValueText: formatRupees(userAnswers.annualFamilyIncome),
    schemeRuleTextEn: incomeCeilingEn,
    schemeRuleTextHi: incomeCeilingHi,
    resultTextEn: "Within stated annual family income ceiling",
    resultTextHi: "निर्धारित वार्षिक पारिवारिक आय सीमा के अनुकूल",
    status: "MATCHED",
    verificationNoteEn: "Requires documentary verification via Income Certificate issued by Revenue Authority.",
    verificationNoteHi: "राजस्व प्राधिकारी द्वारा जारी आय प्रमाण पत्र के माध्यम से दस्तावेजी सत्यापन आवश्यक है।",
  });

  // 4. Affirmative Community Mandate
  const scDeclarationUser =
    userAnswers.communityDeclaration === "yes"
      ? isHindi
        ? "हाँ (अनुसूचित जाति स्व-घोषणा)"
        : "Yes (Scheduled Caste self-declaration)"
      : isHindi
      ? userAnswers.communityDeclaration
      : userAnswers.communityDeclaration;

  rows.push({
    categoryTitleEn: "Affirmative community mandate",
    categoryTitleHi: "सकारात्मक सामुदायिक मानदंड",
    userValueText: scDeclarationUser,
    schemeRuleTextEn: "Affirmative credit mandate for Scheduled Caste beneficiaries",
    schemeRuleTextHi: "अनुसूचित जाति के लाभार्थियों के लिए वैधानिक रियायती ऋण अधिदेश",
    resultTextEn: "Satisfies preliminary affirmative mandate declaration",
    resultTextHi: "प्रारंभिक सकारात्मक अधिदेश घोषणा को पूरा करता है",
    status: "NEEDS_VERIFICATION",
    verificationNoteEn: "Requires official Scheduled Caste Certificate verification by the lending institution.",
    verificationNoteHi: "ऋणदाता संस्थान द्वारा आधिकारिक अनुसूचित जाति प्रमाण पत्र का सत्यापन आवश्यक है।",
  });

  // 5. If Education: Course/Institution Accreditation
  if (!isBusiness) {
    rows.push({
      categoryTitleEn: "Institution & course accreditation",
      categoryTitleHi: "संस्थान एवं पाठ्यक्रम मान्यता",
      userValueText: userAnswers.courseName || (isHindi ? "उच्च शिक्षा पाठ्यक्रम" : "Higher education course"),
      schemeRuleTextEn: "Recognized professional or technical course under UGC/AICTE guidelines",
      schemeRuleTextHi: "यूजीसी/एआईसीटीई दिशानिर्देशों के तहत मान्यता प्राप्त व्यावसायिक या तकनीकी पाठ्यक्रम",
      resultTextEn: "Requires formal accreditation confirmation during branch appraisal",
      resultTextHi: "शाखा में मूल्यांकन के दौरान औपचारिक मान्यता पुष्टि आवश्यक है",
      status: "NEEDS_VERIFICATION",
      verificationNoteEn: "Channel Partner verifies admission letter and institutional recognition.",
      verificationNoteHi: "चैनल पार्टनर प्रवेश पत्र और संस्थान की मान्यता की पुष्टि करता है।",
    });
  }

  return (
    <section aria-labelledby="why-matched-heading" className={`space-y-4 ${className}`}>
      <div className="border-b border-paper-200 pb-2">
        <h2
          id="why-matched-heading"
          className="text-lg sm:text-xl font-bold text-ink-900 tracking-tight"
        >
          {resT.whyMatchedTitle}
        </h2>
        <p className="text-xs text-ink-600 mt-0.5">
          {resT.whyMatchedNotice}
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row, idx) => {
          const title = isHindi ? row.categoryTitleHi : row.categoryTitleEn;
          const rule = isHindi ? row.schemeRuleTextHi : row.schemeRuleTextEn;
          const result = isHindi ? row.resultTextHi : row.resultTextEn;
          const note = isHindi ? row.verificationNoteHi : row.verificationNoteEn;

          return (
            <div
              key={idx}
              className="bg-paper-50 border border-paper-200 rounded-sm p-3.5 sm:p-4 text-xs space-y-2.5"
            >
              <div className="flex items-center justify-between border-b border-paper-200/80 pb-1.5">
                <span className="font-bold text-ink-900 text-xs sm:text-sm">
                  {title}
                </span>

                {row.status === "MATCHED" && (
                  <span className="inline-flex items-center gap-1 font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-sm text-[11px]">
                    <Check className="w-3.5 h-3.5 text-green-700" aria-hidden="true" />
                    <span>{isHindi ? "सत्यापित मेल" : "Rule matched"}</span>
                  </span>
                )}

                {row.status === "NEEDS_VERIFICATION" && (
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-sm text-[11px]">
                    <FileCheck className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                    <span>{isHindi ? "दस्तावेज़ सत्यापन अपेक्षित" : "Needs document verification"}</span>
                  </span>
                )}

                {row.status === "NOT_ASSESSED" && (
                  <span className="inline-flex items-center gap-1 font-semibold text-ink-500 bg-paper-200 px-2 py-0.5 rounded-sm text-[11px]">
                    <HelpCircle className="w-3.5 h-3.5 text-ink-500" aria-hidden="true" />
                    <span>{isHindi ? "जांचा नहीं गया" : "Not assessed"}</span>
                  </span>
                )}
              </div>

              {/* 3-part comparison definition list */}
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 text-xs">
                <div className="bg-paper-100/70 p-2.5 rounded-sm border border-paper-200/60">
                  <dt className="text-[11px] font-semibold text-ink-500 block mb-0.5">
                    {resT.userAnswerLabel}
                  </dt>
                  <dd className="font-medium text-ink-900 leading-snug">
                    {row.userValueText}
                  </dd>
                </div>

                <div className="bg-paper-100/70 p-2.5 rounded-sm border border-paper-200/60">
                  <dt className="text-[11px] font-semibold text-ink-500 block mb-0.5">
                    {resT.criterionLabel}
                  </dt>
                  <dd className="font-medium text-ink-900 leading-snug">
                    {rule}
                  </dd>
                </div>

                <div className="bg-paper-100/70 p-2.5 rounded-sm border border-paper-200/60">
                  <dt className="text-[11px] font-semibold text-ink-500 block mb-0.5">
                    {resT.comparisonResultLabel}
                  </dt>
                  <dd className="font-medium text-ink-900 leading-snug">
                    {result}
                  </dd>
                </div>
              </dl>

              {note && (
                <p className="text-[11px] text-ink-500 italic pt-0.5">
                  &bull; {note}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
