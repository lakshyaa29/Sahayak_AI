import {
  formatRupees,
  formatPercent,
  formatTenure,
  formatMoratoriumPeriod,
  formatInterestRateDisplay,
  formatIndianDate,
  extractBaseInterestRate,
  calculateEstimatedMonthlyInstalment,
  reconcileFinancialStatement,
} from "../src/lib/financial-formatting.ts";
import { translations } from "../src/lib/translations.ts";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

console.log("\n=== 1. Testing Financial Formatting Utilities ===");

// 1.1 Indian Rupee Formatting
assert(formatRupees(100000) === "₹1,00,000", "Formats ₹1,00,000 correctly (1 Lakh)");
assert(formatRupees(1000000) === "₹10,00,000", "Formats ₹10,00,000 correctly (10 Lakhs)");
assert(formatRupees(10000000) === "₹1,00,00,000", "Formats ₹1,00,00,000 correctly (1 Crore)");
assert(formatRupees(0) === "₹0", "Formats zero explicitly as ₹0");
assert(formatRupees(-50000) === "-₹50,000", "Formats negative currency correctly");
assert(formatRupees(null) === "Not available", "Null fallback is 'Not available'");
assert(formatRupees(undefined) === "Not available", "Undefined fallback is 'Not available'");
assert(formatRupees(NaN) === "Not available", "NaN fallback is 'Not available'");
assert(formatRupees("", { fallback: "उपलब्ध नहीं" }) === "उपलब्ध नहीं", "Custom fallback honored");
assert(formatRupees("140000") === "₹1,40,000", "Numeric string parsed and formatted");

// 1.2 Percent Formatting
assert(formatPercent(90) === "90%", "Formats 90%");
assert(formatPercent(6.5, 1) === "6.5%", "Formats 6.5% with decimal");
assert(formatPercent(null) === "Not available", "Null percent returns fallback");

// 1.3 Tenure Formatting
assert(formatTenure(3, false) === "3 years (36 months)", "Formats 3 years in English");
assert(formatTenure(3, true) === "3 वर्ष (36 महीने)", "Formats 3 years in Hindi");
assert(formatTenure(1, false) === "1 year (12 months)", "Singular year handled in English");
assert(formatTenure(null, false) === "Not available", "Null tenure returns fallback");
assert(formatTenure(null, true) === "उपलब्ध नहीं", "Null tenure in Hindi returns 'उपलब्ध नहीं'");

// 1.4 Moratorium & Interest Rate Localization
assert(formatMoratoriumPeriod("3 - 6 months", false) === "3 - 6 months", "English moratorium preserved");
assert(formatMoratoriumPeriod("3 - 6 months", true) === "3 - 6 माह", "Hindi moratorium translated");
assert(formatMoratoriumPeriod(null, false) === "None", "Null moratorium fallback");
assert(formatInterestRateDisplay("6.5% - 7.5% p.a.", false) === "6.5% - 7.5% p.a.", "English interest display");
assert(formatInterestRateDisplay("6.5% - 7.5% p.a.", true) === "6.5% - 7.5% प्रति वर्ष", "Hindi interest display");
assert(extractBaseInterestRate("6.5% - 7.5% p.a.") === 6.5, "Extracts base interest rate 6.5%");
assert(extractBaseInterestRate("7% per year") === 7.0, "Extracts base interest rate 7.0%");

console.log("\n=== 2. Testing Monthly Instalment Calculation Formula ===");

// 2.1 Loan: ₹1,08,000, 6.5% p.a., 3 years (36 months)
const estimate1 = calculateEstimatedMonthlyInstalment(108000, 6.5, 3);
assert(estimate1.isAvailable === true, "Calculation is available");
assert(estimate1.tenureMonths === 36, "Tenure months = 36");
// Standard formula for 108000 at 6.5% / 12 for 36 months gives ~3308
assert(estimate1.monthlyInstalment > 3200 && estimate1.monthlyInstalment < 3400, "Instalment ~₹3,308");
assert(estimate1.totalRepayment === estimate1.monthlyInstalment * 36, "Total repayment matches instalment * 36");
assert(estimate1.totalInterest === estimate1.totalRepayment - 108000, "Total interest reconciles with principal");

// 2.2 Missing/Zero Inputs
const estimateInvalid = calculateEstimatedMonthlyInstalment(0, 6.5, 3);
assert(estimateInvalid.isAvailable === false, "Zero loan amount produces isAvailable: false");
assert(estimateInvalid.monthlyInstalment === 0, "Zero loan amount has monthlyInstalment 0");

console.log("\n=== 3. Testing Financial Reconciliation & Scheme Limits ===");

