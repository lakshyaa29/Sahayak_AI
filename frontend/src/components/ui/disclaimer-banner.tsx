import React, { HTMLAttributes } from "react";
import { Info, AlertTriangle, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* BannerProps                                                                */
/* -------------------------------------------------------------------------- */
export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  compact?: boolean;
}

/* -------------------------------------------------------------------------- */
/* InfoBanner                                                                 */
/* -------------------------------------------------------------------------- */
export function InfoBanner({ title, description, compact = false, className, children, ...props }: BannerProps) {
  return (
    <aside
      aria-label="Information Banner"
      className={cn(
        "bg-[#DCEAF5]/50 border border-link-default/50 border-l-4 border-l-link-default text-ink-900 rounded-[4px] flex items-start gap-3 text-xs leading-relaxed shadow-none",
        compact ? "p-2.5" : "p-4",
        className
      )}
      {...props}
    >
      <Info className="w-4 h-4 text-link-default flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-0.5 flex-1">
        {title && <span className="font-bold text-ink-900 block">{title}</span>}
        {description && <p className="text-neutral-700">{description}</p>}
        {children && <div className="text-neutral-700">{children}</div>}
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* SuccessBanner                                                              */
/* -------------------------------------------------------------------------- */
export function SuccessBanner({ title, description, compact = false, className, children, ...props }: BannerProps) {
  return (
    <aside
      aria-label="Success Banner"
      className={cn(
        "bg-[#DAEBDD]/50 border border-green-600/50 border-l-4 border-l-green-600 text-ink-900 rounded-[4px] flex items-start gap-3 text-xs leading-relaxed shadow-none",
        compact ? "p-2.5" : "p-4",
        className
      )}
      {...props}
    >
      <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-0.5 flex-1">
        {title && <span className="font-bold text-ink-900 block">{title}</span>}
        {description && <p className="text-neutral-700">{description}</p>}
        {children && <div className="text-neutral-700">{children}</div>}
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* WarningBanner                                                              */
/* -------------------------------------------------------------------------- */
export function WarningBanner({ title, description, compact = false, className, children, ...props }: BannerProps) {
  return (
    <aside
      aria-label="Warning Banner"
      className={cn(
        "bg-[#F7E9C8]/60 border border-amber-600/50 border-l-4 border-l-amber-600 text-ink-900 rounded-[4px] flex items-start gap-3 text-xs leading-relaxed shadow-none",
        compact ? "p-2.5" : "p-4",
        className
      )}
      {...props}
    >
      <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-0.5 flex-1">
        {title && <span className="font-bold text-ink-900 block">{title}</span>}
        {description && <p className="text-neutral-700">{description}</p>}
        {children && <div className="text-neutral-700">{children}</div>}
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* ErrorBanner                                                                */
/* -------------------------------------------------------------------------- */
export function ErrorBanner({ title, description, compact = false, className, children, ...props }: BannerProps) {
  return (
    <aside
      aria-label="Error Banner"
      className={cn(
        "bg-[#F4DADA]/60 border border-destructive/50 border-l-4 border-l-destructive text-ink-900 rounded-[4px] flex items-start gap-3 text-xs leading-relaxed shadow-none",
        compact ? "p-2.5" : "p-4",
        className
      )}
      {...props}
    >
      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-0.5 flex-1">
        {title && <span className="font-bold text-ink-900 block">{title}</span>}
        {description && <p className="text-neutral-700">{description}</p>}
        {children && <div className="text-neutral-700">{children}</div>}
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* GuidanceNotice (Statutory Preliminary Guidance Disclaimer)                 */
/* -------------------------------------------------------------------------- */
export function GuidanceNotice({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <aside
      role="note"
      aria-label="Preliminary Guidance Notice"
      className={cn(
        "bg-surface border border-border-default border-l-4 border-l-accent text-ink-900 rounded-[4px] flex items-start gap-3.5 text-xs leading-relaxed shadow-none",
        compact ? "p-3" : "p-4 sm:p-5",
        className
      )}
    >
      <ShieldCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-1">
        <span className="font-bold uppercase tracking-wider text-[11px] text-ink-900 block">
          Preliminary Guidance Notice
        </span>
        <p className="text-neutral-700 leading-relaxed">
          SAHAYAK AI provides preliminary eligibility guidance and scheme decision support. Final document verification, credit appraisal, loan sanction, and fund disbursement remain exclusively with authorized State Channelizing Agencies, Public Sector Banks, Regional Rural Banks, and NBFC-MFIs under official government guidelines.
        </p>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* Legacy DisclaimerBanner Wrapper (backward compatibility)                   */
/* -------------------------------------------------------------------------- */
export interface DisclaimerBannerProps {
  type?: "preliminary" | "prototype" | "info";
  className?: string;
  compact?: boolean;
}

export function DisclaimerBanner({
  type = "preliminary",
  className,
  compact = false,
}: DisclaimerBannerProps) {
  if (type === "prototype") {
    return (
      <WarningBanner
        title="PROTOTYPE · DEMONSTRATION DATA"
        compact={compact}
        className={className}
      >
        This screen displays illustrative sample data for evaluation purposes. The production rule matching engine and live institutional APIs will be connected in subsequent phases.
      </WarningBanner>
    );
  }

  if (type === "preliminary") {
    return <GuidanceNotice compact={compact} className={className} />;
  }

  return (
    <InfoBanner compact={compact} className={className}>
      Concessional loans for Scheduled Caste beneficiaries are routed through authorized State Channelizing Agencies, Public Sector Banks, Regional Rural Banks, and NBFC-MFIs.
    </InfoBanner>
  );
}
