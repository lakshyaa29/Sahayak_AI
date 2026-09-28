import assert from "node:assert/strict";
import {
  Step1PurposeSchema,
  Step2BusinessSchema,
  Step2EducationSchema,
  Step3CostSchema,
  Step4IncomeSchema,
  Step5LocationSchema,
  normalizeAssessmentProfile,
} from "../src/lib/schemas/assessment.ts";

console.log("Starting Step 4 Assessment Validation & Normalization Tests...");

// 1. Step 1: Purpose
{
  assert.equal(Step1PurposeSchema.safeParse({ purpose: "business" }).success, true);
  assert.equal(Step1PurposeSchema.safeParse({ purpose: "education" }).success, true);
  assert.equal(Step1PurposeSchema.safeParse({ purpose: "other" }).success, false);
  assert.equal(Step1PurposeSchema.safeParse({}).success, false);
  console.log("✓ Step 1 Purpose Schema passed");
}

// 2. Step 2: Business Branch
{
  // Valid business
  const valid = Step2BusinessSchema.safeParse({
    businessDescription: "Tailoring and garment repair unit",
    businessCategory: "retail_services",
    businessStage: "new",
  });
  assert.equal(valid.success, true);

  // Business without optional category
  const withoutCategory = Step2BusinessSchema.safeParse({
    businessDescription: "Dairy farming with 4 cows",
    businessStage: "expanding",
  });
  assert.equal(withoutCategory.success, true);

  // Business with description under 3 chars
  const shortDesc = Step2BusinessSchema.safeParse({
    businessDescription: "ab",
    businessStage: "new",
  });
  assert.equal(shortDesc.success, false);

  // Business with missing stage
  const missingStage = Step2BusinessSchema.safeParse({
    businessDescription: "Grocery shop",
  });
  assert.equal(missingStage.success, false);

  console.log("✓ Step 2 Business Schema passed");
}

// 3. Step 2: Education Branch
{
  // Valid education
  const valid = Step2EducationSchema.safeParse({
    courseName: "B.Tech Computer Science",
    studyLevel: "undergraduate",
    admissionStatus: "confirmed",
    studyLocation: "india",
    institutionName: "Pune Institute of Computer Technology",
    courseDurationMonths: 48,
  });
  assert.equal(valid.success, true);

  // Valid education without optional institution and duration
  const minimal = Step2EducationSchema.safeParse({
    courseName: "MBBS",
    studyLevel: "undergraduate",
    admissionStatus: "applied_awaiting",
    studyLocation: "outside_india",
  });
  assert.equal(minimal.success, true);

  // Missing courseName
  const noCourse = Step2EducationSchema.safeParse({
    studyLevel: "postgraduate",
    admissionStatus: "confirmed",
    studyLocation: "india",
  });
  assert.equal(noCourse.success, false);

  // Invalid duration (>120 months)
  const invalidDuration = Step2EducationSchema.safeParse({
    courseName: "Diploma in Mechanical",
    studyLevel: "diploma",
    admissionStatus: "confirmed",
    studyLocation: "india",
    courseDurationMonths: 200,
  });
  assert.equal(invalidDuration.success, false);

  console.log("✓ Step 2 Education Schema passed");
}

// 4. Step 3: Estimated Cost & Cross-field Check
{
  // Valid cost without borrowing amount
  const validCost = Step3CostSchema.safeParse({
    totalCost: 150000,
  });
  assert.equal(validCost.success, true);

  // Valid cost with valid borrowing amount
  const validBorrowing = Step3CostSchema.safeParse({
    totalCost: 200000,
    borrowingAmount: 180000,
  });
  assert.equal(validBorrowing.success, true);

  // Zero cost rejected
  const zeroCost = Step3CostSchema.safeParse({
    totalCost: 0,
  });
  assert.equal(zeroCost.success, false);

  // Negative cost rejected
  const negativeCost = Step3CostSchema.safeParse({
    totalCost: -5000,
  });
  assert.equal(negativeCost.success, false);

  // Borrowing amount > total cost rejected
  const excessBorrowing = Step3CostSchema.safeParse({
    totalCost: 100000,
    borrowingAmount: 150000,
  });
  assert.equal(excessBorrowing.success, false);
  assert.match(excessBorrowing.error.issues[0].message, /cannot exceed the total estimated cost/i);

  console.log("✓ Step 3 Cost Schema & cross-field checks passed");
}