// 3.1 Normal 90% financing below cap (e.g. ₹1,20,000 total cost, 90% = ₹1,08,000)
const rec1 = reconcileFinancialStatement(120000, 108000, 90, 140000);
assert(rec1.projectCost === 120000, "Project cost is ₹1,20,000");
assert(rec1.loanAmount === 108000, "Loan amount is ₹1,08,000");
assert(rec1.applicantContribution === 12000, "Applicant contribution is ₹12,000");
assert(rec1.loanAmount + rec1.applicantContribution === rec1.projectCost, "Reconciliation matches exactly: L + A = C");
assert(rec1.loanSharePercent === 90, "Loan share is 90%");
assert(rec1.applicantSharePercent === 10, "Applicant share is 10%");
assert(rec1.isCapped === false, "Not capped");

// 3.2 Capped financing (e.g. Project cost ₹60,00,000, 90% would be ₹54,00,000, capped at ₹50,00,000)
const rec2 = reconcileFinancialStatement(6000000, 5000000, 90, 5000000);
assert(rec2.projectCost === 6000000, "Project cost is ₹60,00,000");
assert(rec2.loanAmount === 5000000, "Loan capped at ₹50,00,000");
assert(rec2.applicantContribution === 1000000, "Applicant contribution reconciles to ₹10,00,000");
assert(rec2.loanAmount + rec2.applicantContribution === rec2.projectCost, "Reconciles with cap: L + A = C");
assert(rec2.isCapped === true, "Cap detected");
assert(rec2.rawCalculatedLoan === 5400000, "Raw calculated was ₹54,00,000");

console.log("\n=== 4. Testing Bilingual Translation Parity & Policy Wording ===");

const enRes = translations.en.results;
const hiRes = translations.hi.results;

assert(Boolean(enRes.singleMatchHeading), "English single match heading exists");
assert(Boolean(hiRes.singleMatchHeading), "Hindi single match heading exists");
assert(enRes.singleMatchHeading === "This scheme may suit your needs.", "Exact English plain decision matches prompt");
assert(hiRes.singleMatchHeading === "यह योजना आपकी आवश्यकता के लिए उपयुक्त हो सकती है।", "Exact Hindi plain decision matches prompt");

assert(enRes.preliminaryStatusLabel === "Preliminary guidance", "Exact preliminary status label in English");
assert(hiRes.preliminaryStatusLabel === "प्रारंभिक मार्गदर्शन", "Exact preliminary status label in Hindi");

assert(enRes.noMatchHeading === "We could not find a matching scheme from the information provided.", "Exact no match heading in English");
assert(hiRes.noMatchHeading === "प्रदान की गई जानकारी से कोई मेल खाने वाली योजना नहीं मिली।", "Exact no match heading in Hindi");

assert(enRes.needsInfoHeading === "We need more information to provide guidance.", "Exact needs info heading in English");
assert(hiRes.needsInfoHeading === "मार्गदर्शन प्रदान करने के लिए हमें और जानकारी की आवश्यकता है।", "Exact needs info heading in Hindi");

assert(enRes.errorHeading === "We could not prepare your guidance.", "Exact error heading in English");
assert(hiRes.errorHeading === "हम आपका मार्गदर्शन तैयार नहीं कर सके।", "Exact error heading in Hindi");

assert(enRes.whyMatchedTitle === "Why this scheme matched", "Exact why matched title in English");
assert(hiRes.whyMatchedTitle === "यह योजना क्यों उपयुक्त पाई गई", "Exact why matched title in Hindi");

assert(enRes.financialStatementTitle === "Estimated financing", "Exact financial statement title in English");
assert(hiRes.financialStatementTitle === "अनुमानित वित्तीय विवरण", "Exact financial statement title in Hindi");

assert(enRes.repaymentTitle === "Estimated repayment", "Exact repayment title in English");
assert(hiRes.repaymentTitle === "अनुमानित पुनर्भुगतान", "Exact repayment title in Hindi");

assert(enRes.assumptionsTitle === "Assumptions used", "Exact assumptions title in English");
assert(hiRes.assumptionsTitle === "उपयोग की गई मान्यताएँ", "Exact assumptions title in Hindi");

assert(enRes.informationSourceTitle === "Information source", "Exact information source title in English");
assert(hiRes.informationSourceTitle === "जानकारी का स्रोत", "Exact information source title in Hindi");

assert(enRes.documentsTitle === "Documents to prepare", "Exact documents title in English");
assert(hiRes.documentsTitle === "तैयार रखने वाले दस्तावेज़", "Exact documents title in Hindi");

assert(enRes.primaryNextActionTitle === "Find an authorized Channel Partner", "Exact primary next action in English");
assert(hiRes.primaryNextActionTitle === "अधिकृत चैनल पार्टनर खोजें", "Exact primary next action in Hindi");

// Verify forbidden marketing / approval words are NOT used
const forbiddenWords = [
  "96% match",
  "Smart recommendation",
  "AI recommended",
  "Guaranteed eligibility",
  "Loan approved",
  "Application approved",
  "Credit score",
];

for (const word of forbiddenWords) {
  assert(
    !enRes.singleMatchHeading.includes(word) &&
    !enRes.preliminaryStatusLabel.includes(word) &&
    !enRes.preliminaryDisclaimer.includes(word),
    `Forbidden phrase '${word}' is NOT present in decision text`
  );
}

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
}
