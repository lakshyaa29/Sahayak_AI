import { SchemeSummary, PartnerBranch, PartnerSearchRequest, PartnerSearchResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface HealthResponse {
  status: string;
  app: string;
  version: string;
  timestamp: string;
}

export interface ReadyResponse {
  status: "ready" | "not_ready";
  database: {
    connected: boolean;
    postgisAvailable: boolean;
    message: string;
  };
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isFallback: boolean;
}

export async function checkApiHealth(): Promise<ApiResponse<HealthResponse>> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/health`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return { data: null, error: `Health check failed with status: ${res.status}`, isFallback: false };
    }
    const data = await res.json();
    return { data, error: null, isFallback: false };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Unable to reach backend API", isFallback: false };
  }
}

export async function checkApiReady(): Promise<ApiResponse<ReadyResponse>> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/ready`, {
      cache: "no-store",
    });
    const data = await res.json();
    return { data, error: null, isFallback: false };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Backend database readiness check failed", isFallback: false };
  }
}

export async function getSchemes(): Promise<ApiResponse<SchemeSummary[]>> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/schemes`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return { data: null, error: `Schemes endpoint returned status ${res.status}`, isFallback: false };
    }
    const data = await res.json();
    return { data, error: null, isFallback: false };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Network error fetching schemes from backend", isFallback: false };
  }
}

export async function getPartners(): Promise<ApiResponse<PartnerBranch[]>> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/partners`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return { data: null, error: `Partners endpoint returned status ${res.status}`, isFallback: false };
    }
    const data = await res.json();
    return { data, error: null, isFallback: false };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Network error fetching partners from backend", isFallback: false };
  }
}

export async function calculateEstimate(
  payload: import("@/types").CalculationEstimateRequest
): Promise<ApiResponse<import("@/types").FinancialCalculationResult>> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/calculations/estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const msg = errorData?.detail?.message || `Calculation endpoint returned status ${res.status}`;
      return { data: null, error: msg, isFallback: false };
    }
    const data = await res.json();
    return { data, error: null, isFallback: false };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Network error contacting financial calculation engine",
      isFallback: false,
    };
  }
}

export async function searchPartners(
  payload: PartnerSearchRequest
): Promise<ApiResponse<PartnerSearchResponse>> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/partners/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const msg = errorData?.detail?.message || `Partner locator returned status ${res.status}`;
      return { data: null, error: msg, isFallback: false };
    }
    const data = await res.json();
    return { data, error: null, isFallback: false };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unable to reach the Channel Partner locator service",
      isFallback: false,
    };
  }
}
