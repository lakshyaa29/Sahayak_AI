"use client";

import React from "react";
import { Select, Input } from "@/components/ui/form-controls";
import { MapPin, Info } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { SAMPLE_STATES_DISTRICTS } from "@/lib/fixtures/sample-data";

interface LocationStepProps {
  state: string;
  district: string;
  pincode?: string;
  onChangeState: (val: string) => void;
  onChangeDistrict: (val: string) => void;
  onChangePincode: (val: string) => void;
  errors?: Record<string, string>;
}

export function LocationStep({
  state,
  district,
  pincode = "",
  onChangeState,
  onChangeDistrict,
  onChangePincode,
  errors = {},
}: LocationStepProps) {
  const { t } = useLanguage();
  const stepT = t.assessment.step5;

  const stateOptions = [
    { value: "", label: stepT.statePlaceholder },
    ...Object.keys(SAMPLE_STATES_DISTRICTS).map((s) => ({
      value: s,
      label: s,
    })),
  ];

  const availableDistricts = state && SAMPLE_STATES_DISTRICTS[state] ? SAMPLE_STATES_DISTRICTS[state] : [];

  const districtOptions = [
    { value: "", label: stepT.districtPlaceholder },
    ...availableDistricts.map((d) => ({
      value: d,
      label: d,
    })),
  ];

  const handleStateChange = (newState: string) => {
    onChangeState(newState);
    // When state changes, clear district if it's no longer in the selected state's list
    if (newState && SAMPLE_STATES_DISTRICTS[newState]) {
      if (!SAMPLE_STATES_DISTRICTS[newState].includes(district)) {
        onChangeDistrict("");
      }
    } else {
      onChangeDistrict("");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-2">
        <h2 id="step-heading" tabIndex={-1} className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight focus:outline-none">
          {stepT.heading}
        </h2>
        <p className="text-sm sm:text-base text-secondary leading-relaxed">
          {stepT.subheading}
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Field 1: State / UT (Required) */}
          <div>
            <Select
              id="state"
              label={stepT.stateLabel}
              value={state}
              onChange={(e) => handleStateChange(e.target.value)}
              options={stateOptions}
              error={errors.state}
              required
            />
          </div>

          {/* Field 2: District (Required, dependent or text fallback) */}
          <div>
            {availableDistricts.length > 0 ? (
              <Select
                id="district"
                label={stepT.districtLabel}
                value={district}
                onChange={(e) => onChangeDistrict(e.target.value)}
                options={districtOptions}
                error={errors.district}
                disabled={!state}
                required
                helperText={!state ? "Select a State / UT first" : undefined}
              />
            ) : (
              <Input
                id="district"
                label={stepT.districtLabel}
                value={district}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeDistrict(e.target.value)}
                placeholder={stepT.districtPlaceholder}
                error={errors.district}
                required
              />
            )}
          </div>
        </div>

        {/* Field 3: Postal Code (Optional, 6 digits) */}
        <div>
          <Input
            id="pincode"
            label={stepT.pincodeLabel}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={pincode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangePincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder={stepT.pincodePlaceholder}
            error={errors.pincode}
            helperText={stepT.helper}
          />
        </div>

        {/* Privacy Note regarding GPS and addresses */}
        <div className="bg-surface-muted p-4 rounded-card border border-border text-xs text-secondary flex items-start gap-3 leading-relaxed">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p>
            <strong>Location Usage:</strong> We only use your State and District to identify operational State Channelising Agencies (SCAs), Public Sector Banks, and Regional Rural Banks located near you. We do not request device GPS or personal street address.
          </p>
        </div>
      </div>
    </div>
  );
}
