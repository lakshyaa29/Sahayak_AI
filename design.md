# SAHAYAK AI — Product Design Specification

## 1. Product Experience

SAHAYAK AI is a multilingual decision-support platform that helps eligible Scheduled Caste beneficiaries:

1. Find the most suitable financial or educational loan scheme.
2. Understand the expected loan amount, contribution, interest, moratorium, and repayment.
3. Locate an authorized and operationally eligible Channel Partner.
4. Prepare the documents and next steps required to continue.

The product must feel trustworthy like a public service, clear like a guided assistant, and polished like a modern financial application.

### Core design principle

> One clear question, one understandable decision, and one actionable next step.

### Experience qualities

- **Trustworthy:** Show rule sources, update dates, assumptions, and limitations.
- **Simple:** Use plain language and progressive disclosure.
- **Inclusive:** Support regional languages, voice, keyboard navigation, and screen readers.
- **Transparent:** Explain why a scheme or partner was selected.
- **Resilient:** Work well on low-end phones and weak networks.
- **Safe:** Clearly distinguish preliminary guidance from formal loan approval.

---

## 2. Target Users

### Primary user — Beneficiary

A person seeking assistance for a small business, equipment, self-employment, professional education, or another supported purpose. The user may have limited financial knowledge, English proficiency, digital experience, or network connectivity.

### Secondary user — Assisted operator

A field worker, kiosk operator, NGO representative, or Channel Partner employee helping a beneficiary complete the assessment.

### Administrative user

An authorized official maintaining scheme rules, partner information, operational status, and data freshness.

---

## 3. Information Architecture

### Citizen experience

```text
Home
├── Find My Scheme
│   ├── Language
│   ├── Purpose
│   ├── Project or Education Details
│   ├── Income and Eligibility Details
│   ├── Location
│   └── Review Answers
├── Recommendation
│   ├── Best-Match Scheme
│   ├── Why This Scheme
│   └── Alternative Schemes
├── Financial Estimate
│   ├── Eligible Financing
│   ├── Beneficiary Contribution
│   ├── Repayment Estimate
│   └── Calculation Assumptions
├── Channel Partner
│   ├── Recommended Partner
│   ├── Eligible Alternatives
│   ├── Map and Directions
│   └── Data Freshness
└── Next Steps
    ├── Document Checklist
    ├── Download Summary
    └── Continue to Official Application Channel
```

### Administrative experience

```text
Admin Overview
├── Scheme Catalogue
├── Rule Versions
├── Channel Partners
├── Operational and Utilization Data
├── Data Freshness Alerts
├── Routing Audit
└── Aggregate Analytics
```

---

## 4. Primary User Flow

```text
SELECT LANGUAGE
      ↓
STATE THE NEED
      ↓
ANSWER ELIGIBILITY QUESTIONS
      ↓
REVIEW AND CONFIRM
      ↓
VIEW RECOMMENDED SCHEME
      ↓
UNDERSTAND FINANCIAL ESTIMATE
      ↓
CHOOSE ELIGIBLE CHANNEL PARTNER
      ↓
PREPARE DOCUMENTS AND CONTINUE
```

Do not require account creation before the user receives a useful result.

---

## 5. Visual Direction

### Style

Use a **Civic Fintech Assistant** visual language:

- Clean white surfaces on a soft neutral background.
- Civic blue for primary actions and institutional trust.
- Teal for supporting actions and informational accents.
- Green only for confirmed positive states.
- Minimal shadows and restrained corner rounding.
- Simple line icons paired with visible text labels.
- Illustrations only when they clarify a task or outcome.
- No glassmorphism, neon gradients, decorative dashboards, or excessive animation.

### Colour tokens

| Token | Value | Usage |
|---|---:|---|
| `color.primary.700` | `#084B8A` | Pressed states and strong emphasis |
| `color.primary.600` | `#0B5CAD` | Primary buttons, links, active navigation |
| `color.primary.100` | `#DCEBFA` | Selected and informational backgrounds |
| `color.secondary.700` | `#0F5F5A` | Pressed secondary actions |
| `color.secondary.600` | `#0F766E` | Secondary accents |
| `color.secondary.100` | `#D9F0ED` | Soft secondary backgrounds |
| `color.success.700` | `#146C43` | Success text and icons |
| `color.success.100` | `#DDF3E7` | Success banners |
| `color.warning.700` | `#9A4B08` | Warning text and icons |
| `color.warning.100` | `#FFF0D5` | Warning banners |
| `color.error.700` | `#B42318` | Errors and destructive actions |
| `color.error.100` | `#FEE4E2` | Error banners |
| `color.neutral.950` | `#172033` | Primary text |
| `color.neutral.700` | `#465568` | Secondary text |
| `color.neutral.500` | `#69788A` | Metadata and placeholders |
| `color.neutral.300` | `#C9D3DF` | Borders and dividers |
| `color.neutral.100` | `#EDF1F5` | Disabled and subtle backgrounds |
| `color.surface` | `#FFFFFF` | Cards, dialogs, and inputs |
| `color.background` | `#F7F9FC` | Page background |

