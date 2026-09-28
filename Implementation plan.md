# SAHAYAK AI: Step-by-Step Project Guide

**SIH26092 Comprehensive Developer Manual**

*Complete Blueprint, Repository Setup, API Contracts, Logic Engines, & Hackathon Defense Strategy*

---

## Hackathon Evaluation Edge

Judges consistently penalize teams where LLMs compute numbers or hallucinate government policies. This project guide follows a strict **Hybrid Engine Design**: LangChain/Bhashini extracts intent into structured parameters, while a verified, deterministic **Python + PostGIS** backend executes statutory eligibility, EMI amortization, and spatial NPA routing.

---

## 1. Repository & Directory Structure

Organize the project as a modular monorepo to enable decoupled frontend and backend development:

```text
sahayak-ai/
├── backend/                         # Python FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/          # Router endpoints
│   │   │   │   ├── eligibility.py  # Scheme recommendation API
│   │   │   │   ├── calculator.py   # Scheme-aware EMI & amortization
│   │   │   │   ├── partners.py     # PostGIS geo-routing with NPA filters
│   │   │   │   └── voice_ai.py     # Vernacular intent parsing
│   │   │   └── api.py              # Main API router aggregator
│   │   ├── core/
│   │   │   ├── config.py           # Environment variables
│   │   │   └── database.py         # SQLAlchemy & GeoAlchemy2 engine
│   │   ├── engines/
│   │   │   ├── rule_evaluator.py   # Deterministic policy matcher
│   │   │   ├── loan_calc.py        # Moratorium & EMI schedule calculator
│   │   │   └── routing_ranker.py   # Partner Suitability Score (PSS)
│   │   ├── models/                  # SQLAlchemy ORM Models
│   │   └── schemas/                 # Pydantic v2 I/O Models
│   ├── seed_data/
│   │   ├── schemes.json             # Official SC concession schemes
│   │   └── partners.json            # 150+ simulated SCAs, PSBs, RRBs
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                        # Next.js 14 PWA
│   ├── src/
│   │   ├── app/                     # App Router pages (wizard, map, admin)
│   │   ├── components/
│   │   │   ├── voice-mic.tsx        # Bhashini / Web Speech recorder
│   │   │   ├── partner-map.tsx      # Leaflet.js PostGIS visualizer
│   │   │   ├── emi-slider.tsx       # Dynamic financing interactive chart
│   │   │   └── checklist-modal.tsx  # Application readiness PDF exporter
│   │   └── store/useWizardStore.ts  # Zustand global multi-step form state
│   └── package.json
└── docker-compose.yml               # Spawns Backend, Frontend, Postgres+PostGIS, Redis
```

---

## 2. Complete Database Schema (PostgreSQL + PostGIS)

Run these DDL scripts to establish the scheme catalog, channel partner database, and spatial indexing:

```sql
-- Enable PostGIS & Vector extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: Official Concessional Credit Schemes
CREATE TABLE schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'SC_MICRO_FINANCE', 'SC_TERM_LOAN'
    name VARCHAR(255) NOT NULL,
    scheme_type VARCHAR(50) NOT NULL, -- 'BUSINESS', 'EDUCATION', 'EQUIPMENT'
    max_income_limit NUMERIC(12, 2) DEFAULT 500000.00,
    min_project_cost NUMERIC(12, 2) NOT NULL,
    max_project_cost NUMERIC(12, 2) NOT NULL,
    max_loan_percentage NUMERIC(5, 2) DEFAULT 90.00, -- Up to 90% financed
    min_promoter_contribution NUMERIC(5, 2) DEFAULT 10.00,
    interest_rate_min NUMERIC(5, 2) NOT NULL, -- e.g., 6.50
    interest_rate_max NUMERIC(5, 2) NOT NULL, -- e.g., 8.00
    moratorium_months_min INT DEFAULT 3,
    moratorium_months_max INT DEFAULT 12,
    repayment_tenure_max_years INT NOT NULL,
    required_documents JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table 2: Channel Partner Institutions & Branches
CREATE TABLE channel_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    branch_code VARCHAR(50) NOT NULL,
    partner_type VARCHAR(50) NOT NULL, -- 'SCA', 'PSB', 'RRB', 'NBFC-MFI'
    supported_schemes TEXT[] NOT NULL, -- Array of scheme codes supported
    coordinates GEOMETRY(Point, 4326) NOT NULL, -- PostGIS spatial coordinates (WGS 84)
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),

    -- Operational & Risk Metrics (Criteria for Routing)
    gross_npa_ratio NUMERIC(5, 2) NOT NULL, -- Disqualified if > 5.00%
    has_pending_overdues BOOLEAN DEFAULT FALSE,
    annual_quota_total INT NOT NULL,
    quota_utilized INT NOT NULL,
    historical_avg_turnaround_days INT DEFAULT 14,
    is_operational BOOLEAN DEFAULT TRUE
);

-- Create Spatial Index for Sub-Millisecond Radius Lookups
CREATE INDEX idx_channel_partners_geom
ON channel_partners USING GIST(coordinates);
```

