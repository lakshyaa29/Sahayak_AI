import { z } from "zod";

export type PurposeType = "business" | "education";

export type CommunityDeclarationType = "yes" | "no" | "unsure" | "prefer_not_to_say";

export type BusinessCategoryType =
  | "agriculture_allied"
  | "manufacturing"
  | "retail_services"
  | "transport"
  | "other";

export type BusinessStageType = "new" | "expanding";

export type EducationLevelType =
  | "diploma"
  | "undergraduate"
  | "postgraduate"
  | "doctoral"
  | "other";

export type AdmissionStatusType = "confirmed" | "applied_awaiting" | "exploring";

export type StudyLocationType = "india" | "outside_india" | "not_decided";

// Step 1: Purpose
export const Step1PurposeSchema = z.object({
  purpose: z.enum(["business", "education"], {
    errorMap: () => ({ message: "Please select whether you need financing for Business or Education." }),
  }),
});

// Step 2: Business Branch
export const Step2BusinessSchema = z.object({
  businessDescription: z
    .string()
    .trim()
    .min(3, { message: "Please describe your business or activity (at least 3 characters)." })
    .max(200, { message: "Description cannot exceed 200 characters." }),
  businessCategory: z
    .enum(["agriculture_allied", "manufacturing", "retail_services", "transport", "other", ""])
    .optional(),
  businessStage: z.enum(["new", "expanding"], {
    errorMap: () => ({ message: "Please select whether you are starting a new business or expanding." }),
  }),
});

// Step 2: Education Branch
export const Step2EducationSchema = z.object({
  courseName: z
    .string()
    .trim()
    .min(2, { message: "Please enter your course or programme name (at least 2 characters)." })
    .max(150, { message: "Course name cannot exceed 150 characters." }),
  studyLevel: z.enum(["diploma", "undergraduate", "postgraduate", "doctoral", "other"], {
    errorMap: () => ({ message: "Please select your study level." }),
  }),
  admissionStatus: z.enum(["confirmed", "applied_awaiting", "exploring"], {
    errorMap: () => ({ message: "Please select your current admission status." }),
  }),
  studyLocation: z.enum(["india", "outside_india", "not_decided"], {
    errorMap: () => ({ message: "Please select your study location." }),
  }),
  institutionName: z.string().trim().max(150, "Institution name cannot exceed 150 characters.").optional(),
  courseDurationMonths: z
    .union([z.number().int().positive(), z.nan(), z.undefined()])
    .optional()
    .refine((val) => val === undefined || isNaN(val) || (val > 0 && val <= 120), {
      message: "Course duration must be between 1 and 120 months.",
    }),
  institutionAccredited: z.boolean().default(true),
});

// Step 3: Estimated Cost
export const Step3CostSchema = z
  .object({
    totalCost: z
      .number({ invalid_type_error: "Please enter a valid estimated cost." })
      .gt(0, { message: "Estimated cost must be greater than zero." }),
    borrowingAmount: z
      .union([z.number(), z.nan(), z.undefined()])
      .optional()
      .refine((val) => val === undefined || isNaN(val) || val > 0, {
        message: "Requested borrowing amount must be greater than zero if specified.",
      }),
  })
  .refine(
    (data) => {
      if (data.borrowingAmount !== undefined && !isNaN(data.borrowingAmount) && data.borrowingAmount > 0) {
        return data.borrowingAmount <= data.totalCost;
      }
      return true;
    },
    {
      message: "Requested borrowing amount cannot exceed the total estimated cost.",
      path: ["borrowingAmount"],
    }
  );

// Step 4: Income & Community Self-Declaration
export const Step4IncomeSchema = z.object({
  annualFamilyIncome: z
    .number({ invalid_type_error: "Please enter your annual family income." })
    .min(0, { message: "Income cannot be negative. Enter 0 if currently zero." }),
  communityDeclaration: z.enum(["yes", "no", "unsure", "prefer_not_to_say"], {
    errorMap: () => ({ message: "Please select a community self-declaration option." }),
  }),
});

// Step 5: Location
export const Step5LocationSchema = z.object({
  state: z.string().trim().min(1, { message: "Please select your state." }),
  district: z.string().trim().min(1, { message: "Please select or specify your district." }),
  pincode: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[1-9][0-9]{5}$/.test(val), {
      message: "Postal code must be a valid 6-digit Indian PIN code.",
    }),
});

// Form state values holding all fields during the wizard
export interface AssessmentFormValues {
  purpose: PurposeType;