Colour must never be the only way a status is communicated. Pair it with text and an icon.

### Typography

Use the Noto family for consistent rendering across Indian scripts.

```text
Primary Latin font: Noto Sans
Indic scripts:       Noto Sans Devanagari and corresponding Noto Sans Indic fonts
Fallback:            system-ui, sans-serif
```

| Style | Desktop | Mobile | Weight | Line height |
|---|---:|---:|---:|---:|
| Display | 48 px | 36 px | 700 | 1.15 |
| Heading 1 | 36 px | 30 px | 700 | 1.20 |
| Heading 2 | 28 px | 24 px | 700 | 1.25 |
| Heading 3 | 22 px | 20 px | 600 | 1.30 |
| Body large | 18 px | 18 px | 400 | 1.55 |
| Body | 16 px | 16 px | 400 | 1.50 |
| Label | 14 px | 14 px | 600 | 1.40 |
| Caption | 13 px | 13 px | 400 | 1.40 |

Do not use text smaller than 13 px for meaningful information.

### Spacing and shape

- Base spacing unit: `4 px`.
- Standard layout rhythm: `8 px`.
- Input and button height: `48–52 px`.
- Card padding: `20 px` mobile, `24 px` desktop.
- Section gap: `32 px` mobile, `48–64 px` desktop.
- Input radius: `10 px`.
- Card radius: `16 px`.
- Modal and bottom-sheet radius: `20 px`.
- Maximum citizen-form width: `720 px`.
- Maximum content width: `1200 px`.

### Elevation

Use borders before shadows. Reserve shadows for floating elements, dialogs, and mobile bottom sheets.

```css
--shadow-card: 0 1px 2px rgba(16, 24, 40, 0.06);
--shadow-floating: 0 8px 24px rgba(16, 24, 40, 0.12);
```

---

## 6. Web Experience

### Global header

The public header contains:

- SAHAYAK AI identity.
- Schemes.
- How it works.
- Help.
- Language selector.
- Accessibility controls where required.

During the assessment, reduce the header to the product identity, language, and help so users remain focused.

### Landing page

#### Hero content

**Heading:** Find the right government loan scheme in a few simple steps.

**Supporting copy:** Understand your likely eligibility, repayment estimate, and the authorized Channel Partner you can approach.

**Primary action:** Find my scheme

**Secondary action:** Speak instead

Below the hero, show three benefit cards:

1. Find a suitable scheme.
2. Understand the financial commitment.
3. Locate an eligible Channel Partner.

Include a visible trust notice:

> SAHAYAK AI provides preliminary guidance. Final verification, sanction, and disbursement remain with the authorized Channel Partner and applicable government process.

### Assessment wizard

Use a focused, centred card with one primary question per page.

Every question page contains:

- Back control.
- Step label such as `Step 2 of 6`.
- Short progress indicator.
- Clear question heading.
- Optional explanation of why the information is needed.
- Input or selection choices.
- `I am not sure` when it is a valid answer.
- Sticky or consistently positioned Continue button.

Ask only information required for matching, calculation, or routing.

### Review answers

Before evaluation, show a structured summary grouped into:

- Requirement.
- Financial details.
- Eligibility details.
- Location.

Each group has an Edit action. Changing an answer must re-evaluate any dependent questions.

### Recommendation page

Show one dominant best-match card first.

The card contains:

- `Best match` label.
- Scheme name and category.
- Preliminary eligibility status.
- Three to five reasons for the recommendation.
- Estimated financing.
- Indicative interest rate.
- Moratorium and tenure.
- Rule source and last verified date.
- Primary action to view the financial estimate.

Alternative schemes appear below in a collapsed comparison section. Explain why each is less suitable or ineligible.

### Financial estimate

Prioritize understandable numbers over charts.

Show:

- Total project or education cost.
- Estimated eligible loan amount.
- Beneficiary contribution.
- Interest rate.
- Repayment frequency.
- Moratorium treatment.
- Indicative instalment.
- Total estimated repayment.

