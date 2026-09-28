export interface LocationInterpretation {
  state: string;
  district: string;
  pincode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_approximate: boolean;
  location_type: "USER_COORDINATES" | "DISTRICT_CENTROID" | "PINCODE_CENTROID" | "MANUAL_ENTRY" | string;
  resolved_name: string;
}

export interface RankedPartnerItem {
  rank: number;
  is_top_recommended: boolean;
  id: string;
  organization_id: string;
  organization_name: string;
  branch_code: string;
  name: string;
  partner_type: "SCA" | "PSB" | "RRB" | "NBFC_MFI" | string;
  public_address: string;
  district: string;
  state: string;
  pincode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  distance_km?: number | null;
  distance_method: string;
  is_approximate_distance: boolean;
  supported_schemes: string[];
  routing_status: "ELIGIBLE_FOR_ROUTING" | string;
  selection_reasons_en: string[];
  selection_reasons_hi: string[];
  contact_person?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  website_url?: string | null;
  is_demonstration: boolean;
  is_fictional: boolean;
  sample_institution_label?: string | null;
  can_call: boolean;
  can_direct: boolean;
  external_map_url?: string | null;
  data_as_of: string;
  observed_at: string;
  retrieved_at: string;
  source_reference: string;
  freshness_status: string;
}

export interface UnverifiedPartnerItem {
  id: string;
  name: string;
  organization_name: string;
  partner_type: string;
  district: string;
  state: string;
  public_address?: string | null;
  contact_phone?: string | null;
  contact_person?: string | null;
  unverified_reason: string;
  unverified_reason_hi: string;
  notice_en: string;
  notice_hi: string;
}

export interface CitizenSafeExclusionSummary {
  reason_code: string;
  count: number;
  description_en: string;
  description_hi: string;
}

export interface PartnerSearchRequest {
  scheme_code: string;
  rule_version_id?: string | null;
  state: string;
  district: string;
  pincode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  location_type?: "USER_COORDINATES" | "DISTRICT_CENTROID" | "PINCODE_CENTROID" | "MANUAL_ENTRY" | string;
  radius_km?: number;
  partner_type?: string | null;
  data_mode?: "ALL" | "VERIFIED_ONLY" | "DEMONSTRATION" | string;
}

export interface PartnerSearchResponse {
  search_id: string;
  evaluated_at: string;
  scheme_code: string;
  rule_version_id: string;
  routing_policy_version: string;
  freshness_policy_version: string;
  data_mode: string;
  location_interpretation: LocationInterpretation;
  search_radius_km: number;
  total_eligible: number;
  eligible_partners: RankedPartnerItem[];
  unverified_partners: UnverifiedPartnerItem[];
  excluded_count: number;
  exclusion_summaries: CitizenSafeExclusionSummary[];
  disclaimer_en: string;
  disclaimer_hi: string;
}

export interface SelectedPartnerData {
  id: string;
  branch_code: string;
  name: string;
  organization_name: string;
  partner_type: string;
  public_address: string;
  district: string;
  state: string;
  distance_km?: number | null;
  contact_person?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  website_url?: string | null;
  is_demonstration: boolean;
  is_fictional: boolean;
  scheme_code: string;
  rule_version_id?: string | null;
  routing_policy_version?: string | null;
  selected_at: string;
}
