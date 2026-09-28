import { z } from "zod";
import {
  Step1PurposeSchema,
  Step2BusinessSchema,
  Step2EducationSchema,
  Step3CostSchema,
  Step4IncomeSchema,
  Step5LocationSchema,
  normalizeAssessmentProfile,
  DEFAULT_ASSESSMENT_VALUES,
} from "../src/lib/schemas/assessment.ts";
import { translations } from "../src/lib/translations.ts";

const en = translations.en;
const hi = translations.hi;

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

console.log("\n=== Testing Assessment Schemas & Logic ===");

// 1. Purpose Validation
assert(Step1PurposeSchema.safeParse({ purpose: "business" }).success, "Purpose 'business' is valid");
assert(Step1PurposeSchema.safeParse({ purpose: "education" }).success, "Purpose 'education' is valid");
assert(!Step1PurposeSchema.safeParse({ purpose: "invalid" }).success, "Purpose 'invalid' is rejected");

// 2. Business Branch Validation
assert(
  Step2BusinessSchema.safeParse({
    businessDescription: "Kirana Grocery Shop",
    businessCategory: "retail_services",
    businessStage: "new",
  }).success,
  "Valid business fields pass schema"
);
assert(
  !Step2BusinessSchema.safeParse({
    businessDescription: "ab", // < 3 chars
    businessStage: "new",
  }).success,
  "Short business description is rejected (< 3 chars)"
);

// 3. Education Branch Validation
assert(
  Step2EducationSchema.safeParse({
    courseName: "B.Tech Computer Science",
    studyLevel: "undergraduate",
    admissionStatus: "confirmed",
    studyLocation: "india",
  }).success,
  "Valid education fields pass schema"
);
assert(
  !Step2EducationSchema.safeParse({
    courseName: "A", // < 2 chars
    studyLevel: "undergraduate",
    admissionStatus: "confirmed",
    studyLocation: "india",
  }).success,
  "Short course name is rejected (< 2 chars)"
);

// 4. Cost Validation
assert(
  Step3CostSchema.safeParse({ totalCost: 150000, borrowingAmount: 120000 }).success,
  "Cost with valid borrowing amount passes"
);
assert(
  !Step3CostSchema.safeParse({ totalCost: 0 }).success,
  "Cost of 0 is rejected"
);
assert(
  !Step3CostSchema.safeParse({ totalCost: 100000, borrowingAmount: 150000 }).success,
  "Borrowing amount > totalCost is rejected"
);

// 5. Income Validation
assert(
  Step4IncomeSchema.safeParse({ annualFamilyIncome: 0, communityDeclaration: "yes" }).success,
  "Zero income is allowed"
);
assert(
  Step4IncomeSchema.safeParse({ annualFamilyIncome: 250000, communityDeclaration: "yes" }).success,
  "Positive family income passes"
);
assert(
  !Step4IncomeSchema.safeParse({ annualFamilyIncome: -100, communityDeclaration: "yes" }).success,
  "Negative family income is rejected"
);

// 6. Location Validation
assert(
  Step5LocationSchema.safeParse({ state: "Maharashtra", district: "Wardha", pincode: "442001" }).success,
  "Valid 6-digit pincode passes"
);
assert(
  !Step5LocationSchema.safeParse({ state: "Maharashtra", district: "Wardha", pincode: "123" }).success,
  "Invalid 3-digit pincode is rejected"
);

// 7. Profile Normalization
const busProfile = normalizeAssessmentProfile({
  ...DEFAULT_ASSESSMENT_VALUES,
  purpose: "business",
  businessDescription: "Mobile repair shop",
  businessStage: "expanding",
  courseName: "SHOULD_BE_STRIPPED",
});
assert(busProfile.purpose === "business", "Normalized profile has purpose 'business'");
assert(busProfile.businessDescription === "Mobile repair shop", "Business description preserved");
assert(!("courseName" in busProfile), "Inactive education field courseName is stripped from business profile");

const eduProfile = normalizeAssessmentProfile({
  ...DEFAULT_ASSESSMENT_VALUES,
  purpose: "education",
  courseName: "MBBS",
  studyLevel: "undergraduate",
  businessDescription: "SHOULD_BE_STRIPPED",
});
assert(eduProfile.purpose === "education", "Normalized profile has purpose 'education'");
assert(eduProfile.courseName === "MBBS", "Education courseName preserved");
assert(!("businessDescription" in eduProfile), "Inactive business field businessDescription is stripped from education profile");

// 8. Translation Parity
console.log("\n=== Testing Translation Parity (EN & HI) ===");
const enGuided = en.assessment.guided;
const hiGuided = hi.assessment.guided;

assert(typeof enGuided.progressLabel === "function", "en.progressLabel is a function");
assert(typeof hiGuided.progressLabel === "function", "hi.progressLabel is a function");
assert(enGuided.progressLabel(2, 7) === "Question 2 of 7", "en progress text formatted correctly");
assert(hiGuided.progressLabel(2, 7) === "प्रश्न 2 / 7", "hi progress text formatted correctly");

const qKeys = [
  "purpose",
  "businessStage",
  "businessActivity",
  "educationCourse",
  "educationLevel",
  "educationAdmission",
  "educationLocation",
  "cost",
  "income",
  "community",
  "location",
];

for (const key of qKeys) {
  if (key === "cost") {
    assert(Boolean(enGuided.questions.cost?.businessHeading && enGuided.questions.cost?.educationHeading), `EN question 'cost' has business and education headings`);
    assert(Boolean(hiGuided.questions.cost?.businessHeading && hiGuided.questions.cost?.educationHeading), `HI question 'cost' has business and education headings`);
  } else {
    assert(Boolean(enGuided.questions[key]?.heading), `EN question '${key}' has heading`);
    assert(Boolean(hiGuided.questions[key]?.heading), `HI question '${key}' has heading`);
  }
  assert(Boolean(enGuided.questions[key]?.whyWeAsk), `EN question '${key}' has 'whyWeAsk'`);
  assert(Boolean(hiGuided.questions[key]?.whyWeAsk), `HI question '${key}' has 'whyWeAsk'`);
}

const vKeys = [
  "purposeRequired",
  "businessStageRequired",
  "businessDescriptionRequired",
  "courseNameRequired",
  "studyLevelRequired",
  "admissionStatusRequired",
  "studyLocationRequired",
  "costRequired",
  "borrowingInvalid",
  "incomeRequired",
  "communityRequired",
  "stateRequired",
  "districtRequired",
  "pincodeInvalid",
];

for (const v of vKeys) {
  assert(Boolean(enGuided.validation[v]), `EN validation message '${v}' exists`);
  assert(Boolean(hiGuided.validation[v]), `HI validation message '${v}' exists`);
}

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
