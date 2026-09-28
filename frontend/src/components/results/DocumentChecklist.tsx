"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { FileText, CheckCircle2, HelpCircle } from "lucide-react";

interface DocumentItem {
  nameEn: string;
  nameHi: string;
  descEn: string;
  descHi: string;
  status: "USUALLY_REQUIRED" | "LENDER_MAY_REQUEST";
}

interface DocumentGroup {
  categoryKey: "identity" | "business" | "education";
  titleEn: string;
  titleHi: string;
  items: DocumentItem[];
}

interface DocumentChecklistProps {
  purpose: "business" | "education";
  communityDeclaration?: string;
  className?: string;
}

export function DocumentChecklist({
  purpose,
  communityDeclaration = "yes",
  className = "",
}: DocumentChecklistProps) {
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const resT = t.results;

  const groups: DocumentGroup[] = [];

  // 1. Identity & Eligibility Group
  const identityDocs: DocumentItem[] = [
    {
      nameEn: "Identity Proof",
      nameHi: "पहचान प्रमाण",
      descEn: "Aadhaar Card, Voter ID, or PAN Card.",
      descHi: "आधार कार्ड, मतदाता पहचान पत्र, या पैन कार्ड।",
      status: "USUALLY_REQUIRED",
    },
    {
      nameEn: "Address / Domicile Proof",
      nameHi: "निवास / अधिवास प्रमाण",
      descEn: "Recent utility bill, ration card, or state domicile certificate.",
      descHi: "हालिया बिजली/पानी बिल, राशन कार्ड, या राज्य निवास प्रमाण पत्र।",
      status: "USUALLY_REQUIRED",
    },
  ];

  if (communityDeclaration === "yes") {
    identityDocs.push({
      nameEn: "Scheduled Caste Certificate",
      nameHi: "अनुसूचित जाति प्रमाण पत्र",
      descEn: "Official caste certificate issued by an authorized Sub-Divisional Officer / Revenue Tehsildar.",
      descHi: "सक्षम अनुविभागीय अधिकारी / तहसीलदार द्वारा जारी आधिकारिक जाति प्रमाण पत्र।",
      status: "USUALLY_REQUIRED",
    });
  }

  identityDocs.push({
    nameEn: "Income Certificate",
    nameHi: "आय प्रमाण पत्र",
    descEn: "Annual family income certificate issued by competent Revenue Authority for the current financial year.",
    descHi: "सक्षम राजस्व प्राधिकारी द्वारा चालू वित्तीय वर्ष के लिए जारी पारिवारिक आय प्रमाण पत्र।",
    status: "USUALLY_REQUIRED",
  });

  groups.push({
    categoryKey: "identity",
    titleEn: resT.docCategoryIdentity,
    titleHi: resT.docCategoryIdentity,
    items: identityDocs,
  });

  // 2. Purpose-Specific Group
  if (purpose === "business") {
    groups.push({
      categoryKey: "business",
      titleEn: resT.docCategoryBusiness,
      titleHi: resT.docCategoryBusiness,
      items: [
        {
          nameEn: "Project Proposal / Summary",
          nameHi: "परियोजना प्रस्ताव / संक्षिप्त विवरण",
          descEn: "Outline of business activity, proposed location, equipment needed, and projected monthly sales.",
          descHi: "व्यावसायिक गतिविधि, प्रस्तावित स्थान, आवश्यक उपकरण और अनुमानित मासिक बिक्री का संक्षिप्त विवरण।",
          status: "USUALLY_REQUIRED",
        },
        {
          nameEn: "Equipment / Machinery Quotations",
          nameHi: "उपकरण / मशीनरी कोटेशन",
          descEn: "Proforma invoices or seller quotations confirming cost of tools, machinery, or stock.",
          descHi: "उपकरणों, मशीनरी या व्यापारिक स्टॉक की लागत प्रमाणित करने वाले विक्रेता कोटेशन या प्रोफार्मा चालान।",
          status: "USUALLY_REQUIRED",
        },
        {
          nameEn: "Existing Business Registration (If expanding)",
          nameHi: "मौजूदा व्यवसाय पंजीकरण (यदि विस्तार कर रहे हों)",
          descEn: "Udyam registration or Shop & Establishment license for existing enterprise units.",
          descHi: "मौजूदा उद्यम इकाइयों के लिए उद्यम पंजीकरण या दुकान स्थापना लाइसेंस।",
          status: "LENDER_MAY_REQUEST",
        },
        {
          nameEn: "Bank Statement",
          nameHi: "बैंक खाता विवरण",
          descEn: "Bank passbook statement for the past 6 months.",
          descHi: "पिछले 6 महीनों का बैंक पासबुक विवरण।",
          status: "LENDER_MAY_REQUEST",
        },
      ],
    });
  } else {
    groups.push({
      categoryKey: "education",
      titleEn: resT.docCategoryEducation,
      titleHi: resT.docCategoryEducation,
      items: [
        {
          nameEn: "Admission / Offer Letter",
          nameHi: "प्रवेश पत्र / ऑफर लेटर",
          descEn: "Formal admission confirmation or selection letter from the recognized institution.",
          descHi: "मान्यता प्राप्त शैक्षणिक संस्थान से औपचारिक प्रवेश पुष्टि या चयन पत्र।",
          status: "USUALLY_REQUIRED",
        },
        {
          nameEn: "Course Fee Structure Breakdown",
          nameHi: "पाठ्यक्रम शुल्क संरचना विवरण",
          descEn: "Official institutional statement itemizing tuition, examination, lab, and hostel charges.",
          descHi: "ट्यूशन, परीक्षा, प्रयोगशाला और छात्रावास शुल्क का संस्थान द्वारा जारी आधिकारिक विवरण।",
          status: "USUALLY_REQUIRED",
        },
        {
          nameEn: "Academic Records & Marksheets",
          nameHi: "शैक्षणिक अंकतालिकाएं एवं प्रमाण पत्र",
          descEn: "Marksheets and passing certificates for 10th, 12th, or qualifying degree examination.",
          descHi: "10वीं, 12वीं या अर्हक डिग्री परीक्षा की अंकतालिकाएं और उत्तीर्ण प्रमाण पत्र।",
          status: "USUALLY_REQUIRED",
        },
        {
          nameEn: "Institution Accreditation Proof",
          nameHi: "संस्थान मान्यता प्रमाण",
          descEn: "Proof of UGC, AICTE, or government accreditation (the lending branch will verify this directly).",
          descHi: "यूजीसी, एआईसीटीई या सरकारी मान्यता का प्रमाण (बैंक शाखा इसकी सीधे पुष्टि करेगी)।",
          status: "LENDER_MAY_REQUEST",
        },
      ],
    });
  }

  return (
    <section aria-labelledby="documents-heading" className={`space-y-4 ${className}`}>
      <div className="border-b border-paper-200 pb-2">
        <h2
          id="documents-heading"
          className="text-lg sm:text-xl font-bold text-ink-900 tracking-tight"
        >
          {resT.documentsTitle}
        </h2>
        <p className="text-xs text-ink-600 mt-0.5">
          {resT.documentsSub}
        </p>
      </div>

      <div className="space-y-4">
        {groups.map((group) => {
          const groupTitle = isHindi ? group.titleHi : group.titleEn;
          return (
            <div
              key={group.categoryKey}
              className="bg-paper-50 border border-paper-200 rounded-sm p-4 space-y-3"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-700 border-b border-paper-200/80 pb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-ink-600" aria-hidden="true" />
                <span>{groupTitle}</span>
              </h3>

              <ul className="divide-y divide-paper-200/60 text-xs">
                {group.items.map((doc, idx) => {
                  const name = isHindi ? doc.nameHi : doc.nameEn;
                  const desc = isHindi ? doc.descHi : doc.descEn;
                  const isRequired = doc.status === "USUALLY_REQUIRED";

                  return (
                    <li
                      key={idx}
                      className="py-2.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-ink-900 block">
                          {name}
                        </span>
                        <p className="text-[11px] text-ink-600 leading-relaxed">
                          {desc}
                        </p>
                      </div>

                      <div className="flex-shrink-0 sm:text-right">
                        {isRequired ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-800 bg-paper-100 px-2 py-0.5 rounded-sm border border-paper-200">
                            <CheckCircle2 className="w-3 h-3 text-ink-700" aria-hidden="true" />
                            <span>{resT.docStatusRequired}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-600 bg-paper-200/50 px-2 py-0.5 rounded-sm">
                            <HelpCircle className="w-3 h-3 text-ink-500" aria-hidden="true" />
                            <span>{resT.docStatusRequested}</span>
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-ink-500 leading-relaxed italic border-l-2 border-paper-200 pl-3">
        {resT.documentsDisclaimer}
      </p>
    </section>
  );
}