Use a single stacked bar to compare financed amount and beneficiary contribution. Display calculation assumptions and allow the user to adjust only permitted values.

### Partner locator

Use a split layout on desktop:

- Left: ranked eligible partner list.
- Right: interactive map.

Each partner card contains:

- Partner name and institution type.
- Supported scheme.
- Approximate distance.
- Service jurisdiction.
- Operational eligibility label.
- Data source and update time.
- Call, directions, and details actions.
- Short explanation of why it was ranked.

Never show a partner as eligible when required operational data is missing or stale. Use an `Eligibility not verified` state instead.

### Next steps

Show a scheme-specific checklist and three clear actions:

- Download guidance summary.
- Continue to the official application channel.
- Contact or navigate to the selected Channel Partner.

---

## 7. Mobile App Experience

### Mobile home

Display four primary actions:

- Find my scheme.
- Continue saved assessment.
- Find nearby partners.
- Get help in my language.

Do not place financial charts or administrative metrics on the home screen.

### Mobile assessment

- Use one question per screen.
- Use full-width choice cards instead of small radio buttons.
- Keep Back and Continue actions in a sticky footer.
- Preserve completed answers locally where safe.
- Display connectivity state without blocking offline review.
- Avoid custom gestures for essential actions.

### Voice assistance

Voice is an alternative input method, never the only method.

The voice flow must:

1. Request microphone permission with a plain-language explanation.
2. Show recording and processing states.
3. Display the transcript.
4. Extract structured values.
5. Ask the user to confirm or edit those values.

Never silently submit a voice interpretation to the rule engine.

### Mobile results

Use one vertically stacked recommendation card followed by financial details and explanations. Keep the primary action visible without hiding important assumptions.

### Mobile partner locator

Use a list-first experience. The map is collapsible and secondary.

The recommended partner appears first, followed by eligible alternatives. Place Call and Directions actions within thumb reach.

---

## 8. Administrative Web Experience

The administrator interface is web-only and visually denser than the citizen interface while retaining the same tokens.

### Navigation

- Overview.
- Schemes.
- Rule versions.
- Channel Partners.
- Operational data.
- Routing audit.
- Reports.
- Users and access.

### Overview dashboard

Show only actionable information:

- Schemes requiring review.
- Partner records with stale operational data.
- Failed data imports.
- Partners currently ineligible for routing.
- Assessment and routing trends.

### Rule management

Every rule change must display:

- Previous and new value.
- Effective date.
- Official source reference.
- Author and approver.
- Change reason.
- Draft, approved, active, or superseded status.

### Partner management

Separate permanent identity information from time-sensitive operational data. Never overwrite history when utilization or eligibility status changes.

---

## 9. Component Library

Build the following reusable components:

### Foundations

- Logo and product identity.
- Icon system.
- Typography styles.
- Colour variables.
- Spacing variables.
- Grid and responsive containers.

### Actions

- Primary button.
- Secondary button.
- Tertiary/text button.
- Icon button.
- Link.
- Segmented control.

### Inputs

- Text field.
- Currency field.
- Number field.
- Select.
- Radio group.
- Checkbox.
- Choice card.
- Slider with synchronized number input.
- Search field.
- Location input.
- Voice recorder.

### Navigation

- Public header.
- Assessment header.
- Progress stepper.
- Breadcrumb.
- Admin sidebar.
- Tabs.
- Sticky mobile footer.

### Content and feedback

- Information banner.
- Warning banner.
- Error summary.
- Inline validation.
- Toast.
- Loading skeleton.
- Empty state.
- Offline state.
- Service-unavailable state.
- Demo-data badge.
- Data-freshness badge.

### Domain components

- Scheme recommendation card.
- Scheme comparison row.
- Eligibility reason list.
- Financial summary card.
- Financing split bar.
- Repayment schedule table.
- Partner card.
- Partner map marker.
- Partner suitability explanation.
- Document checklist item.
- Rule-source panel.
- Preliminary-guidance disclaimer.

Every interactive component requires these variants where applicable:

```text
Default · Hover · Focus · Active · Selected · Disabled · Loading · Error
```

---

## 10. Responsive Behaviour

| Breakpoint | Width | Behaviour |
|---|---:|---|
| Small | `< 600 px` | Single column, sticky actions, list-first maps |
| Medium | `600–1023 px` | Single or compact two-column layout |
| Large | `1024–1439 px` | Full navigation and two-column result layouts |
| Extra large | `≥ 1440 px` | Centred content with a maximum width of 1200 px |

Important content must reflow at 200% zoom without horizontal scrolling, except genuinely two-dimensional content such as maps or data tables.

