# SAHAYAK AI Design System Guide (Step 2)

This document provides a concise reference for the shared, accessible, and responsive design system implemented for SAHAYAK AI (SIH26092), referencing the design specifications in [`design.md`](file:///d:/real%20%20sih%20work/design.md).

---

## 1. Token Locations & Mapping

| Category | Source File | Key Tokens & Variables | Notes |
| :--- | :--- | :--- | :--- |
| **Colors** | `frontend/src/app/globals.css` | `--primary: #0B5CAD`<br>`--primary-hover: #084B8A`<br>`--secondary: #0F766E`<br>`--background: #F7F9FC`<br>`--surface: #FFFFFF`<br>`--surface-muted: #EDF1F5`<br>`--border: #C9D3DF`<br>`--input-border: #94A3B8`<br>`--success: #146C43`<br>`--warning: #9A4B08`<br>`--destructive: #B42318` | All colors meet WCAG 2.2 AA contrast (4.5:1 for body text, 3:1 for controls). `--input-border` ensures input visibility on white cards. |
| **Tailwind Config** | `frontend/tailwind.config.ts` | Maps semantic CSS variables to Tailwind utility classes (`bg-primary`, `text-secondary`, `border-input-border`, etc.). | Includes breakpoints: `sm: 600px`, `md: 1024px`, `lg: 1440px`. |
| **Radius** | `globals.css` & `tailwind.config.ts` | `--radius-input: 10px`<br>`--radius-card: 16px`<br>`--radius-dialog: 20px` | Utilities: `rounded-input`, `rounded-card`, `rounded-dialog`. |
| **Typography** | `layout.tsx` & `typography.tsx` | Noto Sans loaded via `next/font/google` (`--font-noto-sans`). Tabular numbers enabled for financial figures. | Clean fallbacks to system sans-serif. |
| **Spacing & Rhythm** | `globals.css` | 4px base scale, 8px layout rhythm. Max widths: `content: 1200px`, `form: 720px`. | Utilities: `max-w-content`, `max-w-form`. |

---

## 2. Component Catalog & Locations

All primitives and domain components are located in `frontend/src/components/`:

### UI Primitives
- **Layout Primitives** ([`layout-primitives.tsx`](file:///d:/real%20%20sih%20work/frontend/src/components/ui/layout-primitives.tsx)): `PageContainer` (variants: `default`, `form`, `wide`), `Section` (`sm`, `default`, `lg`), `Stack` (gap: 2, 3, 4, 6, 8, 12), `ResponsiveGrid` (2, 3, 4 columns), `PageHeader`, `FormSection`.
- **Typography** ([`typography.tsx`](file:///d:/real%20%20sih%20work/frontend/src/components/ui/typography.tsx)): `DisplayHeading`, `PageHeading`, `SectionHeading`, `CardHeading`, `BodyLarge`, `Body`, `SupportingText`, `FormLabelText`, `Caption`, `FinancialFigure` (tabular numbers in INR).
- **Buttons & Links** ([`button.tsx`](file:///d:/real%20%20sih%20work/frontend/src/components/ui/button.tsx)): `Button` (variants: `primary`, `secondary`, `outline`, `ghost`, `destructive`; sizes: `sm`, `md`, `lg`, `icon`; supports `leadingIcon`, `trailingIcon`, width-preserving `isLoading`, and `disabled`), `StyledLink`.
- **Form Controls** ([`form-controls.tsx`](file:///d:/real%20%20sih%20work/frontend/src/components/ui/form-controls.tsx)): `CurrencyInput` (live INR formatting with caret stability), `Textarea`, `Select`, `Checkbox`, `SearchInput`, `FormErrorSummary`.
- **Choice Cards** ([`choice-card.tsx`](file:///d:/real%20%20sih%20work/frontend/src/components/ui/choice-card.tsx)): Supports `radio` and `checkbox` semantics, full keyboard control (Space / Enter), icon support.
- **Badges** ([`badge.tsx`](file:///d:/real%20%20sih%20work/frontend/src/components/ui/badge.tsx)): `Badge`, `StatusBadge` (with semantic icons), `DataFreshnessBadge`, `DemoDataBadge`.
- **Banners & Disclaimers** ([`disclaimer-banner.tsx`](file:///d:/real%20%20sih%20work/frontend/src/components/ui/disclaimer-banner.tsx)): `InfoBanner`, `SuccessBanner`, `WarningBanner`, `ErrorBanner`, `GuidanceNotice`.
- **Navigation Shell** ([`navigation-shell.tsx`](file:///d:/real%20%20sih%20work/frontend/src/components/ui/navigation-shell.tsx)): `SkipToContent`, `BackLink`, `StickyMobileActionBar`.

### Domain Components
- **SchemeCard** ([`scheme-card.tsx`](file:///d:/real%20%20sih%20work/frontend/src/components/schemes/scheme-card.tsx)): Scheme presentation with `EligibilityReasonList` and key metrics.
- **FinancialMetricCard** ([`financial-metric-card.tsx`](file:///d:/real%20%20sih%20work/frontend/src/components/finance/financial-metric-card.tsx)): Metric cards and `FinancingContributionBar` (stacked loan vs promoter equity).
- **PartnerCard** ([`partner-card.tsx`](file:///d:/real%20%20sih%20work/frontend/src/components/partners/partner-card.tsx)): Channel financing institution card with status badge and branches.
- **ChecklistItem** ([`checklist-item.tsx`](file:///d:/real%20%20sih%20work/frontend/src/components/checklist/checklist-item.tsx)): Interactive readiness document checklist with accessible checkbox semantics.

---

## 3. Usage Examples

### Page Structure
```tsx
import { PageContainer, PageHeader, Stack } from "@/components/ui/layout-primitives";
import { Badge } from "@/components/ui/badge";

export default function MyPage() {
  return (
    <PageContainer variant="default">
      <Stack gap={6}>
        <PageHeader
          title="Section Title"
          description="Supporting explanation of this screen."
          badge={<Badge variant="primary">Preliminary Guidance</Badge>}
        />
        {/* Page Content */}
      </Stack>
    </PageContainer>
  );
}
```

### Currency Input in Form
```tsx
import { CurrencyInput } from "@/components/ui/form-controls";

<CurrencyInput
  id="project-cost"
  label="Estimated Project Outlay"
  value={amount}
  onChange={(val) => setAmount(val)}
  helperText="Include machinery, working capital, or tuition fees."
  required
/>
```

### Financial Figure
```tsx
import { FinancialFigure } from "@/components/ui/typography";

<FinancialFigure amount={1250000} size="lg" />
```

---

## 4. Responsive & Accessibility Conventions

### Breakpoints
Follows the 4-tier breakpoint strategy in `design.md`:
- **Small (< 600px):** Single-column layout, bottom `StickyMobileActionBar` for touch accessibility, minimum 48px touch targets, mobile card padding 16–20px.
- **Medium (600–1023px):** 2-column grids, inline actions, 20px padding.
- **Large (1024–1439px):** Split list/map view on Partners, max content width 1200px.
- **Extra Large (≥ 1440px):** Balanced whitespace without excessively long text lines.

### Accessibility Standards
1. **Focus Rings:** Visible `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` on all interactive elements.
2. **Accessible Names:** Icon-only buttons include `aria-label`.
3. **Form Error Connections:** All errors use `aria-invalid="true"` and `aria-describedby="{id}-error"` paired with `AlertCircle` icons, not color alone.
4. **Keyboard Operability:** Choice cards and checklist items respond to both `Space` and `Enter`.
5. **Skip Link:** Public and compact headers include `<SkipToContent />` anchored to `#main-content`.
6. **Zoom Testing:** Layout tested up to 200% browser zoom without text clipping or horizontal layout breakdown.
7. **Reduced Motion:** Interactive transitions respect `prefers-reduced-motion: reduce` in CSS (150–220ms subtle easing).

---

## 5. How to Add a Component or Variant

1. **Add Token (if needed):** In `frontend/src/app/globals.css`, declare the CSS variable under `:root`. If referencing in Tailwind classes, expose it in `frontend/tailwind.config.ts`.
2. **Implement Component:** Create the component in `frontend/src/components/ui/` or the appropriate domain folder.
   - Use `cn()` from `@/lib/utils` for class merging.
   - Define TypeScript props interface extending native HTML attributes.
   - Set standard default height (`min-h-[48px]`), border radius (`rounded-input` or `rounded-card`), and focus ring.
3. **Add to Gallery:** Import and showcase the component in `frontend/src/app/dev/design-system/page.tsx` with default, hover, active, and disabled states.

---

## 6. How to Run the Component Gallery

The design system preview gallery is available at `/dev/design-system`:

1. **Start the Frontend Server:**
   ```powershell
   cd frontend
   npm run dev
   ```
2. **Open in Browser:**
   Navigate to [http://localhost:3000/dev/design-system](http://localhost:3000/dev/design-system).
3. **Interactive Features in the Gallery:**
   - **Tokens & Color:** View all 13 palette tokens with hex values, AAA/AA contrast roles, and radius tokens.
   - **Typography:** Test headings, body text, and tabular financial figures in INR.
   - **Buttons & Links:** Test loading state (simulates 2-sec async operation without width shifting), disabled states, and icon layouts.
   - **Form Controls:** Test live currency input formatting, select menus, checkboxes, and error summaries.
   - **Choice Cards:** Test keyboard navigation (Tab, Space, Enter) with radio and checkbox styles.
   - **Badges & Banners:** Verify status badges, freshness timestamps, and zero-hallucination disclaimers.
   - **Domain Cards:** Inspect `SchemeCard`, `FinancialMetricCard`, `PartnerCard`, and `ChecklistItem`.
   - **Navigation & Shell:** Step through the 5-step `JourneyProgressIndicator` interactively.
