"use client";

import React, { useState } from "react";
import { RankedPartnerItem } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge, DataFreshnessBadge, DemoDataBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Phone,
  PhoneOff,
  Navigation,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PartnerCardProps {
  partner: RankedPartnerItem;
  isSelected?: boolean;
  onChoose?: (partner: RankedPartnerItem) => void;
  onClick?: (partner: RankedPartnerItem) => void;
  isHindi?: boolean;
}

export function PartnerCard({
  partner,
  isSelected = false,
  onChoose,
  onClick,
  isHindi = false,
}: PartnerCardProps) {
  const [showWhyDisclosure, setShowWhyDisclosure] = useState(false);
  const isTop = partner.is_top_recommended;

  const reasons = isHindi ? partner.selection_reasons_hi : partner.selection_reasons_en;

  return (
    <Card
      id={`partner-card-${partner.id}`}
      tabIndex={0}
      role="article"
      aria-labelledby={`partner-heading-${partner.id}`}
      onClick={() => onClick && onClick(partner)}
      className={cn(
        "transition-all duration-base cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isSelected
          ? "border-2 border-primary shadow-hover bg-primary-subtle/20 ring-1 ring-primary/30"
          : isTop
          ? "border-2 border-success shadow-xs bg-surface"
          : "border-border bg-surface hover:border-primary/50 hover:shadow-xs"
      )}
    >
      <CardHeader className="pb-3">
        {/* Top Header Row: Badges and Distance */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Rank badge */}
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full text-white shadow-2xs",
                isTop ? "bg-success" : "bg-primary"
              )}
            >
              #{partner.rank} {isTop ? (isHindi ? "शीर्ष अनुशंसित" : "Recommended") : ""}
            </span>

            {/* Partner type */}
            <Badge variant="primary" size="sm">
              {partner.partner_type}
            </Badge>

            {/* Eligible status badge */}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-input">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              <span>{isHindi ? "रूटिंग हेतु पात्र" : "Eligible for Routing"}</span>
            </span>

            {/* Demo badge if simulated */}
            {partner.is_demonstration && <DemoDataBadge />}
          </div>

          {/* Distance pill */}
          {partner.distance_km !== null && partner.distance_km !== undefined ? (
            <span
              className="text-xs font-bold text-foreground bg-surface-muted px-2.5 py-1 rounded-input tabular-nums border border-border"
              title="Straight-line geodesic approximate distance"
            >
              ~{partner.distance_km} km {isHindi ? "दूरी" : "away"}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground bg-surface-muted px-2 py-0.5 rounded-input border border-border">
              {isHindi ? "दूरी अनुपलब्ध" : "Distance unavailable"}
            </span>
          )}
        </div>

        {/* Institution & Branch Name */}
        <CardTitle
          id={`partner-heading-${partner.id}`}
          className="text-lg md:text-xl text-foreground font-bold flex items-start gap-2 pt-1"
        >
          <Building2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <span>{partner.name}</span>
        </CardTitle>

        <CardDescription className="text-xs text-muted-foreground">
          {partner.organization_name} &bull; {isHindi ? "शाखा कोड" : "Branch Code"}:{" "}
          <span className="font-mono font-semibold">{partner.branch_code}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3.5 pt-0">
        {/* Address and Geodesic disclaimer */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-foreground font-medium">{partner.public_address}</span>
            {partner.is_approximate_distance && (
              <span className="text-[11px] text-muted-foreground block mt-0.5">
                ({isHindi ? "दूरी अनुमानित सीधी रेखा है, सड़क मार्ग नहीं" : "Straight-line approximate distance"})
              </span>
            )}
          </div>
        </div>

        {/* Fictional Institution Alert */}
        {partner.is_fictional && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2.5 text-xs text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              {isHindi
                ? "यह प्रोटोटाइप सिमुलेशन हेतु एक नमूना संस्था है। कॉल और नेविगेशन क्रियाएं अक्षम हैं।"
                : "Sample institution for prototype demonstration. Call and navigation actions are disabled."}
            </span>
          </div>
        )}

        {/* Why this partner? - Transparent Policy Disclosure Accordion */}
        <div className="border border-border rounded-card overflow-hidden text-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowWhyDisclosure(!showWhyDisclosure);
            }}
            className="w-full flex items-center justify-between p-2.5 bg-surface-muted/70 hover:bg-surface-muted text-foreground font-semibold text-left transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span>{isHindi ? "यह पार्टनर क्यों चुना गया?" : "Why this partner?"}</span>
            </div>
            {showWhyDisclosure ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {showWhyDisclosure && (
            <div className="p-3 bg-surface space-y-1.5 border-t border-border">
              <ul className="space-y-1.5">
                {reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-secondary leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-[11px] text-muted-foreground border-t border-border-subtle mt-2">
                <span>{isHindi ? "स्रोत संदर्भ" : "Policy Source"}: </span>
                <span className="font-semibold text-foreground">{partner.source_reference}</span>
              </div>
            </div>
          )}
        </div>

        {/* Supported Schemes Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground text-[11px]">
            {isHindi ? "समर्थित योजनाएं:" : "Supported Schemes:"}
          </span>
          {partner.supported_schemes.map((code) => (
            <span
              key={code}
              className="bg-surface-muted px-2 py-0.5 rounded-input text-foreground font-mono text-[10px] border border-border"
            >
              {code}
            </span>
          ))}
        </div>

        {/* Action Buttons & Selection */}
        <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2.5">
          {/* Contact & Directions External Links */}
          <div className="flex items-center gap-2">
            {partner.can_call && partner.contact_phone ? (
              <a
                href={`tel:${partner.contact_phone}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary-subtle border border-primary-muted px-2.5 py-1.5 rounded-input hover:bg-primary-muted transition-colors"
                title={`Call ${partner.contact_phone}`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{isHindi ? "शाखा को कॉल करें" : "Call"}</span>
              </a>
            ) : (
              <span
                className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-surface-muted px-2.5 py-1.5 rounded-input border border-border cursor-not-allowed opacity-60"
                title={partner.is_fictional ? "Demonstration record: Call disabled" : "Phone unlisted"}
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>{isHindi ? "कॉल अनुपलब्ध" : "No Phone"}</span>
              </span>
            )}

            {partner.can_direct && partner.external_map_url ? (
              <a
                href={partner.external_map_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-secondary bg-secondary-subtle border border-secondary-muted px-2.5 py-1.5 rounded-input hover:bg-secondary-muted transition-colors"
                title="Opens OpenStreetMap directions in new window"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isHindi ? "दिशा-निर्देश" : "Directions"}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </a>
            ) : null}
          </div>

          {/* Primary Action: Choose this Partner */}
          <Button
            type="button"
            variant={isSelected ? "secondary" : "primary"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (onChoose) onChoose(partner);
            }}
            className="text-xs gap-1.5 font-bold shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {isSelected
                ? isHindi
                  ? "चयनित शाखा ✓"
                  : "Partner Selected ✓"
                : isHindi
                ? "यह पार्टनर चुनें"
                : "Choose this Partner"}
            </span>
          </Button>
        </div>

        {/* Footer timestamp & observation date */}
        <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            {isHindi ? "अवलोकन तिथि:" : "Data observed:"} {partner.data_as_of}
          </span>
          <span className="italic">
            {partner.is_demonstration
              ? isHindi
                ? "प्रोटोटाइप डेटा"
                : "Demonstration Data"
              : isHindi
              ? "सत्यापित स्रोत"
              : "Verified Source"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
