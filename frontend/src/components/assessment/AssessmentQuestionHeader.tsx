"use client";

import React from "react";

interface AssessmentQuestionHeaderProps {
  heading: string;
  guidance?: string;
  className?: string;
}

export function AssessmentQuestionHeader({
  heading,
  guidance,
  className = "",
}: AssessmentQuestionHeaderProps) {
  return (
    <div className={`space-y-2 focus:outline-hidden ${className}`}>
      <h1
        id="question-heading"
        tabIndex={-1}
        className="text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-snug focus:outline-hidden"
      >
        {heading}
      </h1>
      {guidance && (
        <p className="text-sm sm:text-base text-secondary leading-relaxed">
          {guidance}
        </p>
      )}
    </div>
  );
}