---

## 11. Accessibility Requirements

Target WCAG 2.2 AA.

- Normal text contrast: at least `4.5:1`.
- Large text and meaningful UI graphics: at least `3:1`.
- Preferred touch target: at least `48 × 48 px`.
- Visible keyboard focus on every interactive control.
- Complete keyboard operation for the web application.
- Semantic headings, labels, landmarks, and live regions.
- Error messages that identify the field and explain how to fix it.
- Icons always paired with accessible labels when they convey meaning.
- No information communicated using colour alone.
- Text must remain usable at 200% zoom.
- Support reduced-motion preferences.
- Audio information must have a visual equivalent.
- Language changes must be exposed to assistive technology.

Test all core flows using keyboard navigation, a screen reader, increased text size, high contrast, and at least one regional language.

---

## 12. Content Design

### Voice and tone

Use respectful, direct, reassuring language.

Prefer:

- `You may be eligible based on the information provided.`
- `Why we are asking this.`
- `Estimated monthly repayment.`
- `This partner currently supports the selected scheme.`

Avoid:

- `Loan approved.`
- `You are definitely eligible.`
- `PSS score` or unexplained operational terminology.
- Long policy text inside the primary journey.
- English financial terminology without a plain-language explanation.

### Translation

- Translate meaning, not individual words in isolation.
- Maintain an approved glossary for scheme and financial terms.
- Allow additional space because translated labels may be longer.
- Do not place important text inside images.
- Show numerals and currency consistently for the selected locale.

---

## 13. System States and Edge Cases

Design explicit screens or components for:

- No eligible scheme.
- Multiple equally suitable schemes.
- Missing required information.
- Income above the current eligibility ceiling.
- No eligible partner in the selected radius.
- Partner information unavailable or stale.
- Location permission denied.
- Voice transcript uncertain.
- Network unavailable.
- Calculation temporarily unavailable.
- Official application service unavailable.
- Saved assessment expired after a rule update.
- Scheme rules changed after an earlier result.

Every failure state must explain what happened, what information remains safe, and what the user can do next.

---

## 14. Motion

Motion should clarify state changes, not decorate them.

- Standard transitions: `150–220 ms`.
- Use fades and small position changes.
- Avoid bouncing, parallax, or continuously moving backgrounds.
- Respect `prefers-reduced-motion`.
- Do not animate financial values in a way that delays comprehension.

---

## 15. Figma Organization

```text
00 — Cover
01 — Foundations
02 — Variables and Styles
03 — Components
04 — Citizen Web
05 — Citizen Mobile
06 — Admin Web
07 — Prototype Flows
08 — Empty, Error, Offline, and Loading States
09 — Accessibility and Developer Handoff
```

### Recommended frames

- Web: `1440 × 1024` and `1024 × 768`.
- Mobile baseline: `360 × 800`.
- Mobile validation: `393 × 852`.
- Component examples should use Auto Layout and variables.

### Figma naming

```text
Button/Primary/Default
Button/Primary/Disabled
Input/Currency/Default
Input/Currency/Error
Card/Scheme/Recommended
Card/Partner/Eligible
Banner/Data/Demo
```

Prototype the complete happy path plus the following edge cases:

- User is not currently eligible.
- Nearest partner is filtered out.
- No partner is eligible.
- Operational data is stale.
- Voice input needs correction.
- Network fails before final routing.

---

## 16. Design Acceptance Criteria

A design is ready for development only when:

- The complete citizen journey works on web and mobile.
- The user can finish without voice, GPS, or account creation.
- Preliminary guidance is never presented as approval.
- Every recommendation explains its reason and source date.
- Every financial result exposes its assumptions.
- Partner results expose eligibility and freshness status.
- Empty, error, loading, offline, and stale-data states are designed.
- Keyboard and screen-reader annotations are included.
- Regional-language layouts have been visually tested.
- Components use shared variables and documented variants.
- The final screen provides a clear official next action.

---

## 17. MVP Design Priority

### Must design first

1. Language selection.
2. Six-step citizen assessment.
3. Review answers.
4. Recommended scheme.
5. Financial estimate.
6. Partner list and map.
7. Document checklist and official handoff.
8. Error, empty, offline, and stale-data states.

### Design after the core journey

- Voice assistance.
- Saved assessments.
- Advanced scheme comparison.
- Administrative analytics.
- Rich repayment charts.
- Non-essential personalization.

The core experience is successful when a first-time user can understand **which scheme may fit, what it may cost, where to go, and what to do next** without needing to understand the underlying Channel Finance system.
