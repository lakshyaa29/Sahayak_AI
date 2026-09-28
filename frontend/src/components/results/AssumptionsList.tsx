"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { formatRupees, extractBaseInterestRate } from "@/lib/financial-formatting";

interface AssumptionsListProps {
  totalCost: number;
  financingPercentage?: number;
  tenureYears: number;
  interestRateStr: string;
  moratoriumStr?: string;
  className?: string;
}

export function AssumptionsList({
  totalCost,
  financingPercentage = 90,
  tenureYears,
  interestRateStr,
  moratoriumStr,
  className = "",
}: AssumptionsListProps) {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  const baseRate = extractBaseInterestRate(interestRateStr);

  const assumptionsEn = [
    `The full project outlay of ${formatRupees(totalCost)} entered in the assessment is considered eligible for financing under scheme guidelines.`,
    `Concessional financing share is estimated at up to ${financingPercentage}% of project cost, subject to the statutory scheme maximum outlay ceiling.`,
    `Repayment is simulated over a ${tenureYears}-year tenure (${tenureYears * 12} monthly instalments) on a reducing-balance annuity basis.`,
    `The interest rate calculation uses the baseline policy rate of ${baseRate}% per annum. Applicable rate tiers may vary based on applicant category and lender evaluation.`,
    `Repayment frequency is assumed to be regular monthly instalments.`,
    moratoriumStr
      ? `An initial moratorium (grace period) of ${moratoriumStr} is provided before regular principal instalments commence. Interest treatment during moratorium follows lender sanction rules.`
      : "No moratorium is assumed in this direct preliminary repayment simulation.",
    "Third-party processing charges, documentation fees, statutory stamp duty, and credit insurance premiums are excluded from this preliminary estimate.",
    "Final loan sanction, interest rate, borrower margin, and disbursement schedule will be determined by the authorized lending institution upon formal appraisal.",
  ];

  const assumptionsHi = [
    `मूल्यांकन में दर्ज ${formatRupees(totalCost)} की कुल परियोजना लागत को योजना दिशानिर्देशों के तहत वित्तपोषण के लिए पात्र माना गया है।`,
    `रियायती वित्तपोषण हिस्सेदारी का अनुमान परियोजना लागत के अधिकतम ${financingPercentage}% तक लगाया गया है, जो योजना की वैधानिक अधिकतम सीमा के अधीन है।`,
    `पुनर्भुगतान का सिमुलेशन ${tenureYears} वर्ष (${tenureYears * 12} मासिक किस्तों) की अवधि में घटते मूलधन (annuity) के आधार पर किया गया है।`,
    `ब्याज दर की गणना ${baseRate}% वार्षिक की आधार नीति दर पर आधारित है। आवेदक श्रेणी और ऋणदाता मूल्यांकन के अनुसार लागू दर भिन्न हो सकती है।`,
    `पुनर्भुगतान आवृत्ति नियमित मासिक किस्तों के रूप में मानी गई है।`,
    moratoriumStr
      ? `नियमित मूलधन किस्तें शुरू होने से पहले ${moratoriumStr} की प्रारंभिक छूट (मोरेटोरियम) अवधि का प्रावधान है। मोरेटोरियम के दौरान ब्याज की व्यवस्था ऋणदाता की स्वीकृति नियमों पर निर्भर करती है।`
      : "इस सीधे प्रारंभिक पुनर्भुगतान सिमुलेशन में कोई मोरेटोरियम नहीं माना गया है।",
    "तृतीय-पक्ष प्रोसेसिंग शुल्क, दस्तावेज़ शुल्क, वैधानिक स्टाम्प शुल्क और ऋण बीमा प्रीमियम इस प्रारंभिक अनुमान में शामिल नहीं हैं।",
    "औपचारिक मूल्यांकन के बाद अधिकृत ऋणदाता संस्थान द्वारा अंतिम ऋण स्वीकृति, ब्याज दर, लाभार्थी अंशदान और वितरण कार्यक्रम तय किया जाएगा।",
  ];

  const items = isHindi ? assumptionsHi : assumptionsEn;

  return (
    <section aria-labelledby="assumptions-heading" className={`space-y-3 ${className}`}>
      <div className="border-b border-paper-200 pb-2">
        <h2
          id="assumptions-heading"
          className="text-lg sm:text-xl font-bold text-ink-900 tracking-tight"
        >
          {resT.assumptionsTitle}
        </h2>
      </div>

      <div className="bg-paper-50 border border-paper-200 rounded-sm p-4 text-xs text-ink-700">
        <ul className="space-y-2 list-disc list-inside">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
