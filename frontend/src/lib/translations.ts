export type Language = "en" | "hi";

export interface AssessmentTranslations {
  steps: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    step6: string;
  };
  header: {
    badge: string;
    startAgain: string;
    draftSaved: string;
    draftRestored: string;
  };
  resetDialog: {
    title: string;
    message: string;
    confirm: string;
    cancel: string;
  };
  navigation: {
    back: string;
    continue: string;
    confirm: string;
    stepCounter: string;
  };
  step1: {
    heading: string;
    subheading: string;
    businessTitle: string;
    businessDesc: string;
    educationTitle: string;
    educationDesc: string;
    helpText: string;
  };
  step2Business: {
    heading: string;
    subheading: string;
    descLabel: string;
    descPlaceholder: string;
    categoryLabel: string;
    categoryPlaceholder: string;
    categories: {
      agriculture_allied: string;
      manufacturing: string;
      retail_services: string;
      transport: string;
      other: string;
    };
    stageLabel: string;
    stages: {
      new: string;
      expanding: string;
    };
    notice: string;
  };
  step2Education: {
    heading: string;
    subheading: string;
    courseLabel: string;
    coursePlaceholder: string;
    levelLabel: string;
    levels: {
      diploma: string;
      undergraduate: string;
      postgraduate: string;
      doctoral: string;
      other: string;
    };
    admissionLabel: string;
    admissions: {
      confirmed: string;
      applied_awaiting: string;
      exploring: string;
    };
    locationLabel: string;
    locations: {
      india: string;
      outside_india: string;
      not_decided: string;
    };
    institutionLabel: string;
    institutionPlaceholder: string;
    durationLabel: string;
    durationPlaceholder: string;
    notice: string;
  };
  step3: {
    businessHeading: string;
    educationHeading: string;
    costLabel: string;
    costHelper: string;
    borrowingLabel: string;
    borrowingHelper: string;
  };
  step4: {
    heading: string;
    subheading: string;
    incomeLabel: string;
    incomeHelper: string;
    communityLabel: string;
    communityHelper: string;
    communityOptions: {
      yes: string;
      no: string;
      unsure: string;
      prefer_not_to_say: string;
    };
    draftNotice: string;
  };
  step5: {
    heading: string;
    subheading: string;
    stateLabel: string;
    statePlaceholder: string;
    districtLabel: string;
    districtPlaceholder: string;
    pincodeLabel: string;
    pincodePlaceholder: string;
    helper: string;
  };
  step6: {
    heading: string;
    subheading: string;
    group1Title: string;
    group2Title: string;
    group3Title: string;
    group4Title: string;
    editBtn: string;
    notProvided: string;
    confirmBtn: string;
    preliminaryNotice: string;
  };
  guided: {
    progressLabel: (current: number, total: number) => string;
    progressAriaLabel: (current: number, total: number) => string;
    viewGuidanceAction: string;
    evaluatingAction: string;
    changeAction: string;
    reviewTitle: string;
    reviewSubtitle: string;
    reviewNotice: string;
    whyWeAskTitle: string;
    chooseOption: string;
    quickSelect: string;
    questions: {
      purpose: {
        heading: string;
        guidance: string;
        whyWeAsk: string;
        businessLabel: string;
        businessDesc: string;
        educationLabel: string;
        educationDesc: string;
      };
      businessStage: {
        heading: string;
        guidance: string;
        whyWeAsk: string;
        newLabel: string;
        newDesc: string;
        expandingLabel: string;
        expandingDesc: string;
      };
      businessActivity: {
        heading: string;
        guidance: string;
        whyWeAsk: string;
        descLabel: string;
        descPlaceholder: string;
        categoryLabel: string;
        categoryPlaceholder: string;
      };
      educationCourse: {
        heading: string;
        guidance: string;
        whyWeAsk: string;
        courseLabel: string;
        coursePlaceholder: string;
        institutionLabel: string;
        institutionPlaceholder: string;
        durationLabel: string;
        durationPlaceholder: string;
      };
      educationLevel: {
        heading: string;
        guidance: string;
        whyWeAsk: string;
      };
      educationAdmission: {
        heading: string;
        guidance: string;
        whyWeAsk: string;
      };
      educationLocation: {
        heading: string;
        guidance: string;
        whyWeAsk: string;
      };
      cost: {
        businessHeading: string;
        educationHeading: string;
        guidance: string;
        whyWeAsk: string;
        amountLabel: string;
        borrowingLabel: string;
        borrowingPlaceholder: string;
        borrowingHelp: string;
        borrowingErrorExceeded: string;
      };
      income: {
        heading: string;
        guidance: string;
        whyWeAsk: string;
        amountLabel: string;
        zeroIncomeNote: string;
      };
      community: {
        heading: string;
        guidance: string;
        whyWeAsk: string;
        privacyNotice: string;
        options: {
          yes: string;
          no: string;
          unsure: string;
          prefer_not_to_say: string;
        };
      };
      location: {
        heading: string;
        guidance: string;
        whyWeAsk: string;
        stateLabel: string;
        statePlaceholder: string;
        districtLabel: string;
        districtPlaceholder: string;
        pincodeLabel: string;
        pincodePlaceholder: string;
        privacyNotice: string;
      };
    };
    validation: {
      purposeRequired: string;
      businessStageRequired: string;
      businessDescriptionRequired: string;
      courseNameRequired: string;
      studyLevelRequired: string;
      admissionStatusRequired: string;
      studyLocationRequired: string;
      costRequired: string;
      borrowingInvalid: string;
      incomeRequired: string;
      communityRequired: string;
      stateRequired: string;
      districtRequired: string;
      pincodeInvalid: string;
    };
  };
}

export interface ResultsTranslations {
  badge: string;
  heading: string;
  subheading: string;
  evaluatingText: string;
  editAnswersBtn: string;
  startNewBtn: string;
  topPickBadge: string;
  officialVerifiedBadge: string;
  demonstrationBadge: string;
  providerLabel: string;
  estimatedAssistance: string;
  maxLoanLabel: string;
  promoterContributionLabel: string;
  interestRateLabel: string;
  moratoriumLabel: string;
  tenureLabel: string;
  yearsSuffix: string;
  viewCalculationCta: string;
  findPartnerCta: string;
  assessmentDisclosureTitle: string;
  assessmentDisclosureSub: string;
  passedRulesTitle: string;
  failedRulesTitle: string;
  unknownRulesTitle: string;
  clauseRefLabel: string;
  sourcesTitle: string;
  documentRef: string;
  officialUrl: string;
  effectiveDate: string;
  sourceCheckedDate: string;
  verificationStatus: string;
  openOfficialDoc: string;
  alternativesTitle: string;
  alternativesSub: string;
  needsInfoTitle: string;
  needsInfoSub: string;
  ineligibleTitle: string;
  ineligibleSub: string;
  whyNotLabel: string;
  missingRequirements: string;
  noMatchTitle: string;
  noMatchDesc: string;
  noMatchAction1: string;
  noMatchAction2: string;
  incompleteTitle: string;
  incompleteDesc: string;
  takeAssessmentBtn: string;
  disclaimerBadge: string;
  footerDisclaimer: string;
  engineTraceBadge: string;
  evaluatedOn: string;

  // Explainable Financial Statement & Decision Redesign Keys
  preliminaryStatusLabel: string;
  preliminaryDisclaimer: string;
  singleMatchHeading: string;
  singleMatchSub: string;
  multipleMatchHeading: string;
  multipleMatchSub: string;
  noMatchHeading: string;
  noMatchSub: string;
  needsInfoHeading: string;
  needsInfoSubNew: string;
  errorHeading: string;
  errorSub: string;
  retryBtn: string;
  whyMatchedTitle: string;
  whyMatchedNotice: string;
  userAnswerLabel: string;
  criterionLabel: string;
  comparisonResultLabel: string;
  statusMatched: string;
  statusNeedsVerification: string;
  statusNotAssessed: string;
  financialStatementTitle: string;
  financialStatementSub: string;
  projectCostLabel: string;
  estimatedLoanLabel: string;
  applicantContributionLabel: string;
  totalLabel: string;
  financingShareLabel: string;
  applicantShareLabel: string;
  calculationFormulaTitle: string;
  loanFormulaLabel: string;
  contributionFormulaLabel: string;
  schemeCapNoticePrefix: string;
  schemeCapNoticeSuffix: string;
  repaymentTitle: string;
  repaymentSub: string;
  interestRateType: string;
  repaymentTermLabel: string;
  repaymentFrequencyLabel: string;
  monthlyFrequency: string;
  moratoriumGraceLabel: string;
  moratoriumNote: string;
  estimatedMonthlyInstalmentLabel: string;
  estimatedTotalRepaymentLabel: string;
  estimatedTotalInterestLabel: string;
  repaymentDisclaimer: string;
  calculationUnavailableHeading: string;
  calculationUnavailableNotice: string;
  assumptionsTitle: string;
  informationSourceTitle: string;
  sourceAuthorityLabel: string;
  sourceDocumentLabel: string;
  effectiveDateLabel: string;
  lastReviewedLabel: string;
  sourceNotice: string;
  sourceUnavailableNotice: string;
  demoNotice: string;
  documentsTitle: string;
  documentsSub: string;
  docCategoryIdentity: string;
  docCategoryBusiness: string;
  docCategoryEducation: string;
  docStatusRequired: string;
  docStatusRequested: string;
  documentsDisclaimer: string;
  primaryNextActionTitle: string;
  primaryNextActionSub: string;
  secondaryReviewAnswers: string;
  secondaryEstimateDifferent: string;
  secondaryPrint: string;
  secondaryStartAgain: string;
  multipleMatchesCompareTitle: string;
  rankingSelectionExplanation: string;
  compareColumnScheme: string;
  compareColumnMaxLoan: string;
  compareColumnInterest: string;
  compareColumnTenure: string;
  compareColumnPurpose: string;
}


export interface CalculatorTranslations {
  pageTitle: string;
  pageDescription: string;
  badge: string;
  estimatedNotApproved: string;
  verifiedPolicy: string;
  demonstrationMode: string;
  changeScheme: string;
  returnToResults: string;
  editAssessment: string;
  findPartnersCta: string;
  inputsTitle: string;
  inputsSub: string;
  schemeSelectLabel: string;
  projectCostLabel: string;
  projectCostHelp: string;
  requestedLoanLabel: string;
  requestedLoanHelp: string;
  tenureLabel: string;
  tenureHelp: string;
  moratoriumLabel: string;
  moratoriumHelp: string;
  frequencyLabel: string;
  methodLabel: string;
  treatmentLabel: string;
  equalInstalmentOption: string;
  equalPrincipalOption: string;
  monthlyOption: string;
  quarterlyOption: string;
  treatmentCapitalize: string;
  treatmentInterestOnly: string;
  treatmentAccrueSimple: string;
  treatmentNone: string;
  resetDefaults: string;
  recalculating: string;
  outOfDateBanner: string;
  summaryTitle: string;
  summarySub: string;
  eligibleLoan: string;
  promoterEquity: string;
  fundingGap: string;
  indicativeInstalment: string;
  monthlyInstalment: string;
  quarterlyInstalment: string;
  firstInstalmentNote: string;
  finalInstalmentNote: string;
  annualInterestRate: string;
  totalLoanRepayment: string;
  totalInterest: string;
  splitBarTitle: string;
  splitBarLoan: string;
  splitBarEquity: string;
  splitBarOther: string;
  timelineTitle: string;
  timelineGracePhase: string;
  timelineRepayPhase: string;
  scheduleTitle: string;
  scheduleSub: string;
  colPeriod: string;
  colOpening: string;
  colPayment: string;
  colPrincipal: string;
  colInterest: string;
  colClosing: string;
  moratoriumTag: string;
  repaymentTag: string;
  downloadCsv: string;
  printSchedule: string;
  expandSchedule: string;
  collapseSchedule: string;
  showingFirst: string;
  assumptionsTitle: string;
  assumptionsSub: string;
  exclusionsTitle: string;
  sourcesTitle: string;
  parameterOriginsTitle: string;
  preliminaryNotice: string;
  noSchemeTitle: string;
  noSchemeDesc: string;
  takeAssessmentBtn: string;
  exploreSchemesBtn: string;
  errorTitle: string;
  retryBtn: string;
  clampedWarningTitle: string;
  clampedWarningDesc: string;
}

export interface PartnersTranslations {
  pageTitle: string;
  pageDescription: string;
  badge: string;
  routingNoticeTitle: string;
  routingNoticeDesc: string;
  selectedSchemeLabel: string;
  locationLabel: string;
  changeLocationBtn: string;
  searchRadiusLabel: string;
  radiusKm: string;
  filterAll: string;
  filterSca: string;
  filterPsb: string;
  filterRrb: string;
  filterEligible: string;
  searchPlaceholder: string;
  resultsCount: string;
  topRecommendedBadge: string;
  eligibleBadge: string;
  unverifiedBadge: string;
  whyThisPartnerTitle: string;
  approxDistance: string;
  observedDate: string;
  callAction: string;
  callDisabled: string;
  directionsAction: string;
  directionsDisabled: string;
  choosePartnerAction: string;
  chosenPartnerBadge: string;
  mapTab: string;
  listTab: string;
  mapViewTitle: string;
  mapDisclaimer: string;
  mapUnavailableTitle: string;
  mapUnavailableDesc: string;
  unverifiedSectionTitle: string;
  unverifiedSectionSub: string;
  noPartnersTitle: string;
  noPartnersDesc: string;
  expandRadiusAction: string;
  noSchemeNoticeTitle: string;
  noSchemeNoticeDesc: string;
  takeAssessmentBtn: string;
  disclaimerText: string;
  continueToNextSteps: string;
  backToCalculator: string;
}

export interface HomeTranslations {
  descriptor: string;
  protoBadge: string;
  heading: string;
  supportingText: string;
  preliminaryNotice: string;
  journeys: {
    journey1: {
      number: string;
      title: string;
      description: string;
      action: string;
    };
    journey2: {
      number: string;
      title: string;
      description: string;
      action: string;
    };
    journey3: {
      number: string;
      title: string;
      description: string;
      action: string;
    };
  };
  howItHelps: {
    heading: string;
    step1Num: string;
    step1Title: string;
    step1Desc: string;
    step2Num: string;
    step2Title: string;
    step2Desc: string;
    step3Num: string;
    step3Title: string;
    step3Desc: string;
  };
}

