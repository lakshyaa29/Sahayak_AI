"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  AssessmentFormValues,
  AssessmentProfile,
  DEFAULT_ASSESSMENT_VALUES,
  normalizeAssessmentProfile,
  PurposeType,
} from "@/lib/schemas/assessment";
import { SelectedPartnerData } from "@/types";


export type SchemeEligibilityStatus = "POTENTIALLY_ELIGIBLE" | "INELIGIBLE" | "NEEDS_INFORMATION";

export interface PolicySourceMeta {
  title: string;
  document_ref: string;
  clause: string;
  official_url: string;
  publication_date?: string;
  effective_date: string;
  source_checked_date: string;
  verification_status: "VERIFIED" | "DEMONSTRATION";
  notes?: string;
}

export interface EvaluatedCondition {
  rule_id: string;
  field: string;
  operator: string;
  expected: any;
  actual: any;
  outcome: "PASS" | "FAIL" | "UNKNOWN";
  source_clause: string;
  reason_en: string;
  reason_hi: string;
}

export interface SchemeEvaluationOutcome {
  scheme_id: string;
  code: string;
  name_en: string;
  name_hi: string;
  provider_en: string;
  provider_hi: string;
  purpose: string;
  status: SchemeEligibilityStatus;
  is_demonstration: boolean;
  version_id: string;
  passed_conditions: EvaluatedCondition[];
  failed_conditions: EvaluatedCondition[];
  unknown_conditions: EvaluatedCondition[];
  missing_information: string[];
  max_eligible_loan: number;
  min_promoter_contribution_amount: number;
  indicative_interest_rate: string;
  indicative_moratorium: string;
  indicative_tenure_years: number;
  source_meta: PolicySourceMeta;
  match_reasons_en: string[];
  match_reasons_hi: string[];
  ranking_score: number;
  ranking_explanation: string;
}

export interface EvaluationResult {
  evaluation_id: string;
  evaluated_at: string;
  engine_version: string;
  ranking_policy_version: string;
  disclaimer_en: string;
  disclaimer_hi: string;
  primary_scheme: SchemeEvaluationOutcome | null;
  alternative_schemes: SchemeEvaluationOutcome[];
  needs_information_schemes: SchemeEvaluationOutcome[];
  ineligible_schemes: SchemeEvaluationOutcome[];
  total_schemes_evaluated: number;
  assessed_purpose: string;
  assessed_outlay: number;
  assessed_income: number;
}

interface AssessmentContextType {
  values: AssessmentFormValues;
  step: number;
  isLoaded: boolean;
  isCompleted: boolean;
  confirmedProfile: AssessmentProfile | null;
  draftRestored: boolean;
  draftWarning: string | null;
  evaluationResult: EvaluationResult | null;
  selectedPartner: SelectedPartnerData | null;
  isEvaluating: boolean;
  evaluationError: string | null;
  setStep: (step: number) => void;
  updateValues: (newValues: Partial<AssessmentFormValues>) => void;
  setPurposeWithBranchReset: (purpose: PurposeType) => void;
  confirmAndFinalize: () => AssessmentProfile;
  evaluateAssessment: (profileOverride?: AssessmentProfile) => Promise<EvaluationResult | null>;
  setSelectedPartner: (partner: SelectedPartnerData | null) => void;
  clearSelectedPartner: () => void;
  resetAssessment: () => void;
  clearDraftWarning: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

const STORAGE_KEY = "sahayak_assessment_draft_v2";
const CURRENT_SCHEMA_VERSION = 2;

interface StoredDraftData {
  schemaVersion: number;
  savedAt: string;
  step: number;
  isCompleted: boolean;
  values: AssessmentFormValues;
  confirmedProfile?: AssessmentProfile | null;
  evaluationResult?: EvaluationResult | null;
  selectedPartner?: SelectedPartnerData | null;
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<AssessmentFormValues>(DEFAULT_ASSESSMENT_VALUES);
  const [step, setStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [confirmedProfile, setConfirmedProfile] = useState<AssessmentProfile | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [selectedPartner, setSelectedPartnerState] = useState<SelectedPartnerData | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [draftWarning, setDraftWarning] = useState<string | null>(null);

  // Restore draft on mount from sessionStorage
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredDraftData = JSON.parse(raw);
        if (parsed && parsed.schemaVersion === CURRENT_SCHEMA_VERSION && parsed.values) {
          setValues({
            ...DEFAULT_ASSESSMENT_VALUES,
            ...parsed.values,
          });
          if (typeof parsed.step === "number" && parsed.step >= 1 && parsed.step <= 6) {
            setStep(parsed.step);
          }
          if (parsed.isCompleted && parsed.confirmedProfile) {
            setIsCompleted(true);
            setConfirmedProfile(parsed.confirmedProfile);
          }
          if (parsed.evaluationResult) {
            setEvaluationResult(parsed.evaluationResult);
          }
          if (parsed.selectedPartner) {
            setSelectedPartnerState(parsed.selectedPartner);
          }
          setDraftRestored(true);
        } else {
          setDraftWarning(
            "An earlier draft version was detected and safely cleared to maintain compatibility with updated criteria."
          );
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      setDraftWarning("Could not restore previous draft session. Starting a fresh assessment.");
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save draft continuously to sessionStorage once loaded
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    try {
      const payload: StoredDraftData = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        savedAt: new Date().toISOString(),
        step,
        isCompleted,
        values,
        confirmedProfile,
        evaluationResult,
        selectedPartner,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore private-mode storage quota errors
    }
  }, [values, step, isCompleted, confirmedProfile, evaluationResult, selectedPartner, isLoaded]);

