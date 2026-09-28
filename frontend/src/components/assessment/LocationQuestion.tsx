"use client";

import React from "react";
import { useLanguage } from "@/lib/language-context";
import { Select, Input } from "@/components/ui/form-controls";
import { SAMPLE_STATES_DISTRICTS } from "@/lib/fixtures/sample-data";
import { AssessmentQuestionHeader } from "./AssessmentQuestionHeader";
import { WhyWeAsk } from "./WhyWeAsk";

interface LocationQuestionProps {
  state: string;
  district: string;
  pincode?: string;
  onChangeState: (val: string) => void;
  onChangeDistrict: (val: string) => void;
  onChangePincode: (val: string) => void;
  stateError?: string;
  districtError?: string;
  pincodeError?: string;
}

export function LocationQuestion({
  state,
  district,
  pincode = "",
  onChangeState,
  onChangeDistrict,
  onChangePincode,
  stateError,
  districtError,
  pincodeError,
}: LocationQuestionProps) {
  const { t } = useLanguage();
  const qT = t.assessment.guided.questions.location;

  const stateOptions = [
    { value: "", label: qT.statePlaceholder },
    ...Object.keys(SAMPLE_STATES_DISTRICTS).map((s) => ({
      value: s,
      label: s,
    })),
  ];

  const availableDistricts =
    state && SAMPLE_STATES_DISTRICTS[state] ? SAMPLE_STATES_DISTRICTS[state] : [];

  const districtOptions = [
    { value: "", label: qT.districtPlaceholder },
    ...availableDistricts.map((d) => ({
      value: d,
      label: d,
    })),
  ];

  const handleStateChange = (newState: string) => {
    onChangeState(newState);
    if (newState && SAMPLE_STATES_DISTRICTS[newState]) {
      if (!SAMPLE_STATES_DISTRICTS[newState].includes(district)) {
        onChangeDistrict("");
      }
    } else {
      onChangeDistrict("");
    }
  };

  return (
    <div className="space-y-6">
      <AssessmentQuestionHeader
        heading={qT.heading}
        guidance={qT.guidance}
      />

      <div className="space-y-4">
        <div>
          <Select
            id="state"
            label={qT.stateLabel}
            value={state}
            onChange={(e) => handleStateChange(e.target.value)}
            options={stateOptions}
            error={stateError}
            required
            aria-required="true"
          />
        </div>

        <div>
          {availableDistricts.length > 0 ? (
            <Select
              id="district"
              label={qT.districtLabel}
              value={district}
              onChange={(e) => onChangeDistrict(e.target.value)}
              options={districtOptions}
              error={districtError}
              disabled={!state}
              required
              aria-required="true"
              helperText={!state ? "Select a State or UT first" : undefined}
            />
          ) : (
            <Input
              id="district"
              label={qT.districtLabel}
              value={district}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeDistrict(e.target.value)}
              placeholder={qT.districtPlaceholder}
              error={districtError}
              required
              aria-required="true"
            />
          )}
        </div>

        <div>
          <Input
            id="pincode"
            label={qT.pincodeLabel}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={pincode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangePincode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder={qT.pincodePlaceholder}
            error={pincodeError}
          />
        </div>
      </div>

      <div className="text-xs text-secondary bg-surface-muted/30 border border-border rounded-xs p-3 leading-relaxed">
        {qT.privacyNotice}
      </div>

      <WhyWeAsk explanation={qT.whyWeAsk} />
    </div>
  );
}