  // Business specific
  businessDescription: string;
  businessCategory?: BusinessCategoryType | "";
  businessStage?: BusinessStageType;

  // Education specific
  courseName: string;
  studyLevel?: EducationLevelType;
  admissionStatus?: AdmissionStatusType;
  studyLocation?: StudyLocationType;
  institutionName?: string;
  institutionAccredited?: boolean;
  courseDurationMonths?: number;

  // Shared financials & location
  totalCost: number;
  projectCost?: number; // Kept in sync with totalCost for backwards compatibility
  activityType?: string; // Legacy fallback for Step 1/2 route references
  borrowingAmount?: number;
  annualFamilyIncome: number;
  communityDeclaration: CommunityDeclarationType;
  state: string;
  district: string;
  pincode?: string;
}

// Initial defaults for a fresh assessment
export const DEFAULT_ASSESSMENT_VALUES: AssessmentFormValues = {
  purpose: "business",
  businessDescription: "",
  businessCategory: "",
  businessStage: "new",
  courseName: "",
  studyLevel: "undergraduate",
  admissionStatus: "confirmed",
  studyLocation: "india",
  institutionName: "",
  institutionAccredited: true,
  courseDurationMonths: undefined,
  totalCost: 120000,
  projectCost: 120000,
  activityType: "",
  borrowingAmount: undefined,
  annualFamilyIncome: 250000,
  communityDeclaration: "yes",
  state: "Maharashtra",
  district: "Wardha",
  pincode: "",
};

// Discriminated Union for Confirmed Profile (Passed to /results and Step 5 rule matching)
export interface BaseAssessmentProfile {
  schemaVersion: number;
  completedAt: string;
  totalCost: number;
  borrowingAmount?: number;
  annualFamilyIncome: number;
  communityDeclaration: CommunityDeclarationType;
  state: string;
  district: string;
  pincode?: string;
}

export interface BusinessAssessmentProfile extends BaseAssessmentProfile {
  purpose: "business";
  businessDescription: string;
  businessCategory?: BusinessCategoryType;
  businessStage: BusinessStageType;
}

export interface EducationAssessmentProfile extends BaseAssessmentProfile {
  purpose: "education";
  courseName: string;
  studyLevel: EducationLevelType;
  admissionStatus: AdmissionStatusType;
  studyLocation: StudyLocationType;
  institutionName?: string;
  institutionAccredited?: boolean;
  institution_accredited?: boolean;
  courseDurationMonths?: number;
}

export type AssessmentProfile = BusinessAssessmentProfile | EducationAssessmentProfile;

/**
 * Normalizes wizard form values into a clean, typed AssessmentProfile.
 * Completely strips out the inactive branch fields to prevent stale cross-branch corruption.
 */
export function normalizeAssessmentProfile(
  values: AssessmentFormValues,
  schemaVersion: number = 2
): AssessmentProfile {
  const base: BaseAssessmentProfile = {
    schemaVersion,
    completedAt: new Date().toISOString(),
    totalCost: values.totalCost,
    borrowingAmount:
      values.borrowingAmount !== undefined && !isNaN(values.borrowingAmount) && values.borrowingAmount > 0
        ? values.borrowingAmount
        : undefined,
    annualFamilyIncome: values.annualFamilyIncome,
    communityDeclaration: values.communityDeclaration,
    state: values.state,
    district: values.district,
    pincode: values.pincode ? values.pincode.trim() : undefined,
  };

  if (values.purpose === "business") {
    return {
      ...base,
      purpose: "business",
      businessDescription: values.businessDescription.trim(),
      businessCategory: values.businessCategory ? (values.businessCategory as BusinessCategoryType) : undefined,
      businessStage: values.businessStage || "new",
    };
  } else {
    return {
      ...base,
      purpose: "education",
      courseName: values.courseName.trim(),
      studyLevel: values.studyLevel || "undergraduate",
      admissionStatus: values.admissionStatus || "confirmed",
      studyLocation: values.studyLocation || "india",
      institutionName: values.institutionName ? values.institutionName.trim() : undefined,
      institutionAccredited: values.institutionAccredited !== undefined ? values.institutionAccredited : true,
      institution_accredited: values.institutionAccredited !== undefined ? values.institutionAccredited : true,
      courseDurationMonths:
        values.courseDurationMonths && !isNaN(values.courseDurationMonths) && values.courseDurationMonths > 0
          ? values.courseDurationMonths
          : undefined,
    };
  }
}
