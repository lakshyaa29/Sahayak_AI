"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAssessment } from "@/lib/assessment-context";
import { useLanguage } from "@/lib/language-context";
import {
  PageContainer,
  Stack,
  PageHeader,
  ResponsiveGrid,
} from "@/components/ui/layout-primitives";
import {
  PageHeading,
  CardHeading,
  Body,
  SupportingText,
  Caption,
} from "@/components/ui/typography";
import { PartnerCard } from "@/components/partners/partner-card";
import { PartnerMap } from "@/components/partners/partner-map";
import { Badge, DemoDataBadge } from "@/components/ui/badge";
import { Button, StyledLink } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { InfoBanner, WarningBanner, GuidanceNotice } from "@/components/ui/disclaimer-banner";
import { SearchInput } from "@/components/ui/form-controls";
import { BackLink, StickyMobileActionBar } from "@/components/ui/navigation-shell";
import { searchPartners } from "@/lib/api/client";
import {
  RankedPartnerItem,
  UnverifiedPartnerItem,
  PartnerSearchResponse,
  PartnerSearchRequest,
  SelectedPartnerData,
} from "@/types";
import { SAMPLE_STATES_DISTRICTS } from "@/lib/fixtures/sample-data";
import {
  Building2,
  Filter,
  Compass,
  ArrowRight,
  MapPin,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Navigation,
  ExternalLink,
  Map as MapIcon,
  List as ListIcon,
  ShieldCheck,
  Phone,
} from "lucide-react";

const RADIUS_OPTIONS = [15, 30, 50, 100];

function PartnersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { values, updateValues, evaluationResult, selectedPartner, setSelectedPartner } = useAssessment();
  const { lang, t } = useLanguage();
  const isHindi = lang === "hi";
  const partT = (t as any).partners || {};

  // Scheme Context from URL or Assessment
  const paramScheme = searchParams.get("scheme");
  const selectedSchemeCode =
    paramScheme || evaluationResult?.primary_scheme?.code || "SC_MICRO_FINANCE";
  const schemeName =
    evaluationResult?.primary_scheme?.name_en ||
    (selectedSchemeCode === "SC_TERM_LOAN"
      ? "Term Loan Scheme for Viable Projects"
      : selectedSchemeCode === "SC_EDUCATION_LOAN"
      ? "Concessional Educational Loan Scheme"
      : "Micro Finance Scheme for SC Entrepreneurs");

  // Location Context from URL or Assessment
  const initialDistrict = searchParams.get("district") || values.district || "Wardha";
  const initialState = searchParams.get("state") || values.state || "Maharashtra";

  const [currentDistrict, setCurrentDistrict] = useState<string>(initialDistrict);
  const [currentState, setCurrentState] = useState<string>(initialState);
  const [currentPincode, setCurrentPincode] = useState<string>(values.pincode || "");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Search Controls
  const [activeRadius, setActiveRadius] = useState<number>(50);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    selectedPartner?.id || null
  );

  // Mobile View Toggle: 'list' | 'map'
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  // Location Switcher Dialog State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [tempState, setTempState] = useState<string>(currentState);
  const [tempDistrict, setTempDistrict] = useState<string>(currentDistrict);
  const [tempPincode, setTempPincode] = useState<string>(currentPincode);
  const [geoLocating, setGeoLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Search Results
  const [searchResponse, setSearchResponse] = useState<PartnerSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch partners function
  const executeSearch = useCallback(
    async (st: string, dist: string, pin: string, rad: number, coords: { lat: number; lng: number } | null) => {
      setIsLoading(true);
      setApiError(null);

      const payload: PartnerSearchRequest = {
        scheme_code: selectedSchemeCode,
        state: st,
        district: dist,
        pincode: pin || null,
        latitude: coords?.lat || null,
        longitude: coords?.lng || null,
        location_type: coords ? "USER_COORDINATES" : "DISTRICT_CENTROID",
        radius_km: rad,
        data_mode: "ALL",
      };

      const res = await searchPartners(payload);
      if (res.data) {
        setSearchResponse(res.data);
        if (res.data.eligible_partners.length > 0 && !selectedPartnerId) {
          setSelectedPartnerId(res.data.eligible_partners[0].id);
        }
      } else {
        setApiError(res.error || "Unable to retrieve Channel Partners.");
      }
      setIsLoading(false);
    },
    [selectedSchemeCode, selectedPartnerId]
  );

  // Initial and reactive search
  useEffect(() => {
    executeSearch(currentState, currentDistrict, currentPincode, activeRadius, userCoords);
  }, [currentState, currentDistrict, currentPincode, activeRadius, userCoords, executeSearch]);

  // Handle Location Modal Confirm
  const handleApplyLocation = () => {
    setCurrentState(tempState);
    setCurrentDistrict(tempDistrict);
    setCurrentPincode(tempPincode);
    updateValues({ state: tempState, district: tempDistrict, pincode: tempPincode });
    setIsLocationModalOpen(false);
  };

  // Handle Browser Geolocation
  const handleRequestGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError(
        isHindi
          ? "आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता है। कृपया मैन्युअल रूप से जिला चुनें।"
          : "Geolocation is not supported by your browser. Please select your district manually."
      );
      return;
    }

    setGeoLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setGeoLocating(false);
        setIsLocationModalOpen(false);
      },
      (err) => {
        setGeoLocating(false);
        if (err.code === 1) {
          setGeoError(
            isHindi
              ? "स्थान की अनुमति अस्वीकृत कर दी गई। आप नीचे दी गई सूची से अपना जिला चुन सकते हैं।"
              : "Location permission denied. You can choose your district from the list below."
          );
        } else {
          setGeoError(
            isHindi
              ? "सटीक स्थान प्राप्त करने में असमर्थ। कृपया मैन्युअल रूप से जिला चुनें।"
              : "Could not retrieve exact location. Please select district manually."
          );
        }
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  // Handle Partner Selection and Handoff
  const handleChoosePartner = (partner: RankedPartnerItem) => {
    const selectedData: SelectedPartnerData = {
      id: partner.id,
      branch_code: partner.branch_code,
      name: partner.name,
      organization_name: partner.organization_name,
      partner_type: partner.partner_type,
      public_address: partner.public_address,
      district: partner.district,
      state: partner.state,
      distance_km: partner.distance_km,
      contact_person: partner.contact_person,
      contact_phone: partner.contact_phone,
      contact_email: partner.contact_email,
      website_url: partner.website_url,
      is_demonstration: partner.is_demonstration,
      is_fictional: partner.is_fictional,
      scheme_code: selectedSchemeCode,
      rule_version_id: searchResponse?.rule_version_id,
      routing_policy_version: searchResponse?.routing_policy_version,
      selected_at: new Date().toISOString(),
    };

    setSelectedPartner(selectedData);
    setSelectedPartnerId(partner.id);
    router.push("/next-steps");
  };

  // Client-side text & tab filtering of eligible partners
  const rawEligible = searchResponse?.eligible_partners || [];
  const filteredPartners = rawEligible.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchOrg = p.organization_name.toLowerCase().includes(q);
      const matchDist = p.district.toLowerCase().includes(q);
      const matchType = p.partner_type.toLowerCase().includes(q);
      if (!matchName && !matchOrg && !matchDist && !matchType) return false;
    }

    if (filterType === "ALL") return true;
    if (filterType === "SCA") return p.partner_type === "SCA";
    if (filterType === "PSB") return p.partner_type === "PSB";
    if (filterType === "RRB") return p.partner_type === "RRB";
    return true;
  });

  const unverifiedList = searchResponse?.unverified_partners || [];
  const exclusionSummaries = searchResponse?.exclusion_summaries || [];
  const locationInterp = searchResponse?.location_interpretation || null;

  return (
    <PageContainer variant="default" className="py-4 md:py-8">
      <Stack gap={8}>
        {/* 1. Page Header */}
        <PageHeader
          title={partT.pageTitle || "Find a Channel Partner"}
          description={
            partT.pageDescription ||
            "Explore accredited financial institutions that support your selected scheme and serve your area."
          }
          badge={
            <div className="flex items-center gap-2">
              <Badge variant="primary">{partT.badge || "Policy & Proximity Routing"}</Badge>
              <DemoDataBadge />
            </div>
          }
        />

        {/* 2. Operational Channel Routing Notice */}
        <InfoBanner
          title={partT.routingNoticeTitle || "Accredited Channel Finance Routing"}
          description={
            partT.routingNoticeDesc ||
            "Direct loan applications are not accepted by central ministries; funds are disbursed exclusively through accredited State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), and Regional Rural Banks (RRBs)."
          }
        />

        {/* 3. Search & Context Command Strip */}
        <div className="bg-surface p-4 rounded-card border border-border space-y-3.5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Selected Scheme Badge */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-secondary">{partT.selectedSchemeLabel || "Selected Scheme"}:</span>
              <span className="font-bold text-foreground bg-primary-subtle border border-primary-muted px-2.5 py-1 rounded-input font-mono text-[11px]">
                {selectedSchemeCode}
              </span>
              <span className="text-muted-foreground hidden sm:inline">&bull; {schemeName}</span>
            </div>

            {/* Current Search Location & Change Button */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-secondary">{partT.locationLabel || "Your Location"}:</span>
              <div className="flex items-center gap-1 font-bold text-foreground bg-surface-muted border border-border px-2.5 py-1 rounded-input">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>
                  {currentDistrict}, {currentState}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsLocationModalOpen(true)}
                className="text-[11px] h-7 px-2 gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>{partT.changeLocationBtn || "Change Location"}</span>
              </Button>
            </div>
          </div>

          {/* Search Radius and Branch Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border text-xs">
            {/* Radius Selector */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-primary" />
                <span>{partT.searchRadiusLabel || "Search Radius"}:</span>
              </span>
              <div className="flex items-center gap-1">
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setActiveRadius(r)}
                    className={`px-2.5 py-1 rounded-input font-bold transition-colors ${
                      activeRadius === r
                        ? "bg-primary text-white"
                        : "bg-surface-muted text-secondary hover:bg-neutral-200"
                    }`}
                  >
                    {r} {partT.radiusKm || "km"}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="lg:hidden flex items-center gap-1 bg-surface-muted p-0.5 rounded-input border border-border">
              <button
                type="button"
                onClick={() => setMobileView("list")}
                className={`px-3 py-1 rounded-md flex items-center gap-1 font-bold ${
                  mobileView === "list" ? "bg-white text-primary shadow-xs" : "text-secondary"
                }`}
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span>{partT.listTab || "List"}</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileView("map")}
                className={`px-3 py-1 rounded-md flex items-center gap-1 font-bold ${
                  mobileView === "map" ? "bg-white text-primary shadow-xs" : "text-secondary"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>{partT.mapTab || "Map"}</span>
              </button>
            </div>

            {/* Partner Institution Type Filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-muted-foreground mr-1">
                <Filter className="w-3 h-3 inline mr-1" />
                <span>Filter:</span>
              </span>
              {[
                { id: "ALL", label: partT.filterAll || "All" },
                { id: "SCA", label: partT.filterSca || "SCAs" },
                { id: "PSB", label: partT.filterPsb || "PSBs" },
                { id: "RRB", label: partT.filterRrb || "RRBs" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterType(tab.id)}
                  className={`px-2.5 py-1 rounded-input font-semibold text-[11px] transition-colors ${
                    filterType === tab.id
                      ? "bg-secondary text-white font-bold"
                      : "bg-surface-muted text-secondary hover:bg-neutral-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Split Grid Layout: List on Left, Map on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Ranked Partner List & Feed */}
          <div
            className={`lg:col-span-7 space-y-4 ${
              mobileView === "map" ? "hidden lg:block" : "block"
            }`}
          >
            {/* Search Input Filter */}
            <div className="bg-surface p-3 rounded-card border border-border shadow-xs">
              <SearchInput
                id="partner-search-input"
                placeholder={partT.searchPlaceholder || "Search by branch name, institution, or district..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 px-1">
                <span>
                  <strong>{filteredPartners.length}</strong>{" "}
                  {partT.resultsCount || "eligible partner offices found"}
                </span>
                <span>
                  Radius: <strong>{activeRadius} km</strong> &bull; Policy: <strong>route-v1.0</strong>
                </span>
              </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="py-12 bg-surface rounded-card border border-border text-center space-y-3">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-muted-foreground font-medium">
                  {isHindi ? "निकटतम अधिकृत चैनल पार्टनर खोजे जा रहे हैं..." : "Searching accredited Channel Partners..."}
                </p>
              </div>
            )}

            {/* Error Banner */}
            {!isLoading && apiError && (
              <div className="bg-amber-50 border border-amber-200 rounded-card p-4 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>{apiError}</span>
                </div>
                <p>
                  {isHindi
                    ? "नेटवर्क त्रुटि के कारण लाइव डेटाबेस उपलब्ध नहीं है। कृपया पुनः प्रयास करें या अन्य दायरा चुनें।"
                    : "Live database connection unavailable. You can retry with a different radius or district."}
                </p>
              </div>
            )}

            {/* Cards Feed */}
            {!isLoading && (
              <div className="space-y-4" role="feed" aria-label="Eligible Channel Partner Branches">
                {filteredPartners.map((partner) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    isSelected={partner.id === selectedPartnerId}
                    onClick={(p) => setSelectedPartnerId(p.id)}
                    onChoose={handleChoosePartner}
                    isHindi={isHindi}
                  />
                ))}

                {/* Empty State: No partners within radius */}
                {filteredPartners.length === 0 && (
                  <div className="p-8 bg-surface rounded-card border border-border text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-surface-muted text-muted-foreground flex items-center justify-center mx-auto">
                      <Compass className="w-6 h-6" />
                    </div>
                    <CardHeading className="text-base">
                      {partT.noPartnersTitle || "No eligible partner found in this radius"}
                    </CardHeading>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                      {partT.noPartnersDesc ||
                        "No accredited branches in our current records match your selected scheme within the active radius."}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      {activeRadius < 100 && (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => setActiveRadius(100)}
                          className="text-xs gap-1.5"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>{partT.expandRadiusAction || "Expand Search to 100 km"}</span>
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsLocationModalOpen(true)}
                        className="text-xs"
                      >
                        {partT.changeLocationBtn || "Change Location"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. Separately Identified Unverified Directory Entries */}
            {unverifiedList.length > 0 && (
              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-secondary" />
                  <h3 className="font-bold text-sm text-foreground">
                    {partT.unverifiedSectionTitle || "Additional Directory Offices (Contact to confirm)"}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {partT.unverifiedSectionSub ||
                    "Offices listed in the official directory whose current operational quotas or coordinates could not be automatically confirmed."}
                </p>

                <div className="space-y-2.5">
                  {unverifiedList.map((u) => (
                    <div
                      key={u.id}
                      className="bg-surface-muted/50 border border-border rounded-card p-3 text-xs space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="font-bold text-foreground text-sm">{u.name}</span>
                        <Badge variant="neutral" size="sm">
                          {u.partner_type}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground">
                        {u.organization_name} &bull; {u.district}, {u.state}
                      </div>
                      <div className="bg-amber-50/60 border border-amber-200 rounded p-2 text-amber-900 text-[11px]">
                        <strong>{isHindi ? "सत्यापन स्थिति: " : "Status Note: "}</strong>
                        {isHindi ? u.unverified_reason_hi : u.unverified_reason}
                      </div>
                      {u.contact_phone && (
                        <div className="text-secondary font-medium pt-0.5">
                          {isHindi ? "शाखा संपर्क: " : "Public Contact: "}{" "}
                          <a href={`tel:${u.contact_phone}`} className="text-primary underline">
                            {u.contact_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Citizen-Safe Exclusion Summary Disclosure */}
            {exclusionSummaries.length > 0 && (
              <div className="bg-surface-muted/60 border border-border rounded-card p-4 space-y-2 text-xs">
                <span className="font-bold text-foreground block">
                  {isHindi ? "रूटिंग फिल्टर सारांश (नागरिक पारदर्शिता):" : "Routing Filter Transparency Summary:"}
                </span>
                <ul className="space-y-1 text-muted-foreground">
                  {exclusionSummaries.map((excl, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span>&bull; {isHindi ? excl.description_hi : excl.description_en}</span>
                      <span className="font-bold text-foreground tabular-nums">{excl.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Leaflet Map View & Sticky Action */}
          <div
            className={`lg:col-span-5 sticky top-24 space-y-4 ${
              mobileView === "list" ? "hidden lg:block" : "block"
            }`}
          >
            <Card className="border-border p-4 space-y-3 overflow-hidden shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">
                    {partT.mapViewTitle || "Accredited Branch Map"}
                  </h3>
                </div>
                <DemoDataBadge />
              </div>

              {/* Functional Leaflet Interactive Map */}
              <PartnerMap
                partners={filteredPartners}
                userLocation={locationInterp}
                selectedPartnerId={selectedPartnerId}
                onSelectPartner={(p) => setSelectedPartnerId(p.id)}
                isHindi={isHindi}
                className="w-full h-80 lg:h-[420px]"
              />

              {/* Map Legend */}
              <div className="space-y-1.5 text-xs text-secondary pt-1 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-success inline-block shadow-2xs" />
                  <span>
                    <strong>Green #1:</strong> {isHindi ? "शीर्ष अनुशंसित निकटतम शाखा" : "Top recommended closest branch"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary inline-block shadow-2xs" />
                  <span>
                    <strong>Blue #2+:</strong> {isHindi ? "अन्य पात्र बैंक एवं एजेंसी शाखाएं" : "Other qualified partner branches"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary border-2 border-white ring-1 ring-primary inline-block" />
                  <span>
                    <strong>Center Dot:</strong> {isHindi ? "आपका खोज स्थान (अनुमानित)" : "Your search origin (approximate)"}
                  </span>
                </div>
              </div>
            </Card>

            {/* Selected Partner Action Panel */}
            {selectedPartnerId && (
              <div className="bg-surface p-4 rounded-card border-2 border-primary/60 space-y-3 shadow-xs">
                {(() => {
                  const currentSel = rawEligible.find((p) => p.id === selectedPartnerId);
                  if (!currentSel) return null;
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-primary">
                          {isHindi ? "चयनित शाखा:" : "Active Branch Focus:"}
                        </span>
                        <span className="font-bold text-foreground">~{currentSel.distance_km} km</span>
                      </div>
                      <div className="font-bold text-sm text-foreground">{currentSel.name}</div>
                      <div className="text-xs text-muted-foreground">{currentSel.public_address}</div>

                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => handleChoosePartner(currentSel)}
                        className="w-full gap-2 justify-center font-bold shadow-xs mt-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{partT.continueToNextSteps || "Continue to Required Documents"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* 7. Bottom Navigation Link */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <BackLink href="/calculator" label={partT.backToCalculator || "Back to Repayment Estimate"} />
        </div>

        {/* 8. Statutory Disclaimer Notice */}
        <GuidanceNotice />
      </Stack>

      {/* Sticky Mobile Action Bar */}
      <StickyMobileActionBar
        primaryAction={{
          label: isHindi ? "आवश्यक दस्तावेज देखें" : "View Required Documents",
          href: "/next-steps",
        }}
        secondaryAction={{
          label: isHindi ? "वापस" : "Back",
          href: "/calculator",
        }}
      />

      {/* Location Switcher Modal */}
      {isLocationModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-dialog-title"
        >
          <div className="bg-surface rounded-card border border-border p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 id="location-dialog-title" className="font-bold text-lg text-foreground">
                  {isHindi ? "खोज स्थान बदलें" : "Change Search Location"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Geolocation Button */}
              <div className="p-3 bg-primary-subtle border border-primary-muted rounded-card space-y-2">
                <span className="font-bold text-primary block">
                  {isHindi ? "जीपीएस से खोजें (वैकल्पिक)" : "Use Device Location (Optional)"}
                </span>
                <p className="text-secondary text-[11px]">
                  {isHindi
                    ? "ब्राउज़र अनुमति मिलने पर सटीक जीपीएस निर्देशांक का उपयोग करेगा।"
                    : "Requests temporary browser coordinates to calculate straight-line proximity."}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRequestGeolocation}
                  disabled={geoLocating}
                  className="w-full gap-1.5 font-bold"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{geoLocating ? "Locating..." : "Use My Current Location"}</span>
                </Button>
                {geoError && <p className="text-destructive font-semibold mt-1">{geoError}</p>}
              </div>

              <div className="text-center font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                &mdash; {isHindi ? "या मैन्युअल रूप से चुनें" : "OR SELECT MANUALLY"} &mdash;
              </div>

              {/* State Selection */}
              <div className="space-y-1">
                <label className="font-bold text-foreground block">
                  {isHindi ? "राज्य / केंद्र शासित प्रदेश" : "State / UT"}
                </label>
                <select
                  value={tempState}
                  onChange={(e) => {
                    const st = e.target.value;
                    setTempState(st);
                    const dists = SAMPLE_STATES_DISTRICTS[st] || [];
                    if (dists.length > 0) setTempDistrict(dists[0]);
                  }}
                  className="w-full p-2.5 rounded-input border border-input-border bg-surface text-foreground font-medium"
                >
                  {Object.keys(SAMPLE_STATES_DISTRICTS).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Selection */}
              <div className="space-y-1">
                <label className="font-bold text-foreground block">
                  {isHindi ? "जिला" : "District"}
                </label>
                <select
                  value={tempDistrict}
                  onChange={(e) => setTempDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-input border border-input-border bg-surface text-foreground font-medium"
                >
                  {(SAMPLE_STATES_DISTRICTS[tempState] || [tempDistrict]).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Postal Code */}
              <div className="space-y-1">
                <label className="font-bold text-foreground block">
                  {isHindi ? "डाक पिन कोड (वैकल्पिक)" : "Postal PIN Code (Optional)"}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={tempPincode}
                  onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g., 442001"
                  className="w-full p-2.5 rounded-input border border-input-border bg-surface text-foreground font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsLocationModalOpen(false)}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={handleApplyLocation}>
                {isHindi ? "स्थान लागू करें" : "Apply Location"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

export default function PartnersPage() {
  return (
    <Suspense
      fallback={
        <PageContainer variant="default" className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">Loading Channel Partner directory...</p>
        </PageContainer>
      }
    >
      <PartnersContent />
    </Suspense>
  );
}
