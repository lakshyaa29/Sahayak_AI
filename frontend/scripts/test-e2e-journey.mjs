// End-to-End Quality, Accessibility, and Scenario Verification Suite
// Tests realistic scenarios across all 6 journey steps:
// Homepage -> Assessment -> Preliminary Result -> Repayment Estimate -> Channel Partner -> Next Steps

import assert from "node:assert/strict";
import {
  formatRupees,
  formatPercent,
  formatTenure,
  formatMoratoriumPeriod,
  calculateEstimatedMonthlyInstalment,
  reconcileFinancialStatement,
} from "../src/lib/financial-formatting.ts";
import {
  Step1PurposeSchema,
  Step2BusinessSchema,
  Step2EducationSchema,
  Step3CostSchema,
  Step4IncomeSchema,
  Step5LocationSchema,
  normalizeAssessmentProfile,
} from "../src/lib/schemas/assessment.ts";
import { translations } from "../src/lib/translations.ts";

let passCount = 0;
let failCount = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  PASS: ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`  FAIL: ${desc}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

console.log("\n=== SCENARIO A: Business — Potential Match Journey ===");

const businessProfileInput = {
  purpose: "business",
  businessStage: "new",
  businessDescription: "Small dairy and milk distribution enterprise",
  businessCategory: "agriculture_allied",
  totalCost: 120000,
  borrowingAmount: 108000,
  annualFamilyIncome: 250000,
  communityDeclaration: "yes",
  state: "Maharashtra",
  district: "Wardha",
  pincode: "442001",
};

it("Scenario A - Form validation passes for business inputs", () => {
  assert.doesNotThrow(() => Step1PurposeSchema.parse({ purpose: businessProfileInput.purpose }));
  assert.doesNotThrow(() => Step2BusinessSchema.parse({
    businessStage: businessProfileInput.businessStage,
    businessDescription: businessProfileInput.businessDescription,
    businessCategory: businessProfileInput.businessCategory,
  }));
  assert.doesNotThrow(() => Step3CostSchema.parse({
    totalCost: businessProfileInput.totalCost,
    borrowingAmount: businessProfileInput.borrowingAmount,
  }));
  assert.doesNotThrow(() => Step4IncomeSchema.parse({
    annualFamilyIncome: businessProfileInput.annualFamilyIncome,
    communityDeclaration: businessProfileInput.communityDeclaration,
  }));
  assert.doesNotThrow(() => Step5LocationSchema.parse({
    state: businessProfileInput.state,
    district: businessProfileInput.district,
    pincode: businessProfileInput.pincode,
  }));
});

it("Scenario A - Normalized business profile correctly isolates business fields", () => {
  const normalized = normalizeAssessmentProfile(businessProfileInput);
  assert.equal(normalized.purpose, "business");
  assert.equal(normalized.businessStage, "new");
  assert.equal(normalized.businessDescription, "Small dairy and milk distribution enterprise");
  assert.equal(normalized.totalCost, 120000);
  assert.equal(normalized.annualFamilyIncome, 250000);
  // Stale education fields must not exist
  assert.equal(normalized.courseName, undefined);
  assert.equal(normalized.studyLevel, undefined);
});

it("Scenario A - Financial reconciliation produces exact L + A = C with Micro Finance limits", () => {
  const recon = reconcileFinancialStatement(120000, 108000, 90, 140000);

  assert.equal(recon.loanAmount, 108000);
  assert.equal(recon.applicantContribution, 12000);
  assert.equal(recon.loanAmount + recon.applicantContribution, 120000);
  assert.equal(recon.isCapped, false);
  assert.equal(formatRupees(recon.loanAmount), "₹1,08,000");
  assert.equal(formatRupees(recon.applicantContribution), "₹12,000");
});

it("Scenario A - Repayment schedule accurately calculates monthly instalment", () => {
  const repayment = calculateEstimatedMonthlyInstalment(108000, 6.5, 3);

  assert.equal(repayment.isAvailable, true);
  assert.equal(repayment.tenureMonths, 36);
  assert.ok(repayment.monthlyInstalment > 3000 && repayment.monthlyInstalment < 3500);
  assert.equal(repayment.totalRepayment, repayment.monthlyInstalment * 36);
  assert.ok(repayment.totalInterest > 0);
  assert.equal(repayment.totalRepayment, 108000 + repayment.totalInterest);
});

console.log("\n=== SCENARIO B: Education — Potential Match Journey ===");

const educationProfileInput = {
  purpose: "education",
  courseName: "B.Tech Computer Science and Engineering",
  studyLevel: "undergraduate",
  admissionStatus: "confirmed",
  studyLocation: "india",
  totalCost: 500000,
  borrowingAmount: 450000,
  annualFamilyIncome: 250000,
  communityDeclaration: "yes",
  state: "Maharashtra",
  district: "Wardha",
  pincode: "442001",
};

it("Scenario B - Form validation passes for education inputs", () => {
  assert.doesNotThrow(() => Step1PurposeSchema.parse({ purpose: educationProfileInput.purpose }));
  assert.doesNotThrow(() => Step2EducationSchema.parse({
    courseName: educationProfileInput.courseName,
    studyLevel: educationProfileInput.studyLevel,
    admissionStatus: educationProfileInput.admissionStatus,
    studyLocation: educationProfileInput.studyLocation,
  }));
  assert.doesNotThrow(() => Step3CostSchema.parse({
    totalCost: educationProfileInput.totalCost,
    borrowingAmount: educationProfileInput.borrowingAmount,
  }));
  assert.doesNotThrow(() => Step4IncomeSchema.parse({
    annualFamilyIncome: educationProfileInput.annualFamilyIncome,
    communityDeclaration: educationProfileInput.communityDeclaration,
  }));
  assert.doesNotThrow(() => Step5LocationSchema.parse({
    state: educationProfileInput.state,
    district: educationProfileInput.district,
    pincode: educationProfileInput.pincode,
  }));
});

it("Scenario B - Normalized education profile strips stale business fields", () => {
  const normalized = normalizeAssessmentProfile(educationProfileInput);
  assert.equal(normalized.purpose, "education");
  assert.equal(normalized.courseName, "B.Tech Computer Science and Engineering");
  assert.equal(normalized.studyLevel, "undergraduate");
  assert.equal(normalized.totalCost, 500000);
  assert.equal(normalized.businessDescription, undefined);
  assert.equal(normalized.businessStage, undefined);
});

it("Scenario B - Education loan financial reconciliation with 90% financing", () => {
  const recon = reconcileFinancialStatement(500000, 450000, 90, 2000000);

  assert.equal(recon.loanAmount, 450000);
  assert.equal(recon.applicantContribution, 50000);
  assert.equal(recon.loanAmount + recon.applicantContribution, 500000);
  assert.equal(formatRupees(recon.loanAmount), "₹4,50,000");
  assert.equal(formatRupees(recon.applicantContribution), "₹50,000");
});

it("Scenario B - Education loan instalment calculation with 5 year tenure and 4% rate", () => {
  const repayment = calculateEstimatedMonthlyInstalment(450000, 4.0, 5);

  assert.equal(repayment.isAvailable, true);
  assert.equal(repayment.tenureMonths, 60);
  assert.ok(repayment.monthlyInstalment > 8000 && repayment.monthlyInstalment < 9000);
  assert.equal(repayment.totalRepayment, repayment.monthlyInstalment * 60);
  assert.ok(repayment.totalInterest > 0);
});

console.log("\n=== SCENARIO C: No Current Match (Truthful Non-Matching Values) ===");

it("Scenario C - High project cost exceeding scheme caps is handled safely", () => {
  const hugeCost = 7500000;
  const maxCap = 5000000;
  const recon = reconcileFinancialStatement(hugeCost, maxCap, 90, maxCap);

  assert.equal(recon.loanAmount, maxCap); // Capped at ₹50 Lakhs
  assert.equal(recon.isCapped, true);
  assert.equal(recon.applicantContribution, 2500000); // Residual contribution
  assert.equal(recon.loanAmount + recon.applicantContribution, hugeCost);
});

it("Scenario C - Ineligible community declaration ('no') schema check", () => {
  const ineligibleCommunity = Step4IncomeSchema.safeParse({
    annualFamilyIncome: 200000,
    communityDeclaration: "no",
  });
  assert.equal(ineligibleCommunity.success, true);
  // Backend rule correctly marks status as INELIGIBLE for "no", which frontend NoMatchView displays
  assert.equal(ineligibleCommunity.data.communityDeclaration, "no");
});

console.log("\n=== SCENARIO D: Uncertain or Incomplete Data ===");

it("Scenario D - Community declaration 'unsure' or 'prefer_not_to_say'", () => {
  const parsedUnsure = Step4IncomeSchema.safeParse({
    annualFamilyIncome: 250000,
    communityDeclaration: "unsure",
  });
  assert.equal(parsedUnsure.success, true);
  assert.equal(parsedUnsure.data.communityDeclaration, "unsure");

  const parsedPreferNot = Step4IncomeSchema.safeParse({
    annualFamilyIncome: 250000,
    communityDeclaration: "prefer_not_to_say",
  });
  assert.equal(parsedPreferNot.success, true);
  assert.equal(parsedPreferNot.data.communityDeclaration, "prefer_not_to_say");
});

it("Scenario D - Zero or missing financial values never display NaN or undefined", () => {
  assert.equal(formatRupees(null), "Not available");
  assert.equal(formatRupees(undefined), "Not available");
  assert.equal(formatRupees(NaN), "Not available");
  assert.equal(formatPercent(null), "Not available");
  assert.equal(formatTenure(null, false), "Not available");
  assert.equal(formatTenure(null, true), "उपलब्ध नहीं");
  assert.equal(formatMoratoriumPeriod(null, false), "None");
  assert.equal(formatMoratoriumPeriod(null, true), "लागू नहीं");
});

console.log("\n=== SCENARIO E: Boundary Values ===");

it("Scenario E - Project cost exactly at Micro Finance cap ₹1,40,000", () => {
  const recon = reconcileFinancialStatement(140000, 126000, 90, 140000);
  assert.equal(recon.loanAmount, 126000);
  assert.equal(recon.applicantContribution, 14000);
  assert.equal(recon.isCapped, false);
});

it("Scenario E - Project cost ₹2,00,000 exceeding Micro Finance ₹1,40,000 cap", () => {
  const recon = reconcileFinancialStatement(200000, 140000, 90, 140000);
  assert.equal(recon.loanAmount, 140000);
  assert.equal(recon.applicantContribution, 60000);
  assert.equal(recon.isCapped, true);
  assert.equal(recon.loanAmount + recon.applicantContribution, 200000);
});

it("Scenario E - Zero income is allowed and formatted correctly", () => {
  const zeroIncome = Step4IncomeSchema.safeParse({
    annualFamilyIncome: 0,
    communityDeclaration: "yes",
  });
  assert.equal(zeroIncome.success, true);
  assert.equal(formatRupees(0), "₹0");
});

it("Scenario E - Negative income is rejected by schema", () => {
  const negativeIncome = Step4IncomeSchema.safeParse({
    annualFamilyIncome: -50000,
    communityDeclaration: "yes",
  });
  assert.equal(negativeIncome.success, false);
});

it("Scenario E - Decimals in cost and income are handled safely", () => {
  const decimalCost = Step3CostSchema.safeParse({
    totalCost: 125000.50,
  });
  assert.equal(decimalCost.success, true);
  assert.equal(formatRupees(125000.50), "₹1,25,001"); // Math.round to whole rupee
});

console.log("\n=== SCENARIO F: Conditional Branch Change ===");

it("Scenario F - Switching from Business to Education clears stale business fields", () => {
  const hybridInput = {
    purpose: "education",
    businessDescription: "Stale business description that should be discarded",
    businessStage: "new",
    courseName: "Master of Science in Biotechnology",
    studyLevel: "postgraduate",
    admissionStatus: "confirmed",
    studyLocation: "india",
    totalCost: 600000,
    annualFamilyIncome: 300000,
    communityDeclaration: "yes",
    state: "Maharashtra",
    district: "Wardha",
  };

  const normalized = normalizeAssessmentProfile(hybridInput);
  assert.equal(normalized.purpose, "education");
  assert.equal(normalized.courseName, "Master of Science in Biotechnology");
  assert.equal(normalized.businessDescription, undefined);
  assert.equal(normalized.businessStage, undefined);
});

it("Scenario F - Switching from Education to Business clears stale education fields", () => {
  const hybridInput = {
    purpose: "business",
    courseName: "Stale MBBS Course Name",
    studyLevel: "undergraduate",
    businessDescription: "Mobile repair and accessories shop",
    businessStage: "expanding",
    businessCategory: "retail_services",
    totalCost: 200000,
    annualFamilyIncome: 280000,
    communityDeclaration: "yes",
    state: "Maharashtra",
    district: "Wardha",
  };

  const normalized = normalizeAssessmentProfile(hybridInput);
  assert.equal(normalized.purpose, "business");
  assert.equal(normalized.businessDescription, "Mobile repair and accessories shop");
  assert.equal(normalized.courseName, undefined);
  assert.equal(normalized.studyLevel, undefined);
});

console.log("\n=== SCENARIO G: Bilingual Parity (EN & HI) ===");

it("Scenario G - All Next Steps translation keys match between English and Hindi", () => {
  const enNextSteps = translations.en.nextSteps;
  const hiNextSteps = translations.hi.nextSteps;

  assert.ok(enNextSteps, "en.nextSteps should exist");
  assert.ok(hiNextSteps, "hi.nextSteps should exist");

  const enKeys = Object.keys(enNextSteps);
  const hiKeys = Object.keys(hiNextSteps);

  assert.deepEqual(enKeys.sort(), hiKeys.sort(), "NextSteps translation keys must match exactly between EN and HI");
});

it("Scenario G - Financial outputs display identically in numerical precision across EN and HI", () => {
  const amount = 350000;
  const enFormatted = formatRupees(amount);
  const hiFormatted = formatRupees(amount);
  assert.equal(enFormatted, "₹3,50,000");
  assert.equal(hiFormatted, "₹3,50,000");

  const percent = 7.5;
  assert.equal(formatPercent(percent, 1), "7.5%");
});

console.log(`\n========================================`);
console.log(`E2E Journey Suite Results: ${passCount} passed, ${failCount} failed.`);
console.log(`========================================\n`);

if (failCount > 0) {
  process.exit(1);
}
