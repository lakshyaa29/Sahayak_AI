"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAssessment } from "@/lib/assessment-context";
import { useLanguage } from "@/lib/language-context";
import { AssessmentLayout } from "@/components/assessment/AssessmentLayout";
import { AssessmentProgress } from "@/components/assessment/AssessmentProgress";
import { PurposeQuestion } from "@/components/assessment/PurposeQuestion";
import { BusinessStageQuestion } from "@/components/assessment/BusinessStageQuestion";
import { BusinessActivityQuestion } from "@/components/assessment/BusinessActivityQuestion";
import { EducationCourseQuestion } from "@/components/assessment/EducationCourseQuestion";
import { EducationLevelQuestion } from "@/components/assessment/EducationLevelQuestion";
import { EducationAdmissionQuestion } from "@/components/assessment/EducationAdmissionQuestion";
import { EducationLocationQuestion } from "@/components/assessment/EducationLocationQuestion";
import { CostQuestion } from "@/components/assessment/CostQuestion";
import { IncomeQuestion } from "@/components/assessment/IncomeQuestion";
import { CommunityQuestion } from "@/components/assessment/CommunityQuestion";
import { LocationQuestion } from "@/components/assessment/LocationQuestion";
import { ReviewScreen } from "@/components/assessment/ReviewScreen";
import { ResetConfirmationDialog } from "@/components/assessment/ResetConfirmationDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  Step1PurposeSchema,
  Step2BusinessSchema,
  Step2EducationSchema,
  Step3CostSchema,
  Step4IncomeSchema,
  Step5LocationSchema,
  PurposeType,
  BusinessStageType,
  EducationLevelType,
  AdmissionStatusType,
  StudyLocationType,
  CommunityDeclarationType,
} from "@/lib/schemas/assessment";

type QuestionId =
  | "purpose"
  | "businessStage"
  | "businessActivity"
  | "educationCourse"
  | "educationLevel"
  | "educationAdmission"
  | "educationLocation"
  | "cost"
  | "income"
  | "community"
  | "location"
  | "review";

function AssessmentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    values,
    updateValues,
    setPurposeWithBranchReset,
    confirmAndFinalize,
    evaluateAssessment,
    isEvaluating,
    resetAssessment,
    draftRestored,
    draftWarning,
    clearDraftWarning,
  } = useAssessment();
  const { t } = useLanguage();
  const guidedT = t.assessment.guided;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isResetOpen, setIsResetOpen] = useState(false);
  const liveAnnounceRef = useRef<HTMLDivElement>(null);

  // Derive the active sequence of question IDs based on purpose
  const activeSteps: QuestionId[] = useMemo(() => {
    if (values.purpose === "education") {
      return [
        "purpose",
        "educationCourse",
        "educationLevel",
        "educationAdmission",
        "educationLocation",
        "cost",
        "income",
        "community",
        "location",
        "review",
      ];
    }
    return [
      "purpose",
      "businessStage",
      "businessActivity",
      "cost",
      "income",
      "community",
      "location",
      "review",
    ];
  }, [values.purpose]);

  // Read current step from URL (?step=1 to 7/9 or ?step=review or stepId)
  const currentStepParam = searchParams.get("step");
  const returnToReviewParam = searchParams.get("returnToReview") === "true";

  // Resolve active index in activeSteps
  const currentStepIndex = useMemo(() => {
    if (!currentStepParam || currentStepParam === "1") return 0;
    if (currentStepParam === "review") return activeSteps.indexOf("review");

    // Check if numeric
    const parsedNum = parseInt(currentStepParam, 10);
    if (!isNaN(parsedNum) && parsedNum >= 1 && parsedNum <= activeSteps.length) {
      return parsedNum - 1;
    }

    // Check if matching a QuestionId directly
    const foundIndex = activeSteps.indexOf(currentStepParam as QuestionId);
    if (foundIndex !== -1) return foundIndex;

    return 0;
  }, [currentStepParam, activeSteps]);

  const currentStepId = activeSteps[currentStepIndex] || "purpose";
  const isReview = currentStepId === "review";
  const totalQuestions = activeSteps.length - 1; // excluding review
  const currentQuestionNumber = Math.min(currentStepIndex + 1, totalQuestions);

  // Preselection from query parameters (?purpose=business | ?purpose=education)
  useEffect(() => {
    const purposeParam = searchParams.get("purpose");
    if (purposeParam === "business" || purposeParam === "education") {
      const hasPopulatedBranch =
        Boolean(values.businessDescription) || Boolean(values.courseName);
      if (!hasPopulatedBranch && values.purpose !== purposeParam) {
        setPurposeWithBranchReset(purposeParam as PurposeType);
      }
    }
  }, [searchParams, values.businessDescription, values.courseName, values.purpose, setPurposeWithBranchReset]);

  // Focus management: move focus to question heading on question transition
  useEffect(() => {
    const heading = document.getElementById("question-heading");
    if (heading) {
      heading.focus();
    }
    // Update document title for accessibility
    if (!isReview) {
      document.title = `Question ${currentQuestionNumber} of ${totalQuestions} | SAHAYAK AI`;
    } else {
      document.title = `${guidedT.reviewTitle} | SAHAYAK AI`;
    }
  }, [currentStepId, currentQuestionNumber, totalQuestions, isReview, guidedT.reviewTitle]);

  // Step Validation Logic
  const validateCurrentQuestion = (stepId: QuestionId): { isValid: boolean; stepErrors: Record<string, string> } => {
    const stepErrors: Record<string, string> = {};

    switch (stepId) {
      case "purpose": {
        const res = Step1PurposeSchema.safeParse({ purpose: values.purpose });
        if (!res.success) {
          stepErrors.purpose = guidedT.validation.purposeRequired;
        }
        break;
      }
      case "businessStage": {
        if (!values.businessStage) {
          stepErrors.businessStage = guidedT.validation.businessStageRequired;
        }
        break;
      }
      case "businessActivity": {
        const res = Step2BusinessSchema.safeParse({
          businessDescription: values.businessDescription,
          businessCategory: values.businessCategory,
          businessStage: values.businessStage || "new",
        });
        if (!res.success) {
          res.error.issues.forEach((issue) => {
            if (issue.path[0] === "businessDescription") {
              stepErrors.businessDescription = guidedT.validation.businessDescriptionRequired;
            }
          });
        }
        break;
      }
      case "educationCourse": {
        const res = Step2EducationSchema.safeParse({
          courseName: values.courseName,
          studyLevel: values.studyLevel || "undergraduate",
          admissionStatus: values.admissionStatus || "confirmed",
          studyLocation: values.studyLocation || "india",
          institutionName: values.institutionName,
          courseDurationMonths: values.courseDurationMonths,
        });
        if (!res.success) {
          res.error.issues.forEach((issue) => {
            if (issue.path[0] === "courseName") {
              stepErrors.courseName = guidedT.validation.courseNameRequired;
            } else if (issue.path[0] === "courseDurationMonths") {
              stepErrors.courseDurationMonths = issue.message;
            }
          });
        }
        break;
      }
      case "educationLevel": {
        if (!values.studyLevel) {
          stepErrors.studyLevel = guidedT.validation.studyLevelRequired;
        }
        break;
      }
      case "educationAdmission": {
        if (!values.admissionStatus) {
          stepErrors.admissionStatus = guidedT.validation.admissionStatusRequired;
        }
        break;
      }
      case "educationLocation": {
        if (!values.studyLocation) {
          stepErrors.studyLocation = guidedT.validation.studyLocationRequired;
        }
        break;
      }
      case "cost": {
        const res = Step3CostSchema.safeParse({
          totalCost: values.totalCost,
          borrowingAmount: values.borrowingAmount,
        });
        if (!res.success) {
          res.error.issues.forEach((issue) => {
            if (issue.path[0] === "totalCost") {
              stepErrors.totalCost = guidedT.validation.costRequired;
            } else if (issue.path[0] === "borrowingAmount") {
              stepErrors.borrowingAmount = guidedT.validation.borrowingInvalid;
            }
          });
        }
        break;
      }
      case "income": {
        const res = Step4IncomeSchema.safeParse({
          annualFamilyIncome: values.annualFamilyIncome,
          communityDeclaration: values.communityDeclaration || "yes",
        });
        if (!res.success) {
          res.error.issues.forEach((issue) => {
            if (issue.path[0] === "annualFamilyIncome") {
              stepErrors.annualFamilyIncome = guidedT.validation.incomeRequired;
            }
          });
        }
        break;
      }
      case "community": {
        if (!values.communityDeclaration) {
          stepErrors.communityDeclaration = guidedT.validation.communityRequired;
        }
        break;
      }
      case "location": {
        const res = Step5LocationSchema.safeParse({
          state: values.state,
          district: values.district,
          pincode: values.pincode,
        });
        if (!res.success) {
          res.error.issues.forEach((issue) => {
            if (issue.path[0] === "state") {
              stepErrors.state = guidedT.validation.stateRequired;
            } else if (issue.path[0] === "district") {
              stepErrors.district = guidedT.validation.districtRequired;
            } else if (issue.path[0] === "pincode") {
              stepErrors.pincode = guidedT.validation.pincodeInvalid;
            }
          });
        }
        break;
      }
      case "review": {
        // Validate all preceding active questions
        for (let i = 0; i < activeSteps.length - 1; i++) {
          const subRes = validateCurrentQuestion(activeSteps[i]);
          if (!subRes.isValid) {
            Object.assign(stepErrors, subRes.stepErrors);
          }
        }
        break;
      }
    }

    return {
      isValid: Object.keys(stepErrors).length === 0,
      stepErrors,
    };
  };

  const navigateToStep = (targetStepIndex: number) => {
    setErrors({});
    const targetStepId = activeSteps[targetStepIndex];
    if (targetStepId === "review") {
      router.push("/assessment?step=review");
    } else {
      router.push(`/assessment?step=${targetStepIndex + 1}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContinue = async () => {
    // Validate current step
    const { isValid, stepErrors } = validateCurrentQuestion(currentStepId);
    if (!isValid) {
      setErrors(stepErrors);
      // Accessibility focus first error element if present
      const firstField = Object.keys(stepErrors)[0];
      const el = document.getElementById(firstField);
      if (el) el.focus();
      return;
    }

    // Step is valid, clear errors
    setErrors({});

    // If on review step, finalize profile and invoke deterministic evaluation engine
    if (isReview) {
      const profile = confirmAndFinalize();
      await evaluateAssessment(profile);
      router.push("/results");
      return;
    }

    // If returning to review after an edit, go straight to review
    if (returnToReviewParam) {
      router.push("/assessment?step=review");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Otherwise, advance to next step in sequence
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < activeSteps.length) {
      navigateToStep(nextIndex);
    }
  };

  const handleBack = () => {
    setErrors({});
    // If returning to review after edit, back button also returns to review
    if (returnToReviewParam) {
      router.push("/assessment?step=review");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      navigateToStep(prevIndex);
    } else {
      // First question Back goes to homepage
      router.push("/");
    }
  };

  const handleEditFromReview = (questionId: string) => {
    setErrors({});
    const targetIndex = activeSteps.indexOf(questionId as QuestionId);
    if (targetIndex !== -1) {
      router.push(`/assessment?step=${targetIndex + 1}&returnToReview=true`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AssessmentLayout
      stepIndicator={
        <AssessmentProgress
          currentQuestion={currentQuestionNumber}
          totalQuestions={totalQuestions}
          isReview={isReview}
        />
      }
      onResetClick={() => setIsResetOpen(true)}
      draftRestored={draftRestored}
      draftWarning={draftWarning}
      onDismissWarning={clearDraftWarning}
    >
      {/* Screen Reader Live Region for Step Transitions */}
      <div
        ref={liveAnnounceRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isReview
          ? guidedT.reviewTitle
          : guidedT.progressLabel(currentQuestionNumber, totalQuestions)}
      </div>

      {/* Main Single Question Container */}
      <div className="bg-surface border border-border rounded-xs p-5 sm:p-7 space-y-6">
        {/* Top Back Action Link */}
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-secondary hover:text-ink transition-colors focus-visible:ring-3 focus-visible:ring-focus rounded-xs p-1 -ml-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.assessment.navigation.back}</span>
          </button>
        </div>

        {/* 1. Purpose */}
        {currentStepId === "purpose" && (
          <PurposeQuestion
            value={values.purpose}
            onChange={(p) => {
              setPurposeWithBranchReset(p);
              setErrors((prev) => ({ ...prev, purpose: "" }));
            }}
            error={errors.purpose}
          />
        )}

        {/* 2. Business Stage */}
        {currentStepId === "businessStage" && (
          <BusinessStageQuestion
            value={values.businessStage}
            onChange={(s: BusinessStageType) => {
              updateValues({ businessStage: s });
              setErrors((prev) => ({ ...prev, businessStage: "" }));
            }}
            error={errors.businessStage}
          />
        )}

        {/* 3. Business Activity */}
        {currentStepId === "businessActivity" && (
          <BusinessActivityQuestion
            description={values.businessDescription}
            category={values.businessCategory}
            onChangeDescription={(val) => {
              updateValues({ businessDescription: val });
              setErrors((prev) => ({ ...prev, businessDescription: "" }));
            }}
            onChangeCategory={(val) => {
              updateValues({ businessCategory: val });
            }}
            error={errors.businessDescription}
          />
        )}

        {/* 4. Education Course */}
        {currentStepId === "educationCourse" && (
          <EducationCourseQuestion
            courseName={values.courseName}
            institutionName={values.institutionName}
            courseDurationMonths={values.courseDurationMonths}
            onChangeCourseName={(val) => {
              updateValues({ courseName: val });
              setErrors((prev) => ({ ...prev, courseName: "" }));
            }}
            onChangeInstitutionName={(val) => {
              updateValues({ institutionName: val });
            }}
            onChangeCourseDuration={(val) => {
              updateValues({ courseDurationMonths: val });
              setErrors((prev) => ({ ...prev, courseDurationMonths: "" }));
            }}
            error={errors.courseName || errors.courseDurationMonths}
          />
        )}

        {/* 5. Education Level */}
        {currentStepId === "educationLevel" && (
          <EducationLevelQuestion
            value={values.studyLevel}
            onChange={(l: EducationLevelType) => {
              updateValues({ studyLevel: l });
              setErrors((prev) => ({ ...prev, studyLevel: "" }));
            }}
            error={errors.studyLevel}
          />
        )}

        {/* 6. Education Admission Status */}
        {currentStepId === "educationAdmission" && (
          <EducationAdmissionQuestion
            value={values.admissionStatus}
            onChange={(a: AdmissionStatusType) => {
              updateValues({ admissionStatus: a });
              setErrors((prev) => ({ ...prev, admissionStatus: "" }));
            }}
            error={errors.admissionStatus}
          />
        )}

        {/* 7. Education Location */}
        {currentStepId === "educationLocation" && (
          <EducationLocationQuestion
            value={values.studyLocation}
            onChange={(l: StudyLocationType) => {
              updateValues({ studyLocation: l });
              setErrors((prev) => ({ ...prev, studyLocation: "" }));
            }}
            error={errors.studyLocation}
          />
        )}

        {/* 8. Total Cost */}
        {currentStepId === "cost" && (
          <CostQuestion
            purpose={values.purpose}
            totalCost={values.totalCost}
            borrowingAmount={values.borrowingAmount}
            onChangeTotalCost={(val) => {
              updateValues({ totalCost: val || 0 });
              setErrors((prev) => ({ ...prev, totalCost: "", borrowingAmount: "" }));
            }}
            onChangeBorrowingAmount={(val) => {
              updateValues({ borrowingAmount: val });
              setErrors((prev) => ({ ...prev, borrowingAmount: "" }));
            }}
            error={errors.totalCost}
            borrowingError={errors.borrowingAmount}
          />
        )}

        {/* 9. Income */}
        {currentStepId === "income" && (
          <IncomeQuestion
            annualFamilyIncome={values.annualFamilyIncome}
            onChangeIncome={(val) => {
              updateValues({ annualFamilyIncome: val ?? 0 });
              setErrors((prev) => ({ ...prev, annualFamilyIncome: "" }));
            }}
            error={errors.annualFamilyIncome}
          />
        )}

        {/* 10. Community Affirmation */}
        {currentStepId === "community" && (
          <CommunityQuestion
            value={values.communityDeclaration}
            onChange={(val: CommunityDeclarationType) => {
              updateValues({ communityDeclaration: val });
              setErrors((prev) => ({ ...prev, communityDeclaration: "" }));
            }}
            error={errors.communityDeclaration}
          />
        )}

        {/* 11. Location */}
        {currentStepId === "location" && (
          <LocationQuestion
            state={values.state}
            district={values.district}
            pincode={values.pincode}
            onChangeState={(val) => {
              updateValues({ state: val });
              setErrors((prev) => ({ ...prev, state: "" }));
            }}
            onChangeDistrict={(val) => {
              updateValues({ district: val });
              setErrors((prev) => ({ ...prev, district: "" }));
            }}
            onChangePincode={(val) => {
              updateValues({ pincode: val });
              setErrors((prev) => ({ ...prev, pincode: "" }));
            }}
            stateError={errors.state}
            districtError={errors.district}
            pincodeError={errors.pincode}
          />
        )}

        {/* 12. Review Screen */}
        {isReview && (
          <ReviewScreen
            values={values}
            onEditQuestion={handleEditFromReview}
            errors={errors}
          />
        )}

        {/* Action Button Footer */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="w-full sm:w-auto text-sm gap-2"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>{t.assessment.navigation.back}</span>
            </Button>
          </div>

          <div>
            <Button
              type="button"
              variant="primary"
              onClick={handleContinue}
              disabled={isEvaluating}
              className="w-full sm:w-auto text-sm gap-2 px-6"
            >
              {isEvaluating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{guidedT.evaluatingAction || "Evaluating..."}</span>
                </>
              ) : (
                <>
                  <span>
                    {isReview
                      ? guidedT.viewGuidanceAction
                      : t.assessment.navigation.continue}
                  </span>
                  {isReview ? (
                    <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Start Again Confirmation Modal */}
      <ResetConfirmationDialog
        isOpen={isResetOpen}
        title={t.assessment.resetDialog.title}
        message={t.assessment.resetDialog.message}
        confirmLabel={t.assessment.resetDialog.confirm}
        cancelLabel={t.assessment.resetDialog.cancel}
        onConfirm={() => {
          setIsResetOpen(false);
          resetAssessment();
          setErrors({});
          router.push("/assessment?step=1");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onCancel={() => setIsResetOpen(false)}
      />
    </AssessmentLayout>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-20 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-secondary font-medium">
            Loading assessment...
          </p>
        </div>
      }
    >
      <AssessmentInner />
    </Suspense>
  );
}
