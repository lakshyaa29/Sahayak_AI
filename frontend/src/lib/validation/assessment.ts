import { z } from "zod";

export const step1Schema = z.object({
  purpose: z.enum(["business", "education"], {
    required_error: "Please select whether your requirement is for business or education.",
  }),
});

export const step2Schema = z.object({
  activityType: z.string().min(1, "Please select the activity or course category."),
  projectDescription: z.string().max(300, "Description should be under 300 characters.").optional(),
});

export const step3Schema = z.object({
  projectCost: z
    .number({ invalid_type_error: "Please enter a valid estimated cost." })
    .min(5000, "Estimated cost must be at least ₹5,000.")
    .max(10000000, "Estimated cost exceeds the maximum supported platform limit (₹1 Crore)."),
});

export const step4Schema = z.object({
  annualFamilyIncome: z
    .number({ invalid_type_error: "Please enter your annual family income." })
    .min(0, "Annual family income cannot be negative.")
    .max(5000000, "Please check the entered family income."),
  isScheduledCasteDeclared: z.literal(true, {
    errorMap: () => ({
      message: "Please confirm your self-declaration regarding eligibility to view concessional SC schemes.",
    }),
  }),
});

export const step5Schema = z.object({
  state: z.string().min(1, "Please select your state or union territory."),
  district: z.string().min(1, "Please select your district."),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit PIN code.")
    .optional()
    .or(z.literal("")),
});

export const fullAssessmentSchema = z.object({
  purpose: step1Schema.shape.purpose,
  activityType: step2Schema.shape.activityType,
  projectDescription: step2Schema.shape.projectDescription,
  projectCost: step3Schema.shape.projectCost,
  annualFamilyIncome: step4Schema.shape.annualFamilyIncome,
  isScheduledCasteDeclared: step4Schema.shape.isScheduledCasteDeclared,
  state: step5Schema.shape.state,
  district: step5Schema.shape.district,
  pincode: step5Schema.shape.pincode,
});

export type AssessmentSchemaType = z.infer<typeof fullAssessmentSchema>;