  const updateValues = useCallback((newValues: Partial<AssessmentFormValues>) => {
    setValues((prev) => {
      const updated = { ...prev, ...newValues };
      if (newValues.totalCost !== undefined) {
        updated.totalCost = newValues.totalCost;
        updated.projectCost = newValues.totalCost;
      } else if (newValues.projectCost !== undefined) {
        updated.totalCost = newValues.projectCost;
        updated.projectCost = newValues.projectCost;
      }
      // If location changed, clear previous partner selection
      if (newValues.state !== undefined || newValues.district !== undefined) {
        setSelectedPartnerState(null);
      }
      return updated;
    });
  }, []);

  const setPurposeWithBranchReset = useCallback((newPurpose: PurposeType) => {
    setValues((prev) => {
      if (prev.purpose === newPurpose) return prev;

      return {
        ...prev,
        purpose: newPurpose,
        businessDescription: "",
        businessCategory: "",
        businessStage: "new",
        courseName: "",
        studyLevel: "undergraduate",
        admissionStatus: "confirmed",
        studyLocation: "india",
        institutionName: "",
        courseDurationMonths: undefined,
        totalCost: newPurpose === "business" ? 120000 : 250000,
        borrowingAmount: undefined,
      };
    });
  }, []);

  const confirmAndFinalize = useCallback((): AssessmentProfile => {
    const profile = normalizeAssessmentProfile(values, CURRENT_SCHEMA_VERSION);
    setConfirmedProfile(profile);
    setIsCompleted(true);
    return profile;
  }, [values]);

  const evaluateAssessment = useCallback(
    async (profileOverride?: AssessmentProfile): Promise<EvaluationResult | null> => {
      const targetProfile = profileOverride || confirmedProfile || normalizeAssessmentProfile(values, CURRENT_SCHEMA_VERSION);
      setIsEvaluating(true);
      setEvaluationError(null);

      try {
        const res = await fetch("/api/v1/assessments/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(targetProfile),
        });

        if (!res.ok) {
          throw new Error(`Evaluation engine returned HTTP ${res.status}`);
        }

        const data: EvaluationResult = await res.json();
        setEvaluationResult(data);
        return data;
      } catch (err: any) {
        const msg = err?.message || "Failed to reach the evaluation engine.";
        setEvaluationError(msg);
        return null;
      } finally {
        setIsEvaluating(false);
      }
    },
    [confirmedProfile, values]
  );

  const resetAssessment = useCallback(() => {
    setValues(DEFAULT_ASSESSMENT_VALUES);
    setStep(1);
    setIsCompleted(false);
    setConfirmedProfile(null);
    setEvaluationResult(null);
    setIsEvaluating(false);
    setEvaluationError(null);
    setDraftRestored(false);
    setDraftWarning(null);
    setSelectedPartnerState(null);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const setSelectedPartner = useCallback((partner: SelectedPartnerData | null) => {
    setSelectedPartnerState(partner);
  }, []);

  const clearSelectedPartner = useCallback(() => {
    setSelectedPartnerState(null);
  }, []);

  const clearDraftWarning = useCallback(() => {
    setDraftWarning(null);
  }, []);

  return (
    <AssessmentContext.Provider
      value={{
        values,
        step,
        isLoaded,
        isCompleted,
        confirmedProfile,
        draftRestored,
        draftWarning,
        evaluationResult,
        selectedPartner,
        isEvaluating,
        evaluationError,
        setStep,
        updateValues,
        setPurposeWithBranchReset,
        confirmAndFinalize,
        evaluateAssessment,
        setSelectedPartner,
        clearSelectedPartner,
        resetAssessment,
        clearDraftWarning,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return ctx;
}