// 5. Step 4: Income & Community Self-Declaration
{
  // Zero income allowed
  const zeroIncome = Step4IncomeSchema.safeParse({
    annualFamilyIncome: 0,
    communityDeclaration: "yes",
  });
  assert.equal(zeroIncome.success, true);

  // Income above 5 Lakh allowed
  const highIncome = Step4IncomeSchema.safeParse({
    annualFamilyIncome: 1200000,
    communityDeclaration: "yes",
  });
  assert.equal(highIncome.success, true);

  // Negative income rejected
  const negativeIncome = Step4IncomeSchema.safeParse({
    annualFamilyIncome: -1000,
    communityDeclaration: "yes",
  });
  assert.equal(negativeIncome.success, false);

  // 4 community options all allowed
  for (const opt of ["yes", "no", "unsure", "prefer_not_to_say"]) {
    const res = Step4IncomeSchema.safeParse({
      annualFamilyIncome: 250000,
      communityDeclaration: opt,
    });
    assert.equal(res.success, true);
  }

  // Invalid community option rejected
  const invalidOpt = Step4IncomeSchema.safeParse({
    annualFamilyIncome: 250000,
    communityDeclaration: "invalid_option",
  });
  assert.equal(invalidOpt.success, false);

  console.log("✓ Step 4 Income & Eligibility Schema passed");
}

// 6. Step 5: Location
{
  // Valid location with 6-digit postal code
  const withPincode = Step5LocationSchema.safeParse({
    state: "Maharashtra",
    district: "Wardha",
    pincode: "442001",
  });
  assert.equal(withPincode.success, true);

  // Valid location without postal code
  const withoutPincode = Step5LocationSchema.safeParse({
    state: "Uttar Pradesh",
    district: "Varanasi",
  });
  assert.equal(withoutPincode.success, true);

  // Invalid pincode (not 6 digits or non-digits)
  assert.equal(
    Step5LocationSchema.safeParse({ state: "Maharashtra", district: "Pune", pincode: "12345" }).success,
    false
  );
  assert.equal(
    Step5LocationSchema.safeParse({ state: "Maharashtra", district: "Pune", pincode: "44200A" }).success,
    false
  );

  console.log("✓ Step 5 Location Schema passed");
}

// 7. Normalization & Cross-Branch Stale Data Exclusion
{
  // Form values that had dirty cross-branch data (e.g. user toggled from education to business)
  const dirtyBusinessValues = {
    purpose: "business",
    businessDescription: "Automobile repair workshop",
    businessCategory: "manufacturing",
    businessStage: "expanding",
    // Stale education fields
    courseName: "Old MBA course left in state",
    studyLevel: "postgraduate",
    institutionName: "Old college",
    // Shared fields
    totalCost: 500000,
    borrowingAmount: 450000,
    annualFamilyIncome: 300000,
    communityDeclaration: "yes",
    state: "Maharashtra",
    district: "Nagpur",
    pincode: "440001",
  };

  const normalizedBusiness = normalizeAssessmentProfile(dirtyBusinessValues);
  assert.equal(normalizedBusiness.purpose, "business");
  assert.equal(normalizedBusiness.businessDescription, "Automobile repair workshop");
  assert.equal("courseName" in normalizedBusiness, false);
  assert.equal("studyLevel" in normalizedBusiness, false);
  assert.equal("institutionName" in normalizedBusiness, false);
  assert.equal(normalizedBusiness.totalCost, 500000);
  assert.equal(normalizedBusiness.borrowingAmount, 450000);

  // Test education normalization
  const dirtyEducationValues = {
    purpose: "education",
    // Stale business fields
    businessDescription: "Old grocery shop left in state",
    businessStage: "new",
    // Education fields
    courseName: "M.Tech Robotics",
    studyLevel: "postgraduate",
    admissionStatus: "confirmed",
    studyLocation: "india",
    totalCost: 600000,
    annualFamilyIncome: 400000,
    communityDeclaration: "yes",
    state: "Karnataka",
    district: "Bengaluru Urban",
  };

  const normalizedEducation = normalizeAssessmentProfile(dirtyEducationValues);
  assert.equal(normalizedEducation.purpose, "education");
  assert.equal(normalizedEducation.courseName, "M.Tech Robotics");
  assert.equal("businessDescription" in normalizedEducation, false);
  assert.equal("businessStage" in normalizedEducation, false);
  assert.equal(normalizedEducation.totalCost, 600000);

  console.log("✓ Normalization successfully strips stale branch data");
}

console.log("\nALL 7 VALIDATION AND NORMALIZATION SUITES PASSED SUCCESSFULLY!");