export interface NextStepsTranslations {
  pageTitle: string;
  pageSubtitle: string;
  badge: string;
  printSummary: string;
  editAnswers: string;
  guidanceSummaryTitle: string;
  generatedOn: string;
  beneficiaryCategory: string;
  declaredSC: string;
  requirementPurpose: string;
  estimatedOutlay: string;
  familyIncome: string;
  recommendedScheme: string;
  selectedPartner: string;
  changePartner: string;
  selectPartner: string;
  noPartnerSelected: string;
  checklistTitle: string;
  checklistSubtitle: string;
  preparedBadge: string;
  verificationNoticeTitle: string;
  verificationNoticeDesc: string;
  handoffTitle: string;
  handoffIntro: string;
  handoffStep1: string;
  handoffStep2: string;
  handoffStep3: string;
  returnToPartners: string;
  returnToResults: string;
  demoNotice: string;
  emptyStateTitle: string;
  emptyStateDesc: string;
  startAssessmentBtn: string;
}

export interface TranslationDictionary {
  nav: {
    home: string;
    howItWorks: string;
    whoItHelps: string;
    faqs: string;
    findMyScheme: string;
    checkEligibility: string;
    calculator: string;
    partners: string;
    nextSteps: string;
    language: string;
    menuOpen: string;
    menuClose: string;
  };
  home: HomeTranslations;
  hero: {
    eyebrow: string;
    heading: string;
    headingHighlight: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    supportingText: string;
    guidanceNoticeTitle: string;
    guidanceNoticeText: string;
    protoBadge: string;
  };
  visual: {
    badge: string;
    step1Title: string;
    step1Sub: string;
    step2Title: string;
    step2Sub: string;
    step3Title: string;
    step3Sub: string;
    illustrativeNotice: string;
  };
  pathways: {
    badge: string;
    heading: string;
    subheading: string;
    businessTitle: string;
    businessDesc: string;
    businessAction: string;
    educationTitle: string;
    educationDesc: string;
    educationAction: string;
  };
  threeSteps: {
    badge: string;
    heading: string;
    subheading: string;
    protoNotice: string;
    step1Num: string;
    step1Title: string;
    step1Desc: string;
    step2Num: string;
    step2Title: string;
    step2Desc: string;
    step3Num: string;
    step3Title: string;
    step3Desc: string;
  };
  trust: {
    badge: string;
    heading: string;
    subheading: string;
    coreStatement: string;
    principle1Title: string;
    principle1Desc: string;
    principle2Title: string;
    principle2Desc: string;
    principle3Title: string;
    principle3Desc: string;
  };
  faq: {
    badge: string;
    heading: string;
    subheading: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
  };
  finalCta: {
    heading: string;
    subheading: string;
    button: string;
    hindiAssessmentNotice?: string;
  };
  footer: {
    description: string;
    sihBadge: string;
    sectionsTitle: string;
    channelNetworkTitle: string;
    networkDesc: string;
    disclaimerTitle: string;
    disclaimerText: string;
    copyright: string;
  };
  assessment: AssessmentTranslations;
  results: ResultsTranslations;
  calculator: CalculatorTranslations;
  partners: PartnersTranslations;
  nextSteps: NextStepsTranslations;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      home: "Home",
      howItWorks: "How it works",
      whoItHelps: "Who it helps",
      faqs: "FAQs",
      findMyScheme: "Find my scheme",
      checkEligibility: "Check eligibility",
      calculator: "Calculator",
      partners: "Channel Partners",
      nextSteps: "Next Steps",
      language: "Language",
      menuOpen: "Open navigation menu",
      menuClose: "Close navigation menu",
    },
    home: {
      descriptor: "Scheme and concessional finance guidance",
      protoBadge: "Prototype · Sample Data",
      heading: "Find the right financial support",
      supportingText: "Check suitable schemes, estimate repayment, or find an authorized lending partner.",
      preliminaryNotice: "SAHAYAK AI provides preliminary guidance only. Final eligibility, verification and loan approval are decided by authorized lending institutions.",
      journeys: {
        journey1: {
          number: "01",
          title: "Check scheme eligibility",
          description: "Answer a few questions to see which business or education schemes may match your needs.",
          action: "Check eligibility",
        },
        journey2: {
          number: "02",
          title: "Estimate repayment",
          description: "See an estimated loan amount, applicant contribution and monthly repayment.",
          action: "Open calculator",
        },
        journey3: {
          number: "03",
          title: "Find a Channel Partner",
          description: "Find an authorized institution that can guide you through the application process.",
          action: "Find a partner",
        },
      },
      howItHelps: {
        heading: "How this service helps",
        step1Num: "1",
        step1Title: "Tell us what you need",
        step1Desc: "Share basic details about your planned business or course and approximate funding requirement.",
        step2Num: "2",
        step2Title: "Review the estimate and reasoning",
        step2Desc: "Inspect the eligible concessional schemes, interest rates, and required promoter margin.",
        step3Num: "3",
        step3Title: "Approach an authorized lending partner",
        step3Desc: "Take your scheme summary and checklist directly to an accredited branch for application.",
      },
    },
    hero: {
      eyebrow: "Guidance for business and education finance",
      heading: "Find the right support for your next step.",
      headingHighlight: "next step",
      description:
        "Explore government loan schemes, understand estimated repayment, and find an authorized Channel Partner to approach.",
      primaryCta: "Find my scheme",
      secondaryCta: "How it works",
      supportingText:
        "For eligible Scheduled Caste beneficiaries seeking support for business or education.",
      guidanceNoticeTitle: "Preliminary Guidance Notice",
      guidanceNoticeText:
        "Recommendations are preliminary guidance. Final eligibility and loan approval are decided through the authorized lending process.",
      protoBadge: "Prototype · Sample Data Mode",
    },
    visual: {
      badge: "Journey Preview",
      step1Title: "Explore suitable schemes",
      step1Sub: "Deterministic criteria match based on outlay and purpose.",
      step2Title: "Understand your repayment",
      step2Sub: "Clear 90% loan vs 10% promoter equity breakdown.",
      step3Title: "Find a Channel Partner",
      step3Sub: "Operational branch routing with verified low NPAs.",
      illustrativeNotice: "Illustrative preview",
    },
    pathways: {
      badge: "Focus Areas",
      heading: "What do you need support for?",
      subheading:
        "Choose the pathway that matches your goal. You can complete the full assessment in under 3 minutes.",
      businessTitle: "Start or grow a business",
      businessDesc:
        "Explore financing options for a small enterprise, equipment, or another supported income-generating activity.",
      businessAction: "Explore business support",
      educationTitle: "Continue your education",
      educationDesc:
        "Explore loan options for supported professional or technical education in India or abroad.",
      educationAction: "Explore education support",
    },
    threeSteps: {
      badge: "Three-Step Guide",
      heading: "From questions to a clear next step",
      subheading:
        "Our structured process helps you avoid offline confusion and unnecessary branch visits.",
      protoNotice:
        "Demonstration Mode: The prototype currently evaluates parameters using standard NSFDC public circular guidelines.",
      step1Num: "01",
      step1Title: "Tell us what you need",
      step1Desc:
        "Answer a few simple questions about your goal, estimated cost, and family income.",
      step2Num: "02",
      step2Title: "Understand your options",
      step2Desc:
        "See a suitable scheme recommendation and an explanation of estimated financing and repayment.",
      step3Num: "03",
      step3Title: "Know where to go",
      step3Desc:
        "Find an appropriate Channel Partner and prepare for the next stage.",
    },
    trust: {
      badge: "Our Principles",
      heading: "Clear answers, with reasons you can understand",
      subheading:
        "Built on transparency, explainability, and citizen-friendly financial education.",
      coreStatement:
        "SAHAYAK AI helps you prepare. It does not sanction or disburse loans.",
      principle1Title: "Explainable Scheme Matches",
      principle1Desc:
        "Recommendations always state why a scheme fits your outlay and criteria, rather than displaying an unexplained black-box score.",
      principle2Title: "Transparent Calculations",
      principle2Desc:
        "Financial estimates show explicit assumptions — including interest rates, grace moratorium periods, and required promoter equity.",
      principle3Title: "Audited Partner Data",
      principle3Desc:
        "Channel Partner branch recommendations make their source, operational quota, and data freshness clear before you travel.",
    },
    faq: {
      badge: "Frequently Asked Questions",
      heading: "Common questions about SAHAYAK AI",
      subheading:
        "Everything you need to know about preliminary guidance, data privacy, and the lending process.",
      q1: "Does SAHAYAK AI approve loans?",
      a1: "No. It provides preliminary guidance. Authorized institutions handle document verification, lending decisions, and disbursement.",
      q2: "What information will I need?",
      a2: "Start with your purpose, estimated project or education cost, annual family income, and location. Additional questions may depend on the scheme.",
      q3: "Can I explore both business and education options?",
      a3: "Yes. Choose the purpose that matches your current requirement when you begin the assessment.",
      q4: "Is the information on this prototype live?",
      a4: "This prototype may use sample scheme results and fictional partner records. Demonstration information is labeled and should not be treated as a verified lending offer.",
    },
    finalCta: {
      heading: "Start with a few simple questions.",
      subheading: "Tell us what you need and explore your next step.",
      button: "Find my scheme",
      hindiAssessmentNotice: undefined,
    },
    footer: {
      description:
        "AI-driven scheme matching, scheme-aware financial calculation, and operationally eligible Channel Partner routing for Scheduled Caste entrepreneurs and students.",
      sihBadge: "Smart India Hackathon 2026 · Problem SIH26092",
      sectionsTitle: "Platform Navigation",
      channelNetworkTitle: "Authorized Lending Network",
      networkDesc:
        "Concessional credit is disbursed through accredited State Channelizing Agencies (SCAs), Public Sector Banks, and Regional Rural Banks.",
      disclaimerTitle: "Preliminary Decision Support Disclaimer",
      disclaimerText:
        "SAHAYAK AI is a decision-support prototype. It does not sanction loans or issue official certificates. Final appraisal, sanction, and disbursement are governed exclusively by authorized Channel Partner institutions.",
      copyright: "SAHAYAK AI Project. Built for SIH26092.",
    },
    assessment: {
      steps: {
        step1: "Purpose",
        step2: "Details",
        step3: "Cost",
        step4: "Income & Eligibility",
        step5: "Location",
        step6: "Review",
      },
      header: {
        badge: "Eligibility Assessment",
        startAgain: "Start again",
        draftSaved: "Draft saved in browser session",
        draftRestored: "Restored previous draft session",
      },
      resetDialog: {
        title: "Start assessment again?",
        message:
          "This will clear all currently entered answers in this browser session. You will need to start from Step 1.",
        confirm: "Yes, start again",
        cancel: "Continue assessment",
      },
      navigation: {
        back: "Back",
        continue: "Continue",
        confirm: "Confirm and continue",
        stepCounter: "Step",
      },
      step1: {
        heading: "What do you need financial support for?",
        subheading: "This helps us ask the right questions and find relevant schemes.",
        businessTitle: "Business or self-employment",
        businessDesc:
          "Setting up a shop, workshop, machinery purchase, tiny enterprise, or transport vehicle.",
        educationTitle: "Professional or technical education",
        educationDesc:
          "Tuition fees, books, hostel expenses for degree courses, technical diplomas, or studies abroad.",
        helpText:
          "Concessional credit schemes have distinct statutory funding parameters for commercial enterprises versus educational pursuits.",
      },
      step2Business: {
        heading: "Tell us about your business",
        subheading: "Describe what you plan to do. This helps match with relevant enterprise scheme guidelines.",
        descLabel: "Business or activity description",
        descPlaceholder: "e.g., A tailoring shop, flour mill, dairy farming, electric repair unit",
        categoryLabel: "Broad activity category (Optional)",
        categoryPlaceholder: "Select category or leave not sure",
        categories: {
          agriculture_allied: "Agriculture and allied activities",
          manufacturing: "Manufacturing or small industry",
          retail_services: "Retail, trade, or services",
          transport: "Transport",
          other: "Other / not sure",
        },
        stageLabel: "Business stage",
        stages: {
          new: "Starting a new business",
          expanding: "Expanding an existing business",
        },
        notice:
          "Your written description is the main source of detail. Category selection is for organizational grouping and does not establish scheme eligibility on its own.",
      },
      step2Education: {
        heading: "Tell us about your education plans",
        subheading: "Provide details of your academic course to help identify education loan concessions.",
        courseLabel: "Course or programme name",
        coursePlaceholder: "e.g., B.Tech Computer Science, MBBS, Diploma in Civil Engg",
        levelLabel: "Study level",
        levels: {
          diploma: "Diploma",
          undergraduate: "Undergraduate",
          postgraduate: "Postgraduate",
          doctoral: "Doctoral",
          other: "Other / not sure",
        },
        admissionLabel: "Admission status",
        admissions: {
          confirmed: "Admission confirmed",
          applied_awaiting: "Applied or awaiting admission",
          exploring: "Still exploring",
        },
        locationLabel: "Study location",
        locations: {
          india: "India",
          outside_india: "Outside India",
          not_decided: "Not decided",
        },
        institutionLabel: "Institution or college name (Optional)",
        institutionPlaceholder: "e.g., Government Polytechnic Pune, IIT Delhi",
        durationLabel: "Expected course duration in months (Optional)",
        durationPlaceholder: "e.g., 36, 48",
        notice:
          "Course and admission choices are collected to prepare for scheme matching. No marksheets or admission certificates are required in this step.",
      },
      step3: {
        businessHeading: "What is the estimated total project cost?",
        educationHeading: "What is the estimated total education cost?",
        costLabel: "Total estimated cost (INR)",
        costHelper:
          "Enter the total estimated cost, not your annual income. Your actual financing amount will depend on the applicable scheme.",
        borrowingLabel: "Amount you want to borrow (Optional)",
        borrowingHelper: "Leave this blank if you are not sure.",
      },
      step4: {
        heading: "Tell us about your family income",
        subheading: "Concessional credit schemes have statutory income ceilings and affirmative mandate criteria.",
        incomeLabel: "Annual family income from all sources (INR)",
        incomeHelper:
          "Enter your family’s total income for one year, not one month. Enter 0 if currently zero.",
        communityLabel: "Scheduled Caste eligibility self-declaration",
        communityHelper:
          "This information helps assess schemes intended for Scheduled Caste beneficiaries. Your answer is a self-declaration; documents are verified later by the authorized institution.",
        communityOptions: {
          yes: "Yes, I belong to Scheduled Caste category",
          no: "No, I belong to another category",
          unsure: "I am not sure",
          prefer_not_to_say: "Prefer not to say",
        },
        draftNotice:
          "Your answers are used to prepare this assessment in your browser session. You can clear them at any time.",
      },
      step5: {
        heading: "Where would you like to find a Channel Partner?",
        subheading: "We use this location to help find relevant Channel Partners.",
        stateLabel: "State or Union Territory",
        statePlaceholder: "Select State / UT",
        districtLabel: "District",
        districtPlaceholder: "Select District",
        pincodeLabel: "Postal PIN Code (Optional)",
        pincodePlaceholder: "e.g., 442001",
        helper:
          "Six digits only. We do not use GPS or full residential address in this preliminary assessment.",
      },
      step6: {
        heading: "Check your answers",
        subheading: "Review your submitted information before continuing. You can edit any section.",
        group1Title: "Purpose and requirement",
        group2Title: "Estimated costs",
        group3Title: "Income and eligibility",
        group4Title: "Location",
        editBtn: "Edit",
        notProvided: "Not provided",
        confirmBtn: "Confirm and continue",
        preliminaryNotice:
          "You can update these answers. Recommendations will be preliminary guidance based on the information provided.",
      },
      guided: {
        progressLabel: (current: number, total: number) => `Question ${current} of ${total}`,
        progressAriaLabel: (current: number, total: number) => `Question ${current} of ${total}`,
        viewGuidanceAction: "View guidance",
        evaluatingAction: "Evaluating...",
        changeAction: "Change",
        reviewTitle: "Check your answers",
        reviewSubtitle: "Review your answers before receiving scheme guidance. You can change any response.",
        reviewNotice: "Recommendations are preliminary guidance based on self-declared details. Final loan approval and terms are governed by authorized lending institutions after formal verification.",
        whyWeAskTitle: "Why we ask this",
        chooseOption: "Choose one option.",
        quickSelect: "Quick select:",
        questions: {
          purpose: {
            heading: "What do you need financial support for?",
            guidance: "Choose one option.",
            whyWeAsk: "Different schemes and statutory mandates apply to commercial ventures and educational pursuits.",
            businessLabel: "Business or self-employment",
            businessDesc: "For a shop, workshop, machinery purchase, tiny enterprise, or commercial vehicle.",
            educationLabel: "Professional or technical education",
            educationDesc: "For supported higher, professional, or technical study in India or abroad.",
          },
          businessStage: {
            heading: "What stage is your business in?",
            guidance: "Choose one option.",
            whyWeAsk: "Schemes offer different terms, subsidies, and lending limits for setting up a new venture versus expanding an existing business.",
            newLabel: "Starting a new business",
            newDesc: "Setting up a greenfield venture, procuring initial stock, tools, or establishment.",
            expandingLabel: "Expanding an existing business",
            expandingDesc: "Scaling an operating enterprise, adding machinery, vehicles, or working capital.",
          },
          businessActivity: {
            heading: "Describe your business or proposed activity",
            guidance: "Briefly explain what your enterprise produces, sells, or services.",
            whyWeAsk: "Describing your trade helps ensure the activity is eligible under supported manufacturing, service, agriculture, or retail categories.",
            descLabel: "Business description",
            descPlaceholder: "e.g., A tailoring unit, flour mill, dairy farming, electric repair shop",
            categoryLabel: "Broad activity category (Optional)",
            categoryPlaceholder: "Select category or leave not sure",
          },
          educationCourse: {
            heading: "What course or programme are you planning to study?",
            guidance: "Enter your degree, technical diploma, or certificate programme.",
            whyWeAsk: "Course details help verify whether the programme is recognized under concessional education loan guidelines.",
            courseLabel: "Course or programme name",
            coursePlaceholder: "e.g., B.Tech Computer Science, MBBS, Diploma in Civil Engg",
            institutionLabel: "Institution or college name (Optional)",
            institutionPlaceholder: "e.g., Government Polytechnic Pune, IIT Delhi",
            durationLabel: "Expected course duration in months (Optional)",
            durationPlaceholder: "e.g., 36 for 3-year degree, 48 for 4-year degree",
          },
          educationLevel: {
            heading: "What level of study is this course?",
            guidance: "Choose one option.",
            whyWeAsk: "Different loan quantum and interest subsidy structures apply to diplomas, undergraduate degrees, and postgraduate studies.",
          },
          educationAdmission: {
            heading: "What is your current admission status?",
            guidance: "Choose one option.",
            whyWeAsk: "Lending institutions disburse loans after admission is confirmed, but preliminary guidance helps you apply with confidence.",
          },
          educationLocation: {
            heading: "Where will you be studying?",
            guidance: "Choose one option.",
            whyWeAsk: "Separate schemes and distinct interest subsidies exist for courses within India versus studies abroad.",
          },
          cost: {
            businessHeading: "What is the estimated total project cost?",
            educationHeading: "What is the estimated total education cost?",
            guidance: "Enter the full expected outlay, including equipment, setup costs, or tuition and hostel fees.",
            whyWeAsk: "Scheme limits vary according to the total cost of the proposed activity.",
            amountLabel: "Total estimated outlay (INR)",
            borrowingLabel: "Amount you want to borrow (Optional)",
            borrowingPlaceholder: "Leave blank if you want full eligible financing",
            borrowingHelp: "Requested borrowing cannot exceed total cost. Concessional schemes fund up to 90%–100% of the outlay.",
            borrowingErrorExceeded: "Requested borrowing amount cannot exceed the total estimated cost.",
          },
          income: {
            heading: "What is your annual family income?",
            guidance: "Enter your family’s total income for one year, from all sources. Enter 0 if currently zero.",
            whyWeAsk: "Some schemes have an annual family-income requirement to prioritize lower-income households.",
            amountLabel: "Annual family income from all sources (INR)",
            zeroIncomeNote: "* Family income above ₹5 Lakh does not block this assessment; statutory ceilings will be detailed in results.",
          },
          community: {
            heading: "Do you belong to the Scheduled Caste (SC) community?",
            guidance: "This is a preliminary self-declaration. Official certificates are verified by the institution at a later stage.",
            whyWeAsk: "NSFDC schemes are specifically designed to support Scheduled Caste entrepreneurs and students with concessional terms.",
            privacyNotice: "We do not ask for certificate numbers, Aadhaar, PAN, or file uploads at this stage.",
            options: {
              yes: "Yes, I belong to Scheduled Caste category",
              no: "No, I belong to another category",
              unsure: "I am not sure",
              prefer_not_to_say: "Prefer not to say",
            },
          },
          location: {
            heading: "Where are you located?",
            guidance: "Select your State and District so we can identify operational Channel Partners near you.",
            whyWeAsk: "Channel Partners, State Channelising Agencies, and application processes vary by state.",
            stateLabel: "State or Union Territory",
            statePlaceholder: "Select State / UT",
            districtLabel: "District",
            districtPlaceholder: "Select District",
            pincodeLabel: "Postal PIN Code (Optional)",
            pincodePlaceholder: "e.g., 442001",
            privacyNotice: "We only use State and District for routing. We do not request street addresses or device GPS.",
          },
        },
        validation: {
          purposeRequired: "Select what you need financial support for.",
          businessStageRequired: "Select whether you are starting a new business or expanding.",
          businessDescriptionRequired: "Describe your business or activity (at least 3 characters).",
          courseNameRequired: "Enter your course or programme name (at least 2 characters).",
          studyLevelRequired: "Select your level of study.",
          admissionStatusRequired: "Select your current admission status.",
          studyLocationRequired: "Select where you will be studying.",
          costRequired: "Enter a valid estimated cost greater than zero.",
          borrowingInvalid: "Requested borrowing amount cannot exceed the total estimated cost.",
          incomeRequired: "Enter your annual family income (enter 0 if none).",
          communityRequired: "Select a community self-declaration option.",
          stateRequired: "Select your State or Union Territory.",
          districtRequired: "Select or specify your District.",
          pincodeInvalid: "Postal code must be a valid 6-digit Indian PIN code.",
        },
      },
    },
    results: {
      badge: "Eligibility Evaluation",
      heading: "Scheme Guidance For Your Needs",
      subheading:
        "Evaluated deterministically against official NSFDC and State lending guidelines. Not an automated loan approval.",
      evaluatingText: "Evaluating your declared answers against official scheme policies...",
      editAnswersBtn: "Edit assessment answers",
      startNewBtn: "Start new assessment",
      topPickBadge: "Recommended Match",
      officialVerifiedBadge: "Verified Official Policy",
      demonstrationBadge: "Demonstration Scheme",
      providerLabel: "Lending Provider",
      estimatedAssistance: "Concessional Financial Structure",
      maxLoanLabel: "Indicative Loan Assistance (up to 90%)",
      promoterContributionLabel: "Promoter Margin Contribution (min 10%)",
      interestRateLabel: "Concessional Interest Rate",
      moratoriumLabel: "Grace Period (Moratorium)",
      tenureLabel: "Maximum Repayment Tenure",
      yearsSuffix: "years",
      viewCalculationCta: "Simulate Repayment in Calculator",
      findPartnerCta: "Find Authorized Channel Partners",
      assessmentDisclosureTitle: "How we assessed this scheme",
      assessmentDisclosureSub: "Traceable statutory rules evaluated against your declared profile.",
      passedRulesTitle: "Verified Conditions Passed",
      failedRulesTitle: "Conditions Not Met",
      unknownRulesTitle: "Conditions Requiring Confirmation",
      clauseRefLabel: "Policy Clause",
      sourcesTitle: "Policy Source & Verification Metadata",
      documentRef: "Document Reference",
      officialUrl: "Official NSFDC Policy Link",
      effectiveDate: "Effective Date",
      sourceCheckedDate: "Last Verified by System",
      verificationStatus: "Verification Status",
      openOfficialDoc: "Open official guidelines",
      alternativesTitle: "Other Potentially Eligible Schemes",
      alternativesSub: "Alternative schemes that also match your declared criteria.",
      needsInfoTitle: "Schemes Requiring Additional Confirmation",
      needsInfoSub: "These schemes may match once specific institutional or documentary facts are verified.",
      ineligibleTitle: "Schemes Outside Current Criteria",
      ineligibleSub: "Transparently displayed with reasons for clear financial guidance.",
      whyNotLabel: "Reason not currently suitable",
      missingRequirements: "Missing confirmation needed",
      noMatchTitle: "No Directly Matching Scheme Found",
      noMatchDesc:
        "Based on your stated project cost or income, none of the standard concessional schemes directly fit your parameters.",
      noMatchAction1: "Adjust your project cost or income details in the assessment",
      noMatchAction2: "Consult an authorized Channel Partner for special state assistance programs",
      incompleteTitle: "No Assessment Found in Session",
      incompleteDesc:
        "Please complete the short beneficiary assessment first to receive explainable scheme recommendations.",
      takeAssessmentBtn: "Start Assessment",
      disclaimerBadge: "Statutory Guidance Notice",
      footerDisclaimer:
        "SAHAYAK AI recommendations are preliminary decision support based on self-declared information. Final sanction, appraisal, and disbursement are governed exclusively by authorized Channel Partner institutions.",
      engineTraceBadge: "Deterministic Engine Trace",
      evaluatedOn: "Evaluated on",

      // Explainable Financial Statement & Decision Redesign Keys
      preliminaryStatusLabel: "Preliminary guidance",
      preliminaryDisclaimer:
        "This result is preliminary guidance, not a loan approval. Final eligibility, verification, sanction and disbursement are decided by an authorized lending institution.",
      singleMatchHeading: "This scheme may suit your needs.",
      singleMatchSub:
        "Based on the information you provided, the scheme’s preliminary criteria appear to match your situation.",
      multipleMatchHeading: "These schemes may suit your needs.",
      multipleMatchSub:
        "More than one scheme appears to match the information you provided.",
      noMatchHeading: "We could not find a matching scheme from the information provided.",
      noMatchSub:
        "This does not mean you are ineligible for all support. Review your answers or speak with an authorized Channel Partner.",
      needsInfoHeading: "We need more information to provide guidance.",
      needsInfoSubNew:
        "Certain official criteria require further confirmation before determining applicability.",
      errorHeading: "We could not prepare your guidance.",
      errorSub:
        "A temporary technical problem prevented preparing your scheme assessment.",
      retryBtn: "Try again",
      whyMatchedTitle: "Why this scheme matched",
      whyMatchedNotice:
        "Documents will be used to verify applicable criteria by the authorized Channel Partner or lending bank.",
      userAnswerLabel: "You entered / selected",
      criterionLabel: "Scheme criterion",
      comparisonResultLabel: "Result",
      statusMatched: "Matches the scheme’s supported purpose and parameters",
      statusNeedsVerification: "Requires documentary verification at the branch",
      statusNotAssessed: "Not evaluated in this preliminary assessment",
      financialStatementTitle: "Estimated financing",
      financialStatementSub:
        "Reconciled preliminary allocation based on stated project outlay and official scheme limits.",
      projectCostLabel: "Project cost",
      estimatedLoanLabel: "Estimated loan amount",
      applicantContributionLabel: "Estimated applicant contribution",
      totalLabel: "Total",
      financingShareLabel: "Financing share",
      applicantShareLabel: "Applicant share",
      calculationFormulaTitle: "How this estimate is calculated",
      loanFormulaLabel: "Estimated loan amount formula",
      contributionFormulaLabel: "Applicant contribution formula",
      schemeCapNoticePrefix: "Calculated financing at",
      schemeCapNoticeSuffix: "Maximum scheme limit applied",
      repaymentTitle: "Estimated repayment",
      repaymentSub:
        "Indicative instalment assuming regular monthly reducing-balance repayment.",
      interestRateType: "Annual (concessional, reducing-balance)",
      repaymentTermLabel: "Repayment term",
      repaymentFrequencyLabel: "Repayment frequency",
      monthlyFrequency: "Monthly",
      moratoriumGraceLabel: "Moratorium (grace period)",
      moratoriumNote:
        "Principal repayment begins after the moratorium period. Interest treatment during moratorium is subject to lender terms.",
      estimatedMonthlyInstalmentLabel: "Estimated monthly instalment",
      estimatedTotalRepaymentLabel: "Estimated total repayment",
      estimatedTotalInterestLabel: "Estimated total interest",
      repaymentDisclaimer:
        "This is an estimate for financial planning, not a final quote. Lending institutions determine applicable rate tiers and final sanction terms.",
      calculationUnavailableHeading: "Calculation unavailable for this scheme",
      calculationUnavailableNotice:
        "Repayment cannot be calculated because required loan amount or tenure parameters are missing.",
      assumptionsTitle: "Assumptions used",
      informationSourceTitle: "Information source",
      sourceAuthorityLabel: "Scheme authority",
      sourceDocumentLabel: "Circular or guideline",
      effectiveDateLabel: "Effective date",
      lastReviewedLabel: "Last reviewed date",
      sourceNotice:
        "This prototype summarizes public guidance. The authorized lending institution will confirm the currently applicable terms.",
      sourceUnavailableNotice:
        "An official source link is not currently available in this prototype. Confirm the latest terms with an authorized Channel Partner.",
      demoNotice:
        "This scheme uses demonstration data for illustration and prototype validation.",
      documentsTitle: "Documents to prepare",
      documentsSub:
        "Keep these documents ready for appraisal and verification at the branch.",
      docCategoryIdentity: "Identity and eligibility",
      docCategoryBusiness: "Business and enterprise",
      docCategoryEducation: "Education and institution",
      docStatusRequired: "Usually required",
      docStatusRequested: "The lender may request",
      documentsDisclaimer:
        "The authorized lending institution will confirm the final document list.",
      primaryNextActionTitle: "Find an authorized Channel Partner",
      primaryNextActionSub:
        "A Channel Partner can verify your documents, explain the current terms and guide you through the formal application process.",
      secondaryReviewAnswers: "Review or change answers",
      secondaryEstimateDifferent: "Estimate with different values",
      secondaryPrint: "Print this guidance",
      secondaryStartAgain: "Start again",
      multipleMatchesCompareTitle: "Compare matching schemes",
      rankingSelectionExplanation:
        "Primary scheme is identified deterministically based on statutory affirmative criteria, purpose fit, and official policy status.",
      compareColumnScheme: "Scheme",
      compareColumnMaxLoan: "Maximum supported amount",
      compareColumnInterest: "Indicative interest rate",
      compareColumnTenure: "Repayment term",
      compareColumnPurpose: "Purpose",
    },
    calculator: {
      pageTitle: "Understand Your Repayment",
      pageDescription: "Simulate scheme-aware loan limits, mandatory promoter equity, moratorium grace periods, and amortization schedules.",
      badge: "Financial Decision Support",
      estimatedNotApproved: "Estimated, not approved",
      verifiedPolicy: "Verified Statutory Policy",
      demonstrationMode: "Demonstration Assumption Mode",
      changeScheme: "Change Scheme",
      returnToResults: "Back to Recommendations",
      editAssessment: "Edit in Assessment",
      findPartnersCta: "Find Authorized Channel Partners",
      inputsTitle: "Loan Parameters & Options",
      inputsSub: "Adjust requested borrowing, tenure, and grace terms within policy limits.",
      schemeSelectLabel: "Selected Concessional Scheme",
      projectCostLabel: "Total Outlay / Course Cost",
      projectCostHelp: "Confirmed from your assessment requirement.",
      requestedLoanLabel: "Requested Loan Amount",
      requestedLoanHelp: "Enter desired borrowing amount (up to statutory scheme ceiling).",
      tenureLabel: "Repayment Duration",
      tenureHelp: "Duration of principal repayment instalments after grace period.",
      moratoriumLabel: "Moratorium (Grace Period)",
      moratoriumHelp: "Grace duration before regular principal repayments begin.",
      frequencyLabel: "Repayment Frequency",
      methodLabel: "Repayment Method",
      treatmentLabel: "Moratorium Interest Treatment",
      equalInstalmentOption: "Equal Monthly Instalment (Annuity)",
      equalPrincipalOption: "Equal Principal (Declining EMI)",
      monthlyOption: "Monthly",
      quarterlyOption: "Quarterly",
      treatmentCapitalize: "Capitalize Interest into Loan",
      treatmentInterestOnly: "Pay Interest Monthly",
      treatmentAccrueSimple: "Simple Accrual (Uncompounded)",
      treatmentNone: "No Grace (Immediate Repayment)",
      resetDefaults: "Reset to Assessed Defaults",
      recalculating: "Recalculating estimate...",
      outOfDateBanner: "Inputs have changed. Recalculating estimate...",
      summaryTitle: "Repayment Estimate Summary",
      summarySub: "Preliminary financial projection based on statutory concessional lending criteria.",
      eligibleLoan: "Permissible Loan Amount",
      promoterEquity: "Mandatory Promoter Equity",
      fundingGap: "Amount to Fund from Other Sources",
      indicativeInstalment: "Estimated Instalment",
      monthlyInstalment: "Monthly EMI",
      quarterlyInstalment: "Quarterly Instalment",
      firstInstalmentNote: "First instalment amount",
      finalInstalmentNote: "Final instalment adjusted for rounding",
      annualInterestRate: "Concessional Interest Rate",
      totalLoanRepayment: "Total Estimated Loan Repayment",
      totalInterest: "Total Projected Interest",
      splitBarTitle: "Financing Proportions & Capital Outlay",
      splitBarLoan: "Concessional Loan",
      splitBarEquity: "Promoter Equity",
      splitBarOther: "Other Funding",
      timelineTitle: "Loan Lifecycle Timeline",
      timelineGracePhase: "Phase 1: Grace & Moratorium",
      timelineRepayPhase: "Phase 2: Amortization & Repayment",
      scheduleTitle: "Amortization Repayment Schedule",
      scheduleSub: "Detailed period-by-period breakdown of principal reduction and interest servicing.",
      colPeriod: "Period",
      colOpening: "Opening Balance",
      colPayment: "Payment",
      colPrincipal: "Principal",
      colInterest: "Interest",
      colClosing: "Closing Balance",
      moratoriumTag: "Grace",
      repaymentTag: "Repayment",
      downloadCsv: "Download CSV Schedule",
      printSchedule: "Print Summary",
      expandSchedule: "Show Full Schedule",
      collapseSchedule: "Show Fewer Rows",
      showingFirst: "Showing first",
      assumptionsTitle: "How This Estimate Was Calculated",
      assumptionsSub: "Statutory rules, interest selection rationale, and simulation assumptions.",
      exclusionsTitle: "Excluded Fees & Charges",
      sourcesTitle: "Verified Policy Sources & Source-Checked Dates",
      parameterOriginsTitle: "Parameter Origins & Verification Status",
      preliminaryNotice: "This calculation is an educational decision-support estimate based on self-declared criteria and does not constitute a formal loan sanction or approval offer.",
      noSchemeTitle: "No Scheme Selected",
      noSchemeDesc: "Select a concessional credit scheme below or complete the assessment to receive tailored recommendations.",
      takeAssessmentBtn: "Start Assessment",
      exploreSchemesBtn: "Explore Available Schemes",
      errorTitle: "Unable to Calculate Repayment",
      retryBtn: "Retry Calculation",
      clampedWarningTitle: "Statutory Financing Limit Applied",
      clampedWarningDesc: "Your requested loan amount exceeded the permissible statutory cap for this scheme and has been clamped to the maximum permitted financing.",
    },
    partners: {
      pageTitle: "Find a Channel Partner",
      pageDescription: "Explore accredited financial institutions that support your selected scheme and serve your area.",
      badge: "Policy & Proximity Routing",
      routingNoticeTitle: "Accredited Channel Finance Routing",
      routingNoticeDesc: "Direct loan applications are not accepted by central ministries; funds are disbursed exclusively through accredited State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), and Regional Rural Banks (RRBs).",
      selectedSchemeLabel: "Selected Scheme",
      locationLabel: "Your Search Location",
      changeLocationBtn: "Change Location",
      searchRadiusLabel: "Search Radius",
      radiusKm: "km",
      filterAll: "All Branches",
      filterSca: "SCAs",
      filterPsb: "PSBs",
      filterRrb: "RRBs",
      filterEligible: "Eligible Only",
      searchPlaceholder: "Search by branch name, institution, or district...",
      resultsCount: "eligible partner offices found",
      topRecommendedBadge: "Recommended",
      eligibleBadge: "Eligible for Routing",
      unverifiedBadge: "Unverified / Contact Branch",
      whyThisPartnerTitle: "Why this partner?",
      approxDistance: "approximate geodesic distance",
      observedDate: "Data observed",
      callAction: "Call Branch",
      callDisabled: "Sample institution: Call disabled",
      directionsAction: "Get Directions",
      directionsDisabled: "Sample coordinates: Navigation disabled",
      choosePartnerAction: "Choose this partner",
      chosenPartnerBadge: "Selected for Application",
      mapTab: "Map View",
      listTab: "List View",
      mapViewTitle: "Accredited Branch Map",
      mapDisclaimer: "Interactive OpenStreetMap view showing accredited branches and approximate straight-line distance.",
      mapUnavailableTitle: "Map Unavailable",
      mapUnavailableDesc: "Live map tiles could not be loaded. Your partner directory and branch selection remain fully operational.",
      unverifiedSectionTitle: "Additional Directory Offices",
      unverifiedSectionSub: "Offices listed in the official directory whose current operational quotas or coordinates could not be automatically confirmed.",
      noPartnersTitle: "No eligible partner found in this radius",
      noPartnersDesc: "No accredited branches in our current records match your selected scheme within the active radius.",
      expandRadiusAction: "Expand search to 100 km",
      noSchemeNoticeTitle: "No Scheme Context Selected",
      noSchemeNoticeDesc: "Please select a concessional scheme or complete the assessment to view accredited branches for that scheme.",
      takeAssessmentBtn: "Complete Assessment",
      disclaimerText: "Preliminary routing is advisory. Final loan sanction, field appraisal, and quota disbursement remain with the accredited Channel Partner and ministry guidelines.",
      continueToNextSteps: "Continue to Required Documents",
      backToCalculator: "Back to Repayment Estimate",
    },
    nextSteps: {
      pageTitle: "Your Guidance Summary & Document Readiness",
      pageSubtitle:
        "Prepare these verified physical documents before approaching your recommended Channel Partner branch. This reduces repeat visits and speeds up preliminary verification.",
      badge: "Application Readiness",
      printSummary: "Print summary",
      editAnswers: "Edit assessment answers",
      guidanceSummaryTitle: "SAHAYAK AI Guidance Summary",
      generatedOn: "Generated on",
      beneficiaryCategory: "Beneficiary Category",
      declaredSC: "Scheduled Caste (Self-declared)",
      requirementPurpose: "Requirement Purpose",
      estimatedOutlay: "Estimated Outlay",
      familyIncome: "Annual Family Income",
      recommendedScheme: "Recommended Scheme Match",
      selectedPartner: "Target Channel Partner",
      changePartner: "Change partner",
      selectPartner: "Select partner",
      noPartnerSelected: "State Channelizing Agency (SCA) / Accredited Bank Branch",
      checklistTitle: "Physical Documents Checklist",
      checklistSubtitle: "Check off the documents you currently have available before visiting the branch.",
      preparedBadge: "prepared",
      verificationNoticeTitle: "Physical Verification Protocol",
      verificationNoticeDesc:
        "This list represents standard guidelines across NSFDC and SCA channel finance documentation. Specific partner branches may request supplementary guarantor or KYC records during formal appraisal.",
      handoffTitle: "What happens next at the Channel Partner?",
      handoffIntro:
        "When you visit the recommended Channel Partner (State Channelizing Agency or designated bank branch):",
      handoffStep1:
        "Present this SAHAYAK AI Guidance Summary and quote the specific scheme code to the branch officer.",
      handoffStep2:
        "Submit the physical caste certificate, income certificate, and project quotation/invoices for verification.",
      handoffStep3:
        "The branch will issue the official statutory application form, initiate field appraisal, and determine sanction in accordance with institutional guidelines.",
      returnToPartners: "Return to Channel Partners Directory",
      returnToResults: "Return to Scheme Assessment Result",
      demoNotice: "Sample institution for demonstration",
      emptyStateTitle: "No Assessment Found in Session",
      emptyStateDesc:
        "Please complete the beneficiary assessment first to receive a personalized guidance summary and document readiness checklist.",
      startAssessmentBtn: "Start Assessment",
    },
  },
  hi: {
    nav: {
      home: "मुख्य पृष्ठ",
      howItWorks: "यह कैसे काम करता है",
      whoItHelps: "किसे सहायता मिलती है",
      faqs: "अक्सर पूछे जाने वाले प्रश्न",
      findMyScheme: "योजना खोजें",
      checkEligibility: "पात्रता जांचें",
      calculator: "कैलकुलेटर",
      partners: "चैनल पार्टनर",
      nextSteps: "अगले कदम",
      language: "भाषा",
      menuOpen: "नेविगेशन मेनू खोलें",
      menuClose: "नेविगेशन मेनू बंद करें",
    },
    home: {
      descriptor: "योजना और रियायती वित्त मार्गदर्शन",
      protoBadge: "प्रोटोटाइप · नमूना डेटा",
      heading: "सही वित्तीय सहायता खोजें",
      supportingText: "उपयुक्त योजनाओं की जांच करें, पुनर्भुगतान का अनुमान लगाएं, या किसी अधिकृत ऋण प्रदाता भागीदार को खोजें।",
      preliminaryNotice: "SAHAYAK AI केवल प्रारंभिक मार्गदर्शन प्रदान करता है। अंतिम पात्रता, सत्यापन और ऋण स्वीकृति का निर्णय अधिकृत ऋण संस्थानों द्वारा किया जाता है।",
      journeys: {
        journey1: {
          number: "01",
          title: "योजना पात्रता की जांच करें",
          description: "यह जानने के लिए कुछ प्रश्नों के उत्तर दें कि कौन सी व्यवसाय या शिक्षा योजनाएं आपकी आवश्यकताओं के अनुरूप हो सकती हैं।",
          action: "पात्रता जांचें",
        },
        journey2: {
          number: "02",
          title: "पुनर्भुगतान का अनुमान लगाएं",
          description: "अनुमानित ऋण राशि, आवेदक की हिस्सेदारी और मासिक किस्त (ईएमआई) देखें।",
          action: "कैलकुलेटर खोलें",
        },
        journey3: {
          number: "03",
          title: "चैनल पार्टनर खोजें",
          description: "आवेदन प्रक्रिया में आपका मार्गदर्शन करने वाली किसी अधिकृत संस्था को खोजें।",
          action: "पार्टनर खोजें",
        },
      },
      howItHelps: {
        heading: "यह सेवा किस प्रकार सहायता करती है",
        step1Num: "1",
        step1Title: "बताएं आपको क्या चाहिए",
        step1Desc: "अपने नियोजित व्यवसाय या पाठ्यक्रम और अनुमानित वित्तपोषण आवश्यकता का विवरण दें।",
        step2Num: "2",
        step2Title: "अनुमान और नियमों की समीक्षा करें",
        step2Desc: "पात्र रियायती योजनाओं, ब्याज दरों और आवश्यक लाभार्थी अंशदान को समझें।",
        step3Num: "3",
        step3Title: "अधिकृत ऋण प्रदाता भागीदार से संपर्क करें",
        step3Desc: "आवेदन के लिए अपने योजना सारांश और आवश्यक दस्तावेज सूची के साथ अधिकृत शाखा में जाएं।",
      },
    },
    hero: {
      eyebrow: "व्यवसाय और शिक्षा वित्त के लिए मार्गदर्शन",
      heading: "अपने अगले कदम के लिए सही सहायता पाएं।",
      headingHighlight: "अगले कदम",
      description:
        "सरकारी ऋण योजनाओं की जानकारी प्राप्त करें, अनुमानित पुनर्भुगतान को समझें, और संपर्क के लिए अधिकृत चैनल पार्टनर खोजें।",
      primaryCta: "योजना खोजें",
      secondaryCta: "यह कैसे काम करता है",
      supportingText:
        "व्यवसाय या शिक्षा के लिए सहायता चाहने वाले अनुसूचित जाति के पात्र लाभार्थियों के लिए।",
      guidanceNoticeTitle: "प्रारंभिक मार्गदर्शन सूचना",
      guidanceNoticeText:
        "सिफारिशें प्रारंभिक मार्गदर्शन हैं। अंतिम पात्रता और ऋण स्वीकृति अधिकृत ऋण प्रक्रिया के माध्यम से तय की जाती है।",
      protoBadge: "प्रोटोटाइप · नमूना डेटा मोड",
    },
    visual: {
      badge: "यात्रा पूर्वावलोकन",
      step1Title: "उपयुक्त योजनाओं की खोज",
      step1Sub: "लागत और उद्देश्य पर आधारित स्पष्ट नियम मिलान।",
      step2Title: "पुनर्भुगतान समझें",
      step2Sub: "90% ऋण और 10% लाभार्थी हिस्सेदारी का स्पष्ट विवरण।",
      step3Title: "चैनल पार्टनर खोजें",
      step3Sub: "सक्रिय और कम एनपीए वाली अधिकृत शाखाओं का मार्गदर्शन।",
      illustrativeNotice: "प्रदर्शनात्मक पूर्वावलोकन",
    },
    pathways: {
      badge: "सहायता श्रेणियां",
      heading: "आपको किस प्रकार की सहायता चाहिए?",
      subheading:
        "अपने लक्ष्य के अनुसार मार्ग चुनें। आप 3 मिनट से भी कम समय में पूरा मूल्यांकन कर सकते हैं।",
      businessTitle: "व्यवसाय शुरू या विकसित करें",
      businessDesc:
        "सूक्ष्म उद्यम, उपकरण खरीद या अन्य समर्थित आजीविका गतिविधियों के लिए वित्तीय विकल्प खोजें।",
      businessAction: "व्यवसाय सहायता देखें",
      educationTitle: "अपनी शिक्षा जारी रखें",
      educationDesc:
        "भारत या विदेश में व्यावसायिक व तकनीकी शिक्षा के लिए रियायती ऋण विकल्प खोजें।",
      educationAction: "शिक्षा सहायता देखें",
    },
    threeSteps: {
      badge: "तीन-चरणीय मार्गदर्शन",
      heading: "सवालों से एक स्पष्ट अगले कदम तक",
      subheading:
        "हमारी सुव्यवस्थित प्रक्रिया आपको अनावश्यक बैंक चक्करों और भ्रम से बचाती है।",
      protoNotice:
        "प्रदर्शन मोड: यह प्रोटोटाइप वर्तमान में मानक NSFDC सार्वजनिक दिशानिर्देशों के आधार पर मापदंडों का मूल्यांकन करता है।",
      step1Num: "01",
      step1Title: "बताएं आपको क्या चाहिए",
      step1Desc:
        "अपने उद्देश्य, अनुमानित लागत और पारिवारिक आय से संबंधित कुछ सरल सवालों के जवाब दें।",
      step2Num: "02",
      step2Title: "अपने विकल्प समझें",
      step2Desc:
        "उपयुक्त योजना की सिफारिश और अनुमानित वित्तीय सहायता एवं मासिक किस्तों की स्पष्ट जानकारी देखें।",
      step3Num: "03",
      step3Title: "जानें कहाँ जाना है",
      step3Desc:
        "अपने क्षेत्र में अधिकृत चैनल पार्टनर खोजें और आवश्यक दस्तावेजों के साथ तैयारी करें।",
    },
    trust: {
      badge: "हमारे सिद्धांत",
      heading: "स्पष्ट उत्तर, ऐसे कारणों के साथ जिन्हें आप समझ सकें",
      subheading:
        "पारदर्शिता, निष्पक्षता और नागरिक-हितैषी वित्तीय समझ पर आधारित।",
      coreStatement:
        "SAHAYAK AI आपको तैयारी में सहायता करता है। यह ऋण स्वीकृत या वितरित नहीं करता है।",
      principle1Title: "स्पष्ट योजना मिलान",
      principle1Desc:
        "सिफारिशों में हमेशा बताया जाता है कि कोई योजना आपकी लागत और प्राथमिकताओं के अनुकूल क्यों है।",
      principle2Title: "पारदर्शी वित्तीय गणना",
      principle2Desc:
        "वित्तीय अनुमानों में ब्याज दर, छूट की अवधि (मोरेटोरियम) और आवश्यक प्रवर्तक हिस्सेदारी स्पष्ट दिखाई जाती है।",
      principle3Title: "सत्यापित पार्टनर जानकारी",
      principle3Desc:
        "चैनल पार्टनर शाखाओं की जानकारी, सक्रियता और डेटा की ताजगी आपके जाने से पहले स्पष्ट की जाती है।",
    },
    faq: {
      badge: "अक्सर पूछे जाने वाले प्रश्न",
      heading: "SAHAYAK AI के बारे में आम सवाल",
      subheading:
        "प्रारंभिक मार्गदर्शन, डेटा गोपनीयता और ऋण प्रक्रिया के संबंध में महत्वपूर्ण जानकारियां।",
      q1: "क्या SAHAYAK AI ऋण स्वीकृत करता है?",
      a1: "नहीं। यह केवल प्रारंभिक मार्गदर्शन प्रदान करता है। अधिकृत संस्थान दस्तावेज सत्यापन, ऋण निर्णय और राशि वितरण का कार्य करते हैं।",
      q2: "मुझे किस जानकारी की आवश्यकता होगी?",
      a2: "अपने उद्देश्य, अनुमानित परियोजना या शिक्षा लागत, वार्षिक पारिवारिक आय और स्थान से शुरुआत करें। अतिरिक्त प्रश्न योजना पर निर्भर हो सकते हैं।",
      q3: "क्या मैं व्यवसाय और शिक्षा दोनों विकल्पों की जानकारी ले सकता हूँ?",
      a3: "हाँ। मूल्यांकन शुरू करते समय वह उद्देश्य चुनें जो आपकी वर्तमान आवश्यकता से मेल खाता हो।",
      q4: "क्या इस प्रोटोटाइप पर जानकारी लाइव है?",
      a4: "यह प्रोटोटाइप नमूना योजना परिणामों और काल्पनिक पार्टनर रिकॉर्ड का उपयोग कर सकता है। प्रदर्शन जानकारी को आधिकारिक ऋण प्रस्ताव न माना जाए।",
    },
    finalCta: {
      heading: "कुछ सरल सवालों से शुरुआत करें।",
      subheading: "अपनी आवश्यकता बताएं और अपने अगले कदम की जानकारी लें।",
      button: "योजना खोजें",
      hindiAssessmentNotice: "* सूचना: मूल्यांकन विज़ार्ड अब हिन्दी और अंग्रेज़ी दोनों भाषाओं में उपलब्ध है।",
    },
    footer: {
      description:
        "अनुसूचित जाति के उद्यमियों और विद्यार्थियों के लिए योजना मिलान, वित्तीय गणना और अधिकृत चैनल पार्टनर मार्गदर्शन प्रणाली।",
      sihBadge: "स्मार्ट इंडिया हैकाथॉन 2024 · समस्या कोड SIH26092",
      sectionsTitle: "प्लेटफ़ॉर्म नेविगेशन",
      channelNetworkTitle: "अधिकृत ऋण वितरण नेटवर्क",
      networkDesc:
        "रियायती ऋण राज्य चैनलाइजिंग एजेंसियों (SCAs), सार्वजनिक क्षेत्र के बैंकों और क्षेत्रीय ग्रामीण बैंकों द्वारा वितरित किया जाता है।",
      disclaimerTitle: "प्रारंभिक निर्णय सहायता अस्वीकरण",
      disclaimerText:
        "SAHAYAK AI एक निर्णय-सहायता प्रोटोटाइप है। यह ऋण स्वीकृत नहीं करता है। अंतिम जांच, स्वीकृति और वितरण केवल संबंधित अधिकृत चैनल पार्टनर संस्थानों द्वारा किया जाता है।",
      copyright: "SAHAYAK AI परियोजना · SIH26092 के लिए निर्मित।",
    },
    assessment: {
      steps: {
        step1: "उद्देश्य",
        step2: "विवरण",
        step3: "लागत",
        step4: "आय एवं समुदाय",
        step5: "स्थान",
        step6: "समीक्षा",
      },
      header: {
        badge: "पात्रता मूल्यांकन",
        startAgain: "पुनः शुरू करें",
        draftSaved: "ड्राफ्ट ब्राउज़र सत्र में सुरक्षित है",
        draftRestored: "पिछला ड्राफ्ट सत्र पुनर्प्राप्त किया गया",
      },
      resetDialog: {
        title: "क्या आप मूल्यांकन पुनः शुरू करना चाहते हैं?",
        message:
          "यह इस ब्राउज़र सत्र में दर्ज किए गए आपके सभी उत्तरों को मिटा देगा। आपको चरण 1 से पुनः शुरुआत करनी होगी।",
        confirm: "हाँ, पुनः शुरू करें",
        cancel: "मूल्यांकन जारी रखें",
      },
      navigation: {
        back: "पीछे जाएं",
        continue: "आगे बढ़ें",
        confirm: "पुष्टि करें और आगे बढ़ें",
        stepCounter: "चरण",
      },
      step1: {
        heading: "आपको किस उद्देश्य के लिए वित्तीय सहायता चाहिए?",
        subheading: "यह हमें सही प्रश्न पूछने और उपयुक्त योजनाएं खोजने में मदद करता है।",
        businessTitle: "व्यवसाय या स्वरोजगार",
        businessDesc:
          "दुकान, कार्यशाला, मशीनरी खरीद, सूक्ष्म उद्यम, या व्यावसायिक वाहन की स्थापना या विस्तार।",
        educationTitle: "व्यावसायिक या तकनीकी शिक्षा",
        educationDesc:
          "मान्यता प्राप्त डिग्री पाठ्यक्रमों, तकनीकी डिप्लोमा, या विदेश अध्ययन के लिए शिक्षण शुल्क और रहने का खर्च।",
        helpText:
          "रियायती ऋण योजनाओं में व्यावसायिक उद्यमों और शैक्षणिक पाठ्यक्रमों के लिए अलग-अलग वैधानिक दिशानिर्देश होते हैं।",
      },
      step2Business: {
        heading: "अपने व्यवसाय के बारे में बताएं",
        subheading: "बताएं कि आप क्या करने की योजना बना रहे हैं। इससे उद्यम योजना दिशानिर्देशों के साथ मिलान में मदद मिलती है।",
        descLabel: "व्यवसाय या गतिविधि का विवरण",
        descPlaceholder: "उदा. सिलाई की दुकान, आटा चक्की, डेयरी फार्मिंग, बिजली उपकरण मरम्मत",
        categoryLabel: "व्यापक गतिविधि श्रेणी (वैकल्पिक)",
        categoryPlaceholder: "श्रेणी चुनें या छोड़ दें",
        categories: {
          agriculture_allied: "कृषि और संबद्ध गतिविधियां",
          manufacturing: "विनिर्माण या लघु उद्योग",
          retail_services: "खुदरा, व्यापार या सेवाएं",
          transport: "परिवहन",
          other: "अन्य / निश्चित नहीं",
        },
        stageLabel: "व्यवसाय का स्तर",
        stages: {
          new: "नया व्यवसाय शुरू करना",
          expanding: "मौजूदा व्यवसाय का विस्तार",
        },
        notice:
          "आपका लिखित विवरण मुख्य जानकारी है। श्रेणी चयन वर्गीकरण के लिए है और स्वयं पात्रता तय नहीं करता।",
      },
      step2Education: {
        heading: "अपनी शिक्षा योजनाओं के बारे में बताएं",
        subheading: "शिक्षा ऋण रियायतों की पहचान के लिए अपने शैक्षणिक पाठ्यक्रम का विवरण प्रदान करें।",
        courseLabel: "पाठ्यक्रम या कार्यक्रम का नाम",
        coursePlaceholder: "उदा. बी.टेक कंप्यूटर साइंस, एमबीबीएस, सिविल इंजीनियरिंग डिप्लोमा",
        levelLabel: "अध्ययन स्तर",
        levels: {
          diploma: "डिप्लोमा",
          undergraduate: "स्नातक (Undergraduate)",
          postgraduate: "स्नातकोत्तर (Postgraduate)",
          doctoral: "डॉक्टरेट (Ph.D)",
          other: "अन्य / निश्चित नहीं",
        },
        admissionLabel: "प्रवेश की स्थिति",
        admissions: {
          confirmed: "प्रवेश पक्का (Confirmed)",
          applied_awaiting: "आवेदन किया / परिणाम प्रतीक्षित",
          exploring: "अभी विकल्प देख रहे हैं",
        },
        locationLabel: "अध्ययन का स्थान",
        locations: {
          india: "भारत",
          outside_india: "भारत के बाहर",
          not_decided: "तय नहीं",
        },
        institutionLabel: "संस्थान या कॉलेज का नाम (वैकल्पिक)",
        institutionPlaceholder: "उदा. राजकीय इंजीनियरिंग कॉलेज, पुणे / आईआईटी दिल्ली",
        durationLabel: "पाठ्यक्रम की अपेक्षित अवधि महीनों में (वैकल्पिक)",
        durationPlaceholder: "उदा. 36, 48",
        notice:
          "पाठ्यक्रम और प्रवेश विवरण योजना मिलान की तैयारी के लिए हैं। इस चरण में किसी अंकतालिका या प्रमाण पत्र की आवश्यकता नहीं है।",
      },
      step3: {
        businessHeading: "अनुमानित कुल परियोजना लागत क्या है?",
        educationHeading: "अनुमानित कुल शिक्षा लागत क्या है?",
        costLabel: "कुल अनुमानित लागत (रुपये)",
        costHelper:
          "कुल अनुमानित लागत दर्ज करें, अपनी वार्षिक आय नहीं। आपकी वास्तविक वित्तपोषण राशि लागू योजना पर निर्भर करेगी।",
        borrowingLabel: "वह राशि जो आप ऋण के रूप में लेना चाहते हैं (वैकल्पिक)",
        borrowingHelper: "यदि आप सुनिश्चित नहीं हैं तो इसे खाली छोड़ दें।",
      },
      step4: {
        heading: "अपनी पारिवारिक आय के बारे में बताएं",
        subheading: "रियायती ऋण योजनाओं में वैधानिक आय सीमाएं और सामाजिक पात्रता मानदंड होते हैं।",
        incomeLabel: "सभी स्रोतों से वार्षिक पारिवारिक आय (रुपये)",
        incomeHelper:
          "एक महीने की नहीं, एक वर्ष की कुल पारिवारिक आय दर्ज करें। यदि वर्तमान में शून्य है तो 0 दर्ज करें।",
        communityLabel: "अनुसूचित जाति पात्रता स्व-घोषणा",
        communityHelper:
          "यह जानकारी अनुसूचित जाति के लाभार्थियों के लिए योजनाओं का मूल्यांकन करने में मदद करती है। आपका उत्तर एक स्व-घोषणा है; दस्तावेजों का सत्यापन बाद में अधिकृत संस्थान द्वारा किया जाता है।",
        communityOptions: {
          yes: "हाँ, मैं अनुसूचित जाति श्रेणी से संबंध रखता/रखती हूँ",
          no: "नहीं, मैं अन्य श्रेणी से हूँ",
          unsure: "मुझे निश्चित रूप से पता नहीं है",
          prefer_not_to_say: "बताना नहीं चाहते",
        },
        draftNotice:
          "आपके उत्तर इस ब्राउज़र सत्र में मूल्यांकन तैयार करने के लिए उपयोग किए जाते हैं। आप उन्हें किसी भी समय मिटा सकते हैं।",
      },
      step5: {
        heading: "आप किस क्षेत्र में अधिकृत चैनल पार्टनर खोजना चाहते हैं?",
        subheading: "हम इस स्थान का उपयोग उपयुक्त चैनल पार्टनर खोजने के लिए करते हैं।",
        stateLabel: "राज्य या केंद्र शासित प्रदेश",
        statePlaceholder: "राज्य चुनें",
        districtLabel: "जिला",
        districtPlaceholder: "जिला चुनें",
        pincodeLabel: "पिन कोड (वैकल्पिक)",
        pincodePlaceholder: "उदा. 442001",
        helper:
          "केवल 6 अंक। हम इस प्रारंभिक मूल्यांकन में जीपीएस या पूर्ण आवासीय पते का उपयोग नहीं करते हैं।",
      },
      step6: {
        heading: "अपने उत्तरों की जांच करें",
        subheading: "आगे बढ़ने से पहले अपनी जानकारी की समीक्षा करें। आप किसी भी अनुभाग को संपादित कर सकते हैं।",
        group1Title: "उद्देश्य और आवश्यकता",
        group2Title: "अनुमानित लागत",
        group3Title: "आय और सामाजिक पात्रता",
        group4Title: "स्थान",
        editBtn: "संपादित करें",
        notProvided: "प्रदान नहीं किया गया",
        confirmBtn: "पुष्टि करें और आगे बढ़ें",
        preliminaryNotice:
          "आप इन उत्तरों को कभी भी बदल सकते हैं। सिफारिशें प्रदान की गई जानकारी के आधार पर प्रारंभिक मार्गदर्शन होंगी।",
      },
      guided: {
        progressLabel: (current: number, total: number) => `प्रश्न ${current} / ${total}`,
        progressAriaLabel: (current: number, total: number) => `प्रश्न ${current} / ${total}`,
        viewGuidanceAction: "मार्गदर्शन देखें",
        evaluatingAction: "मूल्यांकन हो रहा है...",
        changeAction: "बदलें",
        reviewTitle: "अपने उत्तरों की समीक्षा करें",
        reviewSubtitle: "योजना मार्गदर्शन देखने से पहले अपनी दर्ज की गई जानकारी की जांच करें। आप किसी भी उत्तर को बदल सकते हैं।",
        reviewNotice: "सिफारिशें स्व-घोषित विवरणों पर आधारित प्रारंभिक मार्गदर्शन हैं। आधिकारिक ऋण स्वीकृति अधिकृत चैनल पार्टनर संस्थानों द्वारा दस्तावेजों के सत्यापन के बाद दी जाती है।",
        whyWeAskTitle: "हम यह क्यों पूछ रहे हैं",
        chooseOption: "एक विकल्प चुनें।",
        quickSelect: "त्वरित चयन:",
        questions: {
          purpose: {
            heading: "आपको किस उद्देश्य के लिए वित्तीय सहायता चाहिए?",
            guidance: "एक विकल्प चुनें।",
            whyWeAsk: "व्यावसायिक उद्यमों और शैक्षणिक पाठ्यक्रमों के लिए अलग-अलग सरकारी योजनाएं और वैधानिक प्रावधान लागू होते हैं।",
            businessLabel: "व्यवसाय या स्वरोजगार",
            businessDesc: "दुकान, कार्यशाला, मशीनरी खरीद, निर्माण इकाई या व्यावसायिक वाहन की स्थापना या विस्तार के लिए।",
            educationLabel: "व्यावसायिक या तकनीकी शिक्षा",
            educationDesc: "भारत या विदेश में मान्यता प्राप्त डिग्री, तकनीकी डिप्लोमा या व्यावसायिक शिक्षा के लिए।",
          },
          businessStage: {
            heading: "आपका व्यवसाय किस स्तर पर है?",
            guidance: "एक विकल्प चुनें।",
            whyWeAsk: "नया व्यवसाय शुरू करने और मौजूदा व्यवसाय के विस्तार के लिए योजनाओं में अलग-अलग ऋण सीमाएं और नियम होते हैं।",
            newLabel: "नया व्यवसाय शुरू करना",
            newDesc: "एक नया उद्यम स्थापित करना, शुरुआती स्टॉक, उपकरण या दुकान की व्यवस्था करना।",
            expandingLabel: "मौजूदा व्यवसाय का विस्तार",
            expandingDesc: "चल रहे व्यवसाय को बड़ा करना, अतिरिक्त मशीनरी जोड़ना, या कार्यशील पूंजी बढ़ाना।",
          },
          businessActivity: {
            heading: "अपने व्यवसाय या प्रस्तावित गतिविधि का विवरण दें",
            guidance: "संक्षेप में लिखें कि आपका उद्यम क्या उत्पादन, सेवा या बिक्री करता है।",
            whyWeAsk: "आपकी व्यावसायिक गतिविधि का विवरण यह जांचने में मदद करता है कि यह योजना के समर्थित क्षेत्रों में आती है।",
            descLabel: "गतिविधि का विवरण",
            descPlaceholder: "उदा. सिलाई की दुकान, आटा चक्की, डेयरी फार्मिंग, बिजली उपकरण मरम्मत",
            categoryLabel: "व्यापक गतिविधि श्रेणी (वैकल्पिक)",
            categoryPlaceholder: "श्रेणी चुनें या छोड़ दें",
          },
          educationCourse: {
            heading: "आप किस पाठ्यक्रम या कार्यक्रम की पढ़ाई कर रहे हैं?",
            guidance: "अपनी डिग्री, तकनीकी डिप्लोमा या प्रमाणपत्र कार्यक्रम का नाम दर्ज करें।",
            whyWeAsk: "पाठ्यक्रम का विवरण यह जांचने में मदद करता है कि यह रियायती शिक्षा ऋण योजना के अंतर्गत मान्यता प्राप्त है।",
            courseLabel: "पाठ्यक्रम या डिग्री का नाम",
            coursePlaceholder: "उदा. बी.टेक कंप्यूटर साइंस, एमबीबीएस, फार्मेसी डिप्लोमा",
            institutionLabel: "संस्थान या कॉलेज का नाम (वैकल्पिक)",
            institutionPlaceholder: "उदा. राजकीय पॉलिटेक्निक, दिल्ली विश्वविद्यालय",
            durationLabel: "अपेक्षित अवधि महीनों में (वैकल्पिक)",
            durationPlaceholder: "उदा. 36 (3 वर्ष के लिए) या 48 (4 वर्ष के लिए)",
          },
          educationLevel: {
            heading: "यह किस स्तर का पाठ्यक्रम है?",
            guidance: "एक विकल्प चुनें।",
            whyWeAsk: "डिप्लोमा, स्नातक और उच्चतर अध्ययनों के लिए ऋण सीमा और ब्याज अनुदान के नियम अलग-अलग होते हैं।",
          },
          educationAdmission: {
            heading: "आपके प्रवेश की वर्तमान स्थिति क्या है?",
            guidance: "एक विकल्प चुनें।",
            whyWeAsk: "ऋण वितरण प्रवेश पक्का होने के बाद होता है, लेकिन यह मार्गदर्शन आपको पहले से तैयार होने में सहायता करता है।",
          },
          educationLocation: {
            heading: "आप कहाँ अध्ययन करेंगे?",
            guidance: "एक विकल्प चुनें।",
            whyWeAsk: "भारत में अध्ययन और विदेश में अध्ययन के लिए अलग-अलग ऋण सीमाएं और विशेष योजनाएं होती हैं।",
          },
          cost: {
            businessHeading: "अनुमानित कुल परियोजना लागत कितनी है?",
            educationHeading: "शिक्षा की अनुमानित कुल लागत कितनी है?",
            guidance: "मशीनरी, उपकरण, दुकान सेटअप या पूरी फीस और छात्रावास का अपेक्षित कुल खर्च दर्ज करें।",
            whyWeAsk: "योजनाएं परियोजना लागत के अनुसार अधिकतम 90% से 100% तक ऋण सहायता प्रदान करती हैं।",
            amountLabel: "कुल अनुमानित लागत (₹)",
            borrowingLabel: "अपेक्षित ऋण राशि (वैकल्पिक)",
            borrowingPlaceholder: "यदि निश्चित न हो तो खाली छोड़ें",
            borrowingHelp: "ऋण राशि कुल लागत से अधिक नहीं हो सकती। शेष राशि लाभार्थी की स्वयं की हिस्सेदारी होती है।",
            borrowingErrorExceeded: "अपेक्षित ऋण राशि कुल अनुमानित लागत से अधिक नहीं हो सकती।",
          },
          income: {
            heading: "आपकी वार्षिक पारिवारिक आय कितनी है?",
            guidance: "सभी स्रोतों से पूरे एक वर्ष की पारिवारिक आय दर्ज करें। यदि वर्तमान में कोई आय नहीं है तो 0 दर्ज करें।",
            whyWeAsk: "रियायती ऋण योजनाओं में प्राथमिकता वाले कमजोर परिवारों के लिए आय की वैधानिक सीमाएं निर्धारित होती हैं।",
            amountLabel: "वार्षिक पारिवारिक आय (₹)",
            zeroIncomeNote: "* ₹5 लाख से अधिक आय होने पर भी यह फॉर्म अवरुद्ध नहीं होता; संबंधित योजना सीमाएं परिणाम में स्पष्ट दिखाई जाएंगी।",
          },
          community: {
            heading: "क्या आप अनुसूचित जाति (SC) समुदाय से संबंधित हैं?",
            guidance: "यह एक प्राथमिक स्व-घोषणा है। किसी भी दस्तावेज को अभी अपलोड करने की आवश्यकता नहीं है।",
            whyWeAsk: "NSFDC की योजनाएं विशेष रूप से अनुसूचित जाति के उद्यमियों और छात्रों के उत्थान के लिए रियायती शर्तों पर बनाई गई हैं।",
            privacyNotice: "हम कोई भी जाति प्रमाण पत्र संख्या, आधार या संवेदनशील पहचान पत्र नहीं मांगते हैं।",
            options: {
              yes: "हाँ, मैं अनुसूचित जाति (SC) श्रेणी से हूँ",
              no: "नहीं, मैं अन्य श्रेणी से हूँ",
              unsure: "मुझे निश्चित जानकारी नहीं है",
              prefer_not_to_say: "बताना नहीं चाहते",
            },
          },
          location: {
            heading: "आप किस राज्य और जिले में स्थित हैं?",
            guidance: "अपना राज्य और जिला चुनें ताकि हम आपके निकटतम अधिकृत चैनल पार्टनर और राज्य निगम शाखाएं खोज सकें।",
            whyWeAsk: "राज्य चैनलाइजिंग एजेंसियां (SCAs) और बैंक शाखाएं राज्य और जिले के आधार पर संचालित होती हैं।",
            stateLabel: "राज्य / केंद्र शासित प्रदेश",
            statePlaceholder: "राज्य चुनें",
            districtLabel: "जिला",
            districtPlaceholder: "जिला चुनें",
            pincodeLabel: "पिन कोड (वैकल्पिक)",
            pincodePlaceholder: "उदा. 442001",
            privacyNotice: "हम जीपीएस या घर का पता नहीं पूछते; केवल निकटतम बैंक शाखा खोजने के लिए जिले का उपयोग किया जाता है।",
          },
        },
        validation: {
          purposeRequired: "बताएं कि आपको किस उद्देश्य के लिए वित्तीय सहायता चाहिए।",
          businessStageRequired: "चुनें कि आप नया व्यवसाय शुरू कर रहे हैं या मौजूदा का विस्तार कर रहे हैं।",
          businessDescriptionRequired: "अपने व्यवसाय या गतिविधि का विवरण दर्ज करें (कम से कम 3 अक्षर)।",
          courseNameRequired: "अपने पाठ्यक्रम या डिग्री का नाम दर्ज करें (कम से कम 2 अक्षर)।",
          studyLevelRequired: "अपने अध्ययन का स्तर चुनें।",
          admissionStatusRequired: "अपनी वर्तमान प्रवेश स्थिति चुनें।",
          studyLocationRequired: "चुनें कि आप कहाँ अध्ययन करेंगे।",
          costRequired: "शून्य से अधिक वैध अनुमानित लागत दर्ज करें।",
          borrowingInvalid: "अपेक्षित ऋण राशि कुल अनुमानित लागत से अधिक नहीं हो सकती।",
          incomeRequired: "अपनी वार्षिक पारिवारिक आय दर्ज करें (यदि कोई नहीं है तो 0 दर्ज करें)।",
          communityRequired: "सामुदायिक स्व-घोषणा का एक विकल्प चुनें।",
          stateRequired: "अपना राज्य चुनें।",
          districtRequired: "अपना जिला चुनें।",
          pincodeInvalid: "पिन कोड 6 अंकों का होना चाहिए।",
        },
      },
    },
    results: {
      badge: "पात्रता मूल्यांकन",
      heading: "आपकी आवश्यकताओं के अनुसार योजना मार्गदर्शन",
      subheading:
        "आधिकारिक NSFDC और राज्य ऋण दिशानिर्देशों के तहत स्पष्ट रूप से मूल्यांकित। यह स्वचालित ऋण स्वीकृति नहीं है।",
      evaluatingText: "आधिकारिक योजना नीतियों के विरुद्ध आपके उत्तरों का मूल्यांकन किया जा रहा है...",
      editAnswersBtn: "मूल्यांकन उत्तर बदलें",
      startNewBtn: "नया मूल्यांकन शुरू करें",
      topPickBadge: "अनुशंसित योजना",
      officialVerifiedBadge: "सत्यापित आधिकारिक नीति",
      demonstrationBadge: "प्रदर्शनात्मक योजना",
      providerLabel: "ऋण प्रदाता",
      estimatedAssistance: "रियायती वित्तीय संरचना",
      maxLoanLabel: "सांकेतिक ऋण सहायता (अधिकतम 90%)",
      promoterContributionLabel: "लाभार्थी हिस्सेदारी (न्यूनतम 10%)",
      interestRateLabel: "रियायती ब्याज दर",
      moratoriumLabel: "छूट अवधि (मोरेटोरियम)",
      tenureLabel: "अधिकतम पुनर्भुगतान अवधि",
      yearsSuffix: "वर्ष",
      viewCalculationCta: "कैलकुलेटर में पुनर्भुगतान देखें",
      findPartnerCta: "अधिकृत चैनल पार्टनर खोजें",
      assessmentDisclosureTitle: "हमने इस योजना का मूल्यांकन कैसे किया",
      assessmentDisclosureSub: "आपकी घोषित प्रोफ़ाइल के विरुद्ध मूल्यांकित वैधानिक नियम।",
      passedRulesTitle: "सत्यापित शर्तें जो पूरी हुईं",
      failedRulesTitle: "शर्तें जो पूरी नहीं हुईं",
      unknownRulesTitle: "शर्तें जिनकी पुष्टि आवश्यक है",
      clauseRefLabel: "नीति खंड",
      sourcesTitle: "नीति स्रोत एवं सत्यापन विवरण",
      documentRef: "दस्तावेज़ संदर्भ",
      officialUrl: "आधिकारिक NSFDC नीति लिंक",
      effectiveDate: "प्रभावी तिथि",
      sourceCheckedDate: "सिस्टम द्वारा अंतिम सत्यापन",
      verificationStatus: "सत्यापन स्थिति",
      openOfficialDoc: "आधिकारिक दिशानिर्देश खोलें",
      alternativesTitle: "अन्य संभावित रूप से पात्र योजनाएं",
      alternativesSub: "अतिरिक्त विकल्प जो आपके घोषित मानदंडों के अनुकूल हैं।",
      needsInfoTitle: "योजनाएं जिन्हें अतिरिक्त पुष्टि की आवश्यकता है",
      needsInfoSub: "ये योजनाएं विशिष्ट दस्तावेजी पुष्टि के बाद उपयुक्त हो सकती हैं।",
      ineligibleTitle: "योजनाएं जो वर्तमान मानदंडों से बाहर हैं",
      ineligibleSub: "स्पष्ट वित्तीय मार्गदर्शन के लिए कारणों सहित प्रदर्शित।",
      whyNotLabel: "वर्तमान में उपयुक्त न होने का कारण",
      missingRequirements: "अपेक्षित सत्यापन",
      noMatchTitle: "कोई सीधा मेल खाने वाली योजना नहीं मिली",
      noMatchDesc:
        "आपकी अनुमानित लागत या आय के आधार पर कोई मानक योजना सीधे मेल नहीं खाती।",
      noMatchAction1: "मूल्यांकन में अपनी परियोजना लागत या आय विवरण समायोजित करें",
      noMatchAction2: "विशेष राज्य सहायता कार्यक्रमों के लिए अधिकृत चैनल पार्टनर से संपर्क करें",
      incompleteTitle: "सत्र में कोई मूल्यांकन नहीं मिला",
      incompleteDesc:
        "स्पष्ट योजना सिफारिशें प्राप्त करने के लिए कृपया पहले मूल्यांकन पूरा करें।",
      takeAssessmentBtn: "मूल्यांकन शुरू करें",
      disclaimerBadge: "वैधानिक मार्गदर्शन सूचना",
      footerDisclaimer:
        "SAHAYAK AI की सिफारिशें स्व-घोषित जानकारी पर आधारित प्रारंभिक निर्णय सहायता हैं। अंतिम ऋण स्वीकृति और वितरण केवल अधिकृत चैनल पार्टनर संस्थानों द्वारा किया जाता है।",
      engineTraceBadge: "नियम इंजन ट्रेस",
      evaluatedOn: "मूल्यांकन तिथि",

      // Explainable Financial Statement & Decision Redesign Keys (Hindi)
      preliminaryStatusLabel: "प्रारंभिक मार्गदर्शन",
      preliminaryDisclaimer:
        "यह परिणाम प्रारंभिक मार्गदर्शन है, ऋण स्वीकृति नहीं। अंतिम पात्रता, सत्यापन, स्वीकृति और संवितरण का निर्णय अधिकृत ऋणदाता संस्थान द्वारा लिया जाता है।",
      singleMatchHeading: "यह योजना आपकी आवश्यकता के लिए उपयुक्त हो सकती है।",
      singleMatchSub:
        "आपके द्वारा प्रदान की गई जानकारी के आधार पर, योजना के प्रारंभिक मानदंड आपकी स्थिति के अनुकूल प्रतीत होते हैं।",
      multipleMatchHeading: "ये योजनाएं आपकी आवश्यकता के लिए उपयुक्त हो सकती हैं।",
      multipleMatchSub:
        "आपके द्वारा प्रदान की गई जानकारी से एक से अधिक योजनाएं मेल खाती प्रतीत होती हैं।",
      noMatchHeading: "प्रदान की गई जानकारी से कोई मेल खाने वाली योजना नहीं मिली।",
      noMatchSub:
        "इसका अर्थ यह नहीं है कि आप सभी सहायता के लिए अपात्र हैं। अपने उत्तरों की समीक्षा करें या किसी अधिकृत चैनल पार्टनर से संपर्क करें।",
      needsInfoHeading: "मार्गदर्शन प्रदान करने के लिए हमें और जानकारी की आवश्यकता है।",
      needsInfoSubNew:
        "प्रयोज्यता निर्धारित करने से पहले कुछ आधिकारिक मानदंडों के लिए अतिरिक्त पुष्टि की आवश्यकता है।",
      errorHeading: "हम आपका मार्गदर्शन तैयार नहीं कर सके।",
      errorSub:
        "एक अस्थायी तकनीकी समस्या के कारण आपके योजना मूल्यांकन की तैयारी रुक गई।",
      retryBtn: "पुनः प्रयास करें",
      whyMatchedTitle: "यह योजना क्यों उपयुक्त पाई गई",
      whyMatchedNotice:
        "लागू मानदंडों का सत्यापन अधिकृत चैनल पार्टनर या ऋणदाता बैंक द्वारा दस्तावेजों के माध्यम से किया जाएगा।",
      userAnswerLabel: "आपने दर्ज / चयन किया",
      criterionLabel: "योजना का मानदंड",
      comparisonResultLabel: "परिणाम",
      statusMatched: "योजना के समर्थित उद्देश्य और मापदंडों के अनुकूल",
      statusNeedsVerification: "शाखा में दस्तावेजी सत्यापन की आवश्यकता है",
      statusNotAssessed: "इस प्रारंभिक मूल्यांकन में जांचा नहीं गया",
      financialStatementTitle: "अनुमानित वित्तीय विवरण",
      financialStatementSub:
        "घोषित परियोजना लागत और आधिकारिक योजना सीमाओं पर आधारित समेकित प्रारंभिक आवंटन।",
      projectCostLabel: "परियोजना लागत",
      estimatedLoanLabel: "अनुमानित ऋण राशि",
      applicantContributionLabel: "अनुमानित आवेदक अंशदान",
      totalLabel: "कुल",
      financingShareLabel: "वित्तपोषण हिस्सेदारी",
      applicantShareLabel: "आवेदक हिस्सेदारी",
      calculationFormulaTitle: "यह अनुमान कैसे निकाला गया",
      loanFormulaLabel: "अनुमानित ऋण राशि का सूत्र",
      contributionFormulaLabel: "आवेदक अंशदान का सूत्र",
      schemeCapNoticePrefix: "पर परिकलित वित्तपोषण",
      schemeCapNoticeSuffix: "योजना की अधिकतम सीमा लागू की गई",
      repaymentTitle: "अनुमानित पुनर्भुगतान",
      repaymentSub:
        "नियमित मासिक घटते मूलधन पुनर्भुगतान मानकर सांकेतिक किस्त।",
      interestRateType: "वार्षिक (रियायती, घटते मूलधन पर)",
      repaymentTermLabel: "पुनर्भुगतान अवधि",
      repaymentFrequencyLabel: "पुनर्भुगतान आवृत्ति",
      monthlyFrequency: "मासिक",
      moratoriumGraceLabel: "मोरेटोरियम (छूट अवधि)",
      moratoriumNote:
        "मूलधन का पुनर्भुगतान मोरेटोरियम अवधि के बाद शुरू होता है। मोरेटोरियम के दौरान ब्याज की व्यवस्था ऋणदाता की शर्तों पर निर्भर करती है।",
      estimatedMonthlyInstalmentLabel: "अनुमानित मासिक किस्त",
      estimatedTotalRepaymentLabel: "अनुमानित कुल पुनर्भुगतान",
      estimatedTotalInterestLabel: "अनुमानित कुल ब्याज",
      repaymentDisclaimer:
        "यह वित्तीय योजना के लिए एक अनुमान है, अंतिम प्रस्ताव नहीं। ऋणदाता संस्थान लागू ब्याज दर और अंतिम स्वीकृति शर्तों का निर्णय लेते हैं।",
      calculationUnavailableHeading: "इस योजना के लिए पुनर्भुगतान गणना उपलब्ध नहीं है",
      calculationUnavailableNotice:
        "ऋण राशि या अवधि के आवश्यक मापदंड उपलब्ध न होने के कारण पुनर्भुगतान की गणना नहीं की जा सकती।",
      assumptionsTitle: "उपयोग की गई मान्यताएँ",
      informationSourceTitle: "जानकारी का स्रोत",
      sourceAuthorityLabel: "योजना प्राधिकरण",
      sourceDocumentLabel: "दिशानिर्देश या परिपत्र",
      effectiveDateLabel: "प्रभावी तिथि",
      lastReviewedLabel: "अंतिम समीक्षा तिथि",
      sourceNotice:
        "यह प्रोटोटाइप सार्वजनिक मार्गदर्शन को संक्षेप में प्रस्तुत करता है। अधिकृत ऋणदाता संस्थान वर्तमान में लागू शर्तों की पुष्टि करेगा।",
      sourceUnavailableNotice:
        "इस प्रोटोटाइप में वर्तमान में कोई आधिकारिक स्रोत लिंक उपलब्ध नहीं है। अधिकृत चैनल पार्टनर से नवीनतम शर्तों की पुष्टि करें।",
      demoNotice:
        "यह योजना उदाहरण और प्रोटोटाइप सत्यापन के लिए प्रदर्शनात्मक डेटा का उपयोग करती है।",
      documentsTitle: "तैयार रखने वाले दस्तावेज़",
      documentsSub:
        "शाखा में मूल्यांकन और सत्यापन के लिए इन दस्तावेजों को तैयार रखें।",
      docCategoryIdentity: "पहचान एवं पात्रता",
      docCategoryBusiness: "व्यवसाय एवं उद्यम",
      docCategoryEducation: "शिक्षा एवं संस्थान",
      docStatusRequired: "सामान्यतः आवश्यक",
      docStatusRequested: "ऋणदाता मांग सकता है",
      documentsDisclaimer:
        "अधिकृत ऋणदाता संस्थान अंतिम दस्तावेज़ सूची की पुष्टि करेगा।",
      primaryNextActionTitle: "अधिकृत चैनल पार्टनर खोजें",
      primaryNextActionSub:
        "एक चैनल पार्टनर आपके दस्तावेजों का सत्यापन कर सकता है, वर्तमान शर्तों को समझा सकता है और औपचारिक आवेदन प्रक्रिया में आपका मार्गदर्शन कर सकता है।",
      secondaryReviewAnswers: "उत्तर देखें या बदलें",
      secondaryEstimateDifferent: "विभिन्न मानों के साथ अनुमान लगाएं",
      secondaryPrint: "यह मार्गदर्शन प्रिंट करें",
      secondaryStartAgain: "पुनः प्रारंभ करें",
      multipleMatchesCompareTitle: "मेल खाने वाली योजनाओं की तुलना करें",
      rankingSelectionExplanation:
        "प्राथमिक योजना की पहचान वैधानिक सकारात्मक मानदंडों, उद्देश्य के अनुकूल होने और आधिकारिक नीति स्थिति के आधार पर निर्धारित की जाती है।",
      compareColumnScheme: "योजना",
      compareColumnMaxLoan: "अधिकतम समर्थित राशि",
      compareColumnInterest: "सांकेतिक ब्याज दर",
      compareColumnTenure: "पुनर्भुगतान अवधि",
      compareColumnPurpose: "उद्देश्य",
    },
    calculator: {
      pageTitle: "अपने पुनर्भुगतान को समझें",
      pageDescription: "योजना-विशिष्ट ऋण सीमा, अनिवार्य प्रमोटर मार्जिन, मोरेटोरियम छूट अवधि और परिशोधन कार्यक्रम का अनुकरण करें।",
      badge: "वित्तीय निर्णय सहायता",
      estimatedNotApproved: "अनुमानित, स्वीकृत नहीं",
      verifiedPolicy: "सत्यापित वैधानिक नीति",
      demonstrationMode: "प्रदर्शनात्मक सिमुलेशन मोड",
      changeScheme: "योजना बदलें",
      returnToResults: "सिफारिशों पर वापस जाएं",
      editAssessment: "मूल्यांकन में संपादित करें",
      findPartnersCta: "अधिकृत चैनल पार्टनर खोजें",
      inputsTitle: "ऋण मानदंड एवं विकल्प",
      inputsSub: "नीति सीमाओं के भीतर अनुरोधित ऋण, अवधि और छूट शर्तों को समायोजित करें।",
      schemeSelectLabel: "चयनित रियायती योजना",
      projectCostLabel: "कुल परियोजना / पाठ्यक्रम लागत",
      projectCostHelp: "आपके मूल्यांकन की आवश्यकता से पुष्टीकृत।",
      requestedLoanLabel: "अनुरोधित ऋण राशि",
      requestedLoanHelp: "वांछित ऋण राशि दर्ज करें (अधिकतम वैधानिक सीमा तक)।",
      tenureLabel: "पुनर्भुगतान अवधि",
      tenureHelp: "छूट अवधि के बाद नियमित मूलधन किस्तों की समयावधि।",
      moratoriumLabel: "मोरेटोरियम (छूट अवधि)",
      moratoriumHelp: "नियमित मूलधन किस्तें शुरू होने से पहले की छूट अवधि।",
      frequencyLabel: "पुनर्भुगतान आवृत्ति",
      methodLabel: "पुनर्भुगतान विधि",
      treatmentLabel: "मोरेटोरियम ब्याज व्यवस्था",
      equalInstalmentOption: "समान मासिक किस्त (वार्षिकी EMI)",
      equalPrincipalOption: "समान मूलधन (घटती EMI)",
      monthlyOption: "मासिक",
      quarterlyOption: "त्रैमासिक",
      treatmentCapitalize: "ब्याज को ऋण शेष में जोड़ें (पूंजीकृत)",
      treatmentInterestOnly: "मासिक ब्याज का भुगतान करें",
      treatmentAccrueSimple: "साधारण संचय (अचक्रवृद्धि)",
      treatmentNone: "शून्य छूट (तत्काल प्रारंभ)",
      resetDefaults: "डिफ़ॉल्ट मानों पर रीसेट करें",
      recalculating: "अनुमान की पुनः गणना की जा रही है...",
      outOfDateBanner: "मानदंड बदल गए हैं। अद्यतन अनुमान लोड हो रहा है...",
      summaryTitle: "पुनर्भुगतान अनुमान सारांश",
      summarySub: "वैधानिक रियायती ऋण नीति पर आधारित प्रारंभिक वित्तीय प्रक्षेपण।",
      eligibleLoan: "अनुमत ऋण राशि",
      promoterEquity: "अनिवार्य लाभार्थी अंशदान",
      fundingGap: "अन्य स्रोतों से जुटाई जाने वाली राशि",
      indicativeInstalment: "अनुमानित किस्त",
      monthlyInstalment: "मासिक समान किस्त (EMI)",
      quarterlyInstalment: "त्रैमासिक किस्त",
      firstInstalmentNote: "प्रथम किस्त राशि",
      finalInstalmentNote: "अंतिम किस्त राउंडिंग हेतु समायोजित",
      annualInterestRate: "रियायती ब्याज दर",
      totalLoanRepayment: "कुल अनुमानित ऋण पुनर्भुगतान",
      totalInterest: "कुल अनुमानित ब्याज",
      splitBarTitle: "वित्तपोषण अनुपात एवं पूंजी विभाजन",
      splitBarLoan: "रियायती ऋण",
      splitBarEquity: "प्रमोटर अंशदान",
      splitBarOther: "अन्य स्रोत",
      timelineTitle: "ऋण जीवनचक्र समयरेखा",
      timelineGracePhase: "चरण 1: छूट अवधि (मोरेटोरियम)",
      timelineRepayPhase: "चरण 2: परिशोधन एवं पुनर्भुगतान",
      scheduleTitle: "परिशोधन पुनर्भुगतान अनुसूची",
      scheduleSub: "प्रत्येक अवधि के मूलधन भुगतान और ब्याज का विस्तृत विवरण।",
      colPeriod: "अवधि",
      colOpening: "प्रारंभिक शेष",
      colPayment: "किस्त राशि",
      colPrincipal: "मूलधन घटक",
      colInterest: "ब्याज घटक",
      colClosing: "अंतिम शेष",
      moratoriumTag: "छूट",
      repaymentTag: "किस्त",
      downloadCsv: "CSV अनुसूची डाउनलोड करें",
      printSchedule: "प्रिंट सारांश",
      expandSchedule: "पूरी अनुसूची देखें",
      collapseSchedule: "कम पंक्तियां देखें",
      showingFirst: "प्रदर्शित पहली",
      assumptionsTitle: "यह अनुमान कैसे तैयार किया गया",
      assumptionsSub: "वैधानिक नियम, ब्याज दर चयन का आधार और सिमुलेशन मान्यताएं।",
      exclusionsTitle: "अपवर्जित शुल्क एवं प्रभार",
      sourcesTitle: "सत्यापित नीति संदर्भ एवं अंतिम जांच तिथि",
      parameterOriginsTitle: "मापदंड स्रोत एवं सत्यापन स्थिति",
      preliminaryNotice: "यह गणना स्व-घोषित जानकारी पर आधारित प्रारंभिक वित्तीय निर्णय सहायता है और किसी बैंक का औपचारिक ऋण प्रस्ताव नहीं है।",
      noSchemeTitle: "कोई योजना चयनित नहीं",
      noSchemeDesc: "नीचे दी गई रियायती योजनाओं में से चुनें या अनुकूलित मार्गदर्शन के लिए मूल्यांकन पूरा करें।",
      takeAssessmentBtn: "मूल्यांकन शुरू करें",
      exploreSchemesBtn: "उपलब्ध योजनाएं देखें",
      errorTitle: "पुनर्भुगतान की गणना करने में असमर्थ",
      retryBtn: "पुनः प्रयास करें",
      clampedWarningTitle: "वैधानिक ऋण सीमा लागू",
      clampedWarningDesc: "आपकी अनुरोधित ऋण राशि इस योजना की अधिकतम अनुमत सीमा से अधिक थी, इसलिए इसे वैधानिक सीमा तक सीमित कर दिया गया है।",
    },
    partners: {
      pageTitle: "अधिकृत चैनल पार्टनर खोजें",
      pageDescription: "उन अधिकृत वित्तीय संस्थानों को खोजें जो आपकी चयनित योजना का समर्थन करते हैं और आपके क्षेत्र में सेवा प्रदान करते हैं।",
      badge: "नीति एवं निकटता रूटिंग",
      routingNoticeTitle: "मान्यता प्राप्त चैनल वित्त रूटिंग",
      routingNoticeDesc: "केंद्रीय मंत्रालयों द्वारा सीधे ऋण आवेदन स्वीकार नहीं किए जाते हैं; धनराशि केवल मान्यता प्राप्त राज्य चैनलाइजिंग एजेंसियों (SCAs), सार्वजनिक क्षेत्र के बैंकों (PSBs) और क्षेत्रीय ग्रामीण बैंकों (RRBs) के माध्यम से वितरित की जाती है।",
      selectedSchemeLabel: "चयनित योजना",
      locationLabel: "आपका खोज स्थान",
      changeLocationBtn: "स्थान बदलें",
      searchRadiusLabel: "खोज का दायरा",
      radiusKm: "किमी",
      filterAll: "सभी शाखाएं",
      filterSca: "राज्य एजेंसियां (SCA)",
      filterPsb: "सरकारी बैंक (PSB)",
      filterRrb: "ग्रामीण बैंक (RRB)",
      filterEligible: "केवल पात्र",
      searchPlaceholder: "शाखा का नाम, संस्था या जिले के अनुसार खोजें...",
      resultsCount: "पात्र पार्टनर कार्यालय मिले",
      topRecommendedBadge: "शीर्ष अनुशंसित",
      eligibleBadge: "रूटिंग हेतु पात्र",
      unverifiedBadge: "असत्यापित / शाखा से संपर्क करें",
      whyThisPartnerTitle: "यह पार्टनर क्यों चुना गया?",
      approxDistance: "अनुमानित सीधी दूरी",
      observedDate: "अवलोकन तिथि",
      callAction: "शाखा को कॉल करें",
      callDisabled: "नमूना संस्था: कॉल अक्षम",
      directionsAction: "दिशा-निर्देश प्राप्त करें",
      directionsDisabled: "नमूना निर्देशांक: नेविगेशन अक्षम",
      choosePartnerAction: "यह पार्टनर चुनें",
      chosenPartnerBadge: "आवेदन हेतु चयनित",
      mapTab: "मानचित्र दृश्य",
      listTab: "सूची दृश्य",
      mapViewTitle: "मान्यता प्राप्त शाखा मानचित्र",
      mapDisclaimer: "मान्यता प्राप्त शाखाओं और अनुमानित दूरी को दर्शाने वाला इंटरैक्टिव ओपनस्ट्रीटमैप दृश्य।",
      mapUnavailableTitle: "मानचित्र अनुपलब्ध",
      mapUnavailableDesc: "लाइव मानचित्र टाइलें लोड नहीं की जा सकीं। आपकी पार्टनर सूची और चयन पूरी तरह कार्यात्मक हैं।",
      unverifiedSectionTitle: "अतिरिक्त निर्देशिका कार्यालय",
      unverifiedSectionSub: "निर्देशिका में सूचीबद्ध कार्यालय जिनके वर्तमान परिचालन कोटे या निर्देशांकों की स्वचालित पुष्टि नहीं हो सकी।",
      noPartnersTitle: "इस दायरे में कोई पात्र पार्टनर नहीं मिला",
      noPartnersDesc: "वर्तमान रिकॉर्ड में कोई भी मान्यता प्राप्त शाखा आपके चयनित दायरे और योजना से मेल नहीं खाती।",
      expandRadiusAction: "खोज का दायरा 100 किमी तक बढ़ाएं",
      noSchemeNoticeTitle: "कोई योजना चयनित नहीं है",
      noSchemeNoticeDesc: "कृपया संबंधित शाखाएं देखने के लिए रियायती योजना चुनें या मूल्यांकन पूरा करें।",
      takeAssessmentBtn: "मूल्यांकन पूरा करें",
      disclaimerText: "प्रारंभिक चैनल पार्टनर रूटिंग केवल सलाहकारी है। अंतिम ऋण स्वीकृति, मूल्यांकन और कोटा संवितरण मान्यता प्राप्त चैनल पार्टनर और मंत्रालय के दिशानिर्देशों के अधीन है।",
      continueToNextSteps: "आवश्यक दस्तावेजों पर आगे बढ़ें",
      backToCalculator: "पुनर्भुगतान अनुमान पर वापस जाएं",
    },
    nextSteps: {
      pageTitle: "आपका मार्गदर्शन सारांश एवं दस्तावेज़ तैयारी",
      pageSubtitle:
        "अपनी चयनित चैनल पार्टनर शाखा में जाने से पहले इन भौतिक दस्तावेजों को तैयार रखें। इससे शाखा के अनावश्यक फेरों से बचा जा सकेगा और सत्यापन शीघ्र होगा।",
      badge: "आवेदन तैयारी",
      printSummary: "सारांश प्रिंट करें",
      editAnswers: "मूल्यांकन उत्तर बदलें",
      guidanceSummaryTitle: "SAHAYAK AI मार्गदर्शन सारांश",
      generatedOn: "तैयार किया गया",
      beneficiaryCategory: "लाभार्थी श्रेणी",
      declaredSC: "अनुसूचित जाति (स्व-घोषित)",
      requirementPurpose: "आवश्यकता का उद्देश्य",
      estimatedOutlay: "अनुमानित कुल लागत",
      familyIncome: "वार्षिक पारिवारिक आय",
      recommendedScheme: "अनुशंसित योजना",
      selectedPartner: "लक्षित चैनल पार्टनर",
      changePartner: "पार्टनर बदलें",
      selectPartner: "पार्टनर चुनें",
      noPartnerSelected: "राज्य चैनलाइजिंग एजेंसी (SCA) या मान्यता प्राप्त बैंक शाखा",
      checklistTitle: "भौतिक दस्तावेज़ चेकलिस्ट",
      checklistSubtitle: "शाखा में जाने से पहले उन दस्तावेजों पर निशान लगाएं जो आपके पास तैयार हैं।",
      preparedBadge: "तैयार",
      verificationNoticeTitle: "भौतिक सत्यापन प्रोटोकॉल",
      verificationNoticeDesc:
        "यह सूची आधिकारिक NSFDC और राज्य ऋण दिशानिर्देशों के तहत मानक आवश्यकताओं को दर्शाती है। विशिष्ट शाखाएं औपचारिक मूल्यांकन के दौरान अतिरिक्त रिकॉर्ड मांग सकती हैं।",
      handoffTitle: "चैनल पार्टनर शाखा में आगे क्या होगा?",
      handoffIntro:
        "जब आप अनुशंसित चैनल पार्टनर (राज्य एजेंसी या बैंक शाखा) में जाएंगे:",
      handoffStep1:
        "शाखा अधिकारी को यह SAHAYAK AI मार्गदर्शन सारांश प्रस्तुत करें और विशिष्ट योजना कोड बताएं।",
      handoffStep2:
        "सत्यापन के लिए भौतिक जाति प्रमाण पत्र, आय प्रमाण पत्र और परियोजना कोटेशन/चालान जमा करें।",
      handoffStep3:
        "शाखा आधिकारिक आवेदन पत्र जारी करेगी, क्षेत्र मूल्यांकन करेगी और ऋण दिशानिर्देशों के अनुसार स्वीकृति तय करेगी।",
      returnToPartners: "चैनल पार्टनर निर्देशिका पर वापस जाएं",
      returnToResults: "योजना मूल्यांकन परिणाम पर वापस जाएं",
      demoNotice: "प्रदर्शनात्मक उद्देश्यों के लिए प्रदर्शित नमूना संस्थान",
      emptyStateTitle: "सत्र में कोई मूल्यांकन नहीं मिला",
      emptyStateDesc:
        "व्यक्तिगत मार्गदर्शन सारांश और दस्तावेज़ चेकलिस्ट देखने के लिए कृपया पहले मूल्यांकन पूरा करें।",
      startAssessmentBtn: "मूल्यांकन शुरू करें",
    },
  },
};