---

## 3. Step-by-Step Implementation Roadmap

### Step 1: Backend Foundation & Deterministic Rules

- Setup FastAPI with SQLAlchemy and connect to PostgreSQL/PostGIS via Docker.
- Implement `engines/rule_evaluator.py`: takes user inputs (income, project cost, caste, purpose) and filters active schemes using SQL/Python constraints.
- Implement `engines/loan_calc.py`: implements standard loan amortization.

### Loan Calculation

```text
Loan Amount = Project Cost × 0.90
Beneficiary Equity = Project Cost × 0.10

Monthly Interest (r) = Annual Rate / 1200
N = Tenure in Months

EMI = [Loan Amount × r × (1 + r)^N] / [(1 + r)^N - 1]
```

The engine accounts for grace periods (moratorium) by computing either simple interest accrual or post-grace capitalized interest.

### Step 2: PostGIS Geo-Spatial Routing with Risk Filtering

Write the PostGIS query in `engines/routing_ranker.py` using `ST_DWithin`:

```sql
SELECT
    id,
    name,
    partner_type,
    gross_npa_ratio,
    ST_Distance(
        coordinates,
        ST_SetSRID(ST_MakePoint(:user_lng, :user_lat), 4326)::geography
    ) / 1000 AS distance_km,
    (quota_utilized::float / annual_quota_total::float) AS quota_saturation
FROM channel_partners
WHERE is_operational = TRUE
  AND gross_npa_ratio <= 5.0
  AND has_pending_overdues = FALSE
  AND :scheme_code = ANY(supported_schemes)
  AND ST_DWithin(
        coordinates,
        ST_SetSRID(ST_MakePoint(:user_lng, :user_lat), 4326)::geography,
        :radius_meters
      )
ORDER BY distance_km ASC;
```

Filtering logic:

- Exclude stressed institutions where `gross_npa_ratio > 5.0`.
- Exclude partners with pending overdues.
- Keep only partners supporting the selected scheme.
- Restrict results to the requested geographic radius.

Calculate the final **Partner Suitability Score (PSS)**:

```text
PSS =
(0.45 × (1 / (1 + distance_km)))
+ (0.35 × (1 - quota_saturation))
+ (0.20 × (1 / turnaround_days))
```

### Step 3: Multilingual Voice & AI Intent Layer

Setup a FastAPI endpoint:

```text
/api/v1/voice/parse-intent
```

Use LangChain/LlamaIndex with a strict JSON-schema prompt to extract fields from vernacular transcripts:

```json
{
  "project_cost": 120000,
  "income": 250000,
  "purpose": "furniture_shop",
  "location": "Wardha"
}
```

Frontend: implement Web Speech API / Bhashini audio capture directly on the browser microphone button.

### Step 4: Frontend Wizard & Interactive Map

Develop a 3-step citizen wizard in Next.js:

1. **Discovery** - Voice or visual sliders for project cost and income.
2. **Scheme & Financial Simulation** - Interactive EMI, interest breakdown, and eligibility breakdown.
3. **Partner Navigation & Application Checklist** - Leaflet OSM map displaying recommended branches with clear suitability tags.

Implement client-side PDF export using `jspdf` or `html2canvas`, giving the user an actionable preparation document with the required checklist.

---

## 4. Winning Defense Strategy for Hackathon Juries

| Question Jury Will Ask | Common Weak Answer | Winning SAHAYAK AI Defense |
|---|---|---|
| **Why use an LLM if government rules are fixed?** | "The LLM decides whether the user gets the loan or not." (Fails immediately). | "We use LLMs exclusively as a bilingual translation and intent parser. All statutory eligibility checks and EMI math run on our deterministic Python rule engine, preventing hallucination." |
| **Why not just show the closest bank on Google Maps?** | "Google Maps shows the closest branch." | "Proximity is misleading. If the nearest branch has exhausted its quota, suffers from >5% NPAs, or does not support Micro Finance, the citizen wastes time. We do operational geo-routing." |
| **Where did you get live NPA data from banks?** | "We connected to live government servers." (Jury knows this is false). | "Live institutional APIs are restricted. We built an enterprise-ready architecture that ingests simulated datasets conforming to RBI/SCA reporting schemas, ready for immediate government integration." |

---

*SAHAYAK AI • SIH26092 End-to-End Project Implementation Guide*
