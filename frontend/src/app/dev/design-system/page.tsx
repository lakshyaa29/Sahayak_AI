"use client";

import React, { useState } from "react";
import {
  PageContainer,
  Section,
  Stack,
  ResponsiveGrid,
  PageHeader,
  FormSection,
} from "@/components/ui/layout-primitives";
import {
  DisplayHeading,
  PageHeading,
  SectionHeading,
  CardHeading,
  BodyLarge,
  Body,
  SupportingText,
  FormLabelText,
  Caption,
  FinancialFigure,
} from "@/components/ui/typography";
import { Button, StyledLink } from "@/components/ui/button";
import {
  Input,
  CurrencyInput,
  Textarea,
  Select,
  Checkbox,
  SearchInput,
  FormErrorSummary,
} from "@/components/ui/form-controls";
import { ChoiceCard } from "@/components/ui/choice-card";
import {
  Badge,
  StatusBadge,
  DataFreshnessBadge,
  DemoDataBadge,
} from "@/components/ui/badge";
import {
  InfoBanner,
  SuccessBanner,
  WarningBanner,
  ErrorBanner,
  GuidanceNotice,
} from "@/components/ui/disclaimer-banner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Calculator,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from "lucide-react";

export default function DesignSystemGalleryPage() {
  const [activeTab, setActiveTab] = useState<string>("tokens");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [currencyVal, setCurrencyVal] = useState<number>(750000);
  const [selectedRadio, setSelectedRadio] = useState("business");
  const [selectedChecks, setSelectedChecks] = useState<Record<string, boolean>>({
    aadhaar: true,
    caste: true,
    income: false,
  });
  const [searchVal, setSearchVal] = useState("");

  const tabs = [
    { id: "tokens", label: "Color Tokens" },
    { id: "typography", label: "Typography & Bilingual" },
    { id: "spacing", label: "Spacing & Containers" },
    { id: "buttons", label: "Buttons & Links" },
    { id: "forms", label: "Form Controls" },
    { id: "choice-cards", label: "Choice Cards" },
    { id: "banners", label: "Panels & Notices" },
    { id: "cards", label: "Cards & Surfaces" },
  ];

  return (
    <PageContainer variant="default" className="py-8 md:py-12">
      <Stack gap={6}>
        {/* Gallery Header */}
        <PageHeader
          title="Civic Field Guide Design System"
          description="Centralized specification of semantic tokens, accessible controls, bilingual typography, and public-service interaction states."
          badge={
            <div className="flex items-center gap-2">
              <Badge variant="primary">Civic Design Tokens</Badge>
              <DemoDataBadge />
            </div>
          }
        />

        {/* Tab Navigation */}
        <div
          role="tablist"
          aria-label="Design System Categories"
          className="flex flex-wrap gap-2 border-b border-border pb-3"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-[4px] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus ${
                activeTab === tab.id
                  ? "bg-ink-900 text-white"
                  : "bg-surface text-ink-700 hover:bg-paper-200 border border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. TOKENS & COLOR PALETTE */}
        {activeTab === "tokens" && (
          <Section id="panel-tokens" role="tabpanel" aria-labelledby="tokens" spacing="sm">
            <Stack gap={6}>
              <div>
                <SectionHeading>Base Palette & Semantic Tokens</SectionHeading>
                <SupportingText>
                  Document-like public service palette: warm paper, navy ink, burnt saffron accents, accessible blue links, and functional status colors.
                </SupportingText>
              </div>

              {/* Palette Categories */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-ink-700 mb-3">1. Paper & Surfaces</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { name: "paper-50", hex: "#FBF8F1", bg: "bg-[#FBF8F1]", text: "text-ink-900" },
                      { name: "paper-100", hex: "#F5F1E8", bg: "bg-[#F5F1E8]", text: "text-ink-900" },
                      { name: "paper-200", hex: "#E9E2D3", bg: "bg-[#E9E2D3]", text: "text-ink-900" },
                      { name: "surface-primary", hex: "#F5F1E8", bg: "bg-[#F5F1E8]", text: "text-ink-900" },
                      { name: "surface-raised", hex: "#FFFDF8", bg: "bg-[#FFFDF8]", text: "text-ink-900" },
                      { name: "surface-muted", hex: "#EDE7DA", bg: "bg-[#EDE7DA]", text: "text-ink-900" },
                    ].map((item) => (
                      <div key={item.name} className="border border-border-default rounded-[4px] overflow-hidden bg-surface">
                        <div className={`h-16 p-2 flex items-end ${item.bg} ${item.text} border-b border-border-subtle`}>
                          <span className="text-[11px] font-mono font-bold">{item.hex}</span>
                        </div>
                        <div className="p-2 text-xs font-semibold text-ink-900">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-ink-700 mb-3">2. Navy Ink & Text</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                      { name: "ink-900 / text-primary", hex: "#17233C", bg: "bg-[#17233C]", text: "text-white" },
                      { name: "ink-800", hex: "#22314F", bg: "bg-[#22314F]", text: "text-white" },
                      { name: "ink-700", hex: "#344461", bg: "bg-[#344461]", text: "text-white" },
                      { name: "ink-600 / text-secondary", hex: "#536078", bg: "bg-[#536078]", text: "text-white" },
                      { name: "ink-500", hex: "#6B7589", bg: "bg-[#6B7589]", text: "text-white" },
                    ].map((item) => (
                      <div key={item.name} className="border border-border-default rounded-[4px] overflow-hidden bg-surface">
                        <div className={`h-16 p-2 flex items-end ${item.bg} ${item.text}`}>
                          <span className="text-[11px] font-mono font-bold">{item.hex}</span>
                        </div>
                        <div className="p-2 text-xs font-semibold text-ink-900">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-ink-700 mb-3">3. Burnt Saffron & Functional Accents</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { name: "saffron-500 / accent", hex: "#C65D27", bg: "bg-[#C65D27]", text: "text-white" },
                      { name: "saffron-600 / hover", hex: "#B84F20", bg: "bg-[#B84F20]", text: "text-white" },
                      { name: "saffron-700 / active", hex: "#9D421B", bg: "bg-[#9D421B]", text: "text-white" },
                      { name: "blue-600 / link", hex: "#155E9A", bg: "bg-[#155E9A]", text: "text-white" },
                      { name: "green-600 / success", hex: "#276749", bg: "bg-[#276749]", text: "text-white" },
                      { name: "amber-500 / warning", hex: "#B7791F", bg: "bg-[#B7791F]", text: "text-white" },
                      { name: "red-600 / error", hex: "#A83333", bg: "bg-[#A83333]", text: "text-white" },
                      { name: "focus-color", hex: "#F2B84B", bg: "bg-[#F2B84B]", text: "text-ink-900" },
                    ].map((item) => (
                      <div key={item.name} className="border border-border-default rounded-[4px] overflow-hidden bg-surface">
                        <div className={`h-16 p-2 flex items-end ${item.bg} ${item.text}`}>
                          <span className="text-[11px] font-mono font-bold">{item.hex}</span>
                        </div>
                        <div className="p-2 text-xs font-semibold text-ink-900">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Borders & Radii Specifications */}
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-ink-700 mb-3">4. Corner Radii & Borders</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 border border-border-default rounded-none bg-surface text-center">
                      <span className="font-bold text-sm block">radius-none (0px)</span>
                      <p className="text-xs text-neutral-600 mt-1">Dividers, hard rules</p>
                    </div>
                    <div className="p-4 border border-border-default rounded-[2px] bg-surface text-center">
                      <span className="font-bold text-sm block">radius-sm (2px)</span>
                      <p className="text-xs text-neutral-600 mt-1">Badges, small tags</p>
                    </div>
                    <div className="p-4 border border-border-default rounded-[4px] bg-surface text-center">
                      <span className="font-bold text-sm block">radius-md (4px)</span>
                      <p className="text-xs text-neutral-600 mt-1">Cards, inputs, panels, buttons</p>
                    </div>
                    <div className="p-4 border border-border-default rounded-full bg-surface text-center">
                      <span className="font-bold text-sm block">radius-round (9999px)</span>
                      <p className="text-xs text-neutral-600 mt-1">Circular indicators only</p>
                    </div>
                  </div>
                </div>
              </div>
            </Stack>
          </Section>
        )}

        {/* 2. TYPOGRAPHY */}
        {activeTab === "typography" && (
          <Section id="panel-typography" role="tabpanel" spacing="sm">
            <Stack gap={6}>
              <div>
                <SectionHeading>Bilingual Typography (Noto Sans & Noto Sans Devanagari)</SectionHeading>
                <SupportingText>
                  Carefully proportioned line heights prevent Devanagari character clipping and ensure comfortable reading.
                </SupportingText>
              </div>

              <div className="space-y-6 bg-surface p-6 rounded-[4px] border border-border">
                <div className="pb-4 border-b border-border">
                  <Caption className="text-neutral-600 uppercase font-bold">Display Heading</Caption>
                  <DisplayHeading className="mt-1">Find the right financial support</DisplayHeading>
                  <DisplayHeading className="mt-1 font-devanagari text-2xl sm:text-3xl md:text-4xl">
                    सही वित्तीय सहायता खोजें
                  </DisplayHeading>
                </div>

                <div className="pb-4 border-b border-border">
                  <Caption className="text-neutral-600 uppercase font-bold">Section Heading (600 weight)</Caption>
                  <SectionHeading className="mt-1">Check suitable government schemes</SectionHeading>
                  <SectionHeading className="mt-1 font-devanagari">
                    उपयुक्त सरकारी योजनाओं की जांच करें
                  </SectionHeading>
                </div>

                <div className="pb-4 border-b border-border">
                  <Caption className="text-neutral-600 uppercase font-bold">Card Heading</Caption>
                  <CardHeading className="mt-1">National Scheduled Castes Finance Corporation</CardHeading>
                  <CardHeading className="mt-1 font-devanagari">
                    राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम
                  </CardHeading>
                </div>

                <div className="pb-4 border-b border-border">
                  <Caption className="text-neutral-600 uppercase font-bold">Body & Hindi Parity (Max width 70ch)</Caption>
                  <Body className="mt-1">
                    SAHAYAK AI provides preliminary eligibility guidance and financial decision support. Final sanction is approved by accredited Channel Partners under statutory guidelines.
                  </Body>
                  <Body className="mt-2 font-devanagari">
                    SAHAYAK AI केवल प्रारंभिक मार्गदर्शन प्रदान करता है। अंतिम पात्रता, सत्यापन और ऋण स्वीकृति का निर्णय अधिकृत ऋण संस्थानों द्वारा किया जाता है।
                  </Body>
                </div>

                <div>
                  <Caption className="text-neutral-600 uppercase font-bold">Financial Figures (Tabular Numerals)</Caption>
                  <div className="flex flex-wrap items-center gap-6 mt-2">
                    <FinancialFigure amount={500000} size="lg" highlight />
                    <FinancialFigure amount={140000} size="md" />
                    <FinancialFigure amount={3250} period="month" size="sm" />
                  </div>
                </div>
              </div>
            </Stack>
          </Section>
        )}

        {/* 3. SPACING & CONTAINERS */}
        {activeTab === "spacing" && (
          <Section id="panel-spacing" role="tabpanel" spacing="sm">
            <Stack gap={6}>
              <div>
                <SectionHeading>Spacing Scale & Container Widths</SectionHeading>
                <SupportingText>
                  Consistent 4px grid spacing with standard container widths and responsive gutters.
                </SupportingText>
              </div>

              <div className="space-y-4 bg-surface p-6 rounded-[4px] border border-border">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 border border-border rounded-[4px] bg-paper-100">
                    <span className="font-bold text-sm block">content-narrow (42rem / 672px)</span>
                    <p className="text-xs text-neutral-600 mt-1">Focused single-column forms and wizard steps</p>
                  </div>
                  <div className="p-4 border border-border rounded-[4px] bg-paper-100">
                    <span className="font-bold text-sm block">content-default (68rem / 1088px)</span>
                    <p className="text-xs text-neutral-600 mt-1">Standard application pages and 3-column grids</p>
                  </div>
                  <div className="p-4 border border-border rounded-[4px] bg-paper-100">
                    <span className="font-bold text-sm block">content-wide (80rem / 1280px)</span>
                    <p className="text-xs text-neutral-600 mt-1">Broad dashboards and partner map layouts</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-700 mb-3">Page Gutters</h4>
                  <div className="flex gap-4 text-xs font-medium text-neutral-700">
                    <span>Mobile: 1rem (16px)</span>
                    <span>•</span>
                    <span>Tablet: 1.5rem (24px)</span>
                    <span>•</span>
                    <span>Desktop: 2rem (32px)</span>
                  </div>
                </div>
              </div>
            </Stack>
          </Section>
        )}

        {/* 4. BUTTONS & LINKS */}
        {activeTab === "buttons" && (
          <Section id="panel-buttons" role="tabpanel" spacing="sm">
            <Stack gap={6}>
              <div>
                <SectionHeading>Buttons & Link Controls</SectionHeading>
                <SupportingText>
                  Solid borders, 4px corners, 44px minimum touch targets, distinct hover/active/focus-visible states, no gradients, and no drop shadows.
                </SupportingText>
              </div>

              <div className="space-y-6 bg-surface p-6 rounded-[4px] border border-border">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">Button Variants</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary">Primary action</Button>
                    <Button variant="secondary">Secondary action</Button>
                    <Button variant="outline">Outline control</Button>
                    <Button variant="ghost">Ghost action</Button>
                    <Button variant="destructive">Destructive action</Button>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">Interaction & Loading States</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="primary"
                      isLoading={buttonLoading}
                      onClick={() => {
                        setButtonLoading(true);
                        setTimeout(() => setButtonLoading(false), 2000);
                      }}
                    >
                      Click for loading state
                    </Button>
                    <Button variant="primary" disabled>Disabled primary</Button>
                    <Button variant="secondary" disabled>Disabled secondary</Button>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">Links & Inline Text Actions</span>
                  <div className="space-y-2 text-sm text-neutral-700">
                    <p>
                      Links within body copy are always <a href="#buttons" className="text-link underline hover:text-link-hover font-medium">explicitly underlined</a> so color is not the only indicator.
                    </p>
                    <p>
                      Direct task link: <a href="/assessment" className="text-link underline hover:text-link-hover font-semibold inline-flex items-center gap-1">Check scheme eligibility <ArrowRight className="w-4 h-4" /></a>
                    </p>
                  </div>
                </div>
              </div>
            </Stack>
          </Section>
        )}

        {/* 5. FORM CONTROLS */}
        {activeTab === "forms" && (
          <Section id="panel-forms" role="tabpanel" spacing="sm">
            <Stack gap={6}>
              <div>
                <SectionHeading>Form Controls & Error States</SectionHeading>
                <SupportingText>
                  Inputs feature solid borders, clear labels above the control, helper text, and 3px saffron focus rings.
                </SupportingText>
              </div>

              <div className="bg-surface p-6 rounded-[4px] border border-border max-w-form space-y-6">
                <FormSection title="Sample Financial Application Section">
                  <Input
                    label="Applicant full name"
                    placeholder="Enter name as per Aadhaar"
                    helperText="Ensure name matches your caste certificate."
                    required
                  />

                  <CurrencyInput
                    label="Estimated project cost"
                    value={currencyVal}
                    onChange={(val) => setCurrencyVal(val)}
                    helperText="Total capital expenditure including machinery and working capital."
                    required
                  />

                  <Select
                    label="Primary business sector"
                    options={[
                      { value: "services", label: "Retail & Services" },
                      { value: "mfg", label: "Manufacturing & Fabrication" },
                      { value: "agri", label: "Agriculture & Allied" },
                    ]}
                  />

                  <Textarea
                    label="Proposed business description"
                    placeholder="Briefly describe the venture..."
                    helperText="1-2 sentences explaining your business objective."
                  />

                  <Checkbox
                    label="I confirm annual family income is under ₹5,00,000"
                    description="Mandatory statutory threshold under NSFDC public circular guidelines."
                    checked={selectedChecks.income}
                    onChange={(e) => setSelectedChecks({ ...selectedChecks, income: e.target.checked })}
                  />

                  {/* Error State Showcase */}
                  <Input
                    label="District / Location"
                    defaultValue="InvalidDistrict99"
                    error="Please select an authorized district within state jurisdiction."
                    required
                  />

                  {/* Form Error Summary */}
                  <FormErrorSummary
                    errors={[
                      { fieldId: "district", message: "District 'InvalidDistrict99' is not recognized." },
                      "Family income verification document must be uploaded.",
                    ]}
                  />
                </FormSection>
              </div>
            </Stack>
          </Section>
        )}

        {/* 6. CHOICE CARDS */}
        {activeTab === "choice-cards" && (
          <Section id="panel-choice-cards" role="tabpanel" spacing="sm">
            <Stack gap={6}>
              <div>
                <SectionHeading>Choice Cards (Radio & Checkbox Selection Rows)</SectionHeading>
                <SupportingText>
                  Large, easy-to-tap 48px+ targets with distinct selection indicators that remain completely obvious in grayscale.
                </SupportingText>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-content">
                <ChoiceCard
                  type="radio"
                  title="Start or expand a business"
                  description="Explore concessional loans up to ₹50.00 Lakhs for micro-enterprises and equipment."
                  selected={selectedRadio === "business"}
                  onSelect={() => setSelectedRadio("business")}
                  icon={<Building2 className="w-5 h-5" />}
                />
                <ChoiceCard
                  type="radio"
                  title="Higher or technical education"
                  description="Explore education loans up to ₹30.00 Lakhs for studies in India or abroad."
                  selected={selectedRadio === "education"}
                  onSelect={() => setSelectedRadio("education")}
                  icon={<Calculator className="w-5 h-5" />}
                />
              </div>
            </Stack>
          </Section>
        )}

        {/* 7. PANELS & NOTICES */}
        {activeTab === "banners" && (
          <Section id="panel-banners" role="tabpanel" spacing="sm">
            <Stack gap={6}>
              <div>
                <SectionHeading>Status Panels & Statutory Notices</SectionHeading>
                <SupportingText>
                  Quiet, bordered information panels without gradient backgrounds or floating effects.
                </SupportingText>
              </div>

              <div className="space-y-4 max-w-content">
                <GuidanceNotice />

                <InfoBanner
                  title="Accredited Channel Partner Routing"
                  description="Beneficiary loans are processed directly through authorized State Channelizing Agencies and Public Sector Banks."
                />

                <SuccessBanner
                  title="Assessment complete: 2 schemes matched"
                  description="Your parameters qualify under NSFDC Term Loan and Credit Enhancement rules."
                />

                <WarningBanner
                  title="Branch operational quota at 85%"
                  description="This regional branch is nearing its seasonal disbursement ceiling. Submit applications early."
                />

                <ErrorBanner
                  title="Documentation checklist incomplete"
                  description="Income certificate issued by a competent revenue authority (Tehsildar / SDO) is required."
                />
              </div>
            </Stack>
          </Section>
        )}

        {/* 8. CARDS & SURFACES */}
        {activeTab === "cards" && (
          <Section id="panel-cards" role="tabpanel" spacing="sm">
            <Stack gap={6}>
              <div>
                <SectionHeading>Cards & Document Surfaces</SectionHeading>
                <SupportingText>
                  Constructed from paper, ink and solid borders with 4px corners and no shadows.
                </SupportingText>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-content">
                <Card hoverable>
                  <CardHeader>
                    <span className="text-xs font-bold text-accent tracking-wider uppercase">01</span>
                    <CardTitle className="text-lg">Check eligibility</CardTitle>
                    <CardDescription>
                      Deterministic 6-step questionnaire evaluating income, outlay and statutory criteria.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <a href="/assessment" className="text-sm font-semibold text-link underline flex items-center gap-1">
                      Check eligibility <ArrowRight className="w-4 h-4" />
                    </a>
                  </CardFooter>
                </Card>

                <Card hoverable>
                  <CardHeader>
                    <span className="text-xs font-bold text-accent tracking-wider uppercase">02</span>
                    <CardTitle className="text-lg">Estimate repayment</CardTitle>
                    <CardDescription>
                      Accurate amortized monthly installments, interest rates, and required promoter margin.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <a href="/calculator" className="text-sm font-semibold text-link underline flex items-center gap-1">
                      Open calculator <ArrowRight className="w-4 h-4" />
                    </a>
                  </CardFooter>
                </Card>

                <Card hoverable>
                  <CardHeader>
                    <span className="text-xs font-bold text-accent tracking-wider uppercase">03</span>
                    <CardTitle className="text-lg">Find Channel Partner</CardTitle>
                    <CardDescription>
                      Verified branch directory with NPA risk monitoring and spatial proximity routing.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <a href="/partners" className="text-sm font-semibold text-link underline flex items-center gap-1">
                      Find a partner <ArrowRight className="w-4 h-4" />
                    </a>
                  </CardFooter>
                </Card>
              </div>
            </Stack>
          </Section>
        )}
      </Stack>
    </PageContainer>
  );
}
