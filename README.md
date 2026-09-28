# SAHAYAK AI (सहायक AI)

**Smart India Hackathon 2024 · Problem Statement SIH26092**  
*AI-Driven Scheme Matching, Concessional Finance Guidance, & Geo-Spatial Channel Finance Routing for Marginalized Entrepreneurs*

---

## 1. Project Overview

**SAHAYAK AI** is a multilingual decision-support platform engineered to empower Scheduled Caste (SC) entrepreneurs and students by simplifying access to government concessional credit schemes.

Eligible beneficiaries (annual family income $\le ₹5.00\text{ Lakhs}$) can receive up to 90% financing at concessional interest rates (6.5% – 8.0% p.a.). However, direct loan applications are not accepted by government ministries; funds are disbursed through a **Channel Finance System** of over 100 Channel Partners, including State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), and Regional Rural Banks (RRBs).

SAHAYAK AI bridges this gap with an end-to-end journey:
```text
Home → Assessment (6-Step Wizard) → Results (Scheme Match) → Calculator (Amortization) → Partners (PostGIS Proximity & NPA Routing) → Next Steps (Document Checklist & Print Summary)
```

### Core Cardinal Rule
> **"AI understands and translates; verified code and mathematical engines decide."**  
> All statutory eligibility calculations, EMI amortization, and spatial routing are executed deterministically. Generative models are never permitted to calculate loan amounts or fabricate policy decisions.

---

## 2. Project Architecture & Structure

The repository is organized as a decoupled monorepo:

```text
├── frontend/                        # Next.js 14 App Router + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx             # Public landing page with accessible journey preview
│   │   │   ├── assessment/page.tsx  # 6-step guided wizard (Zod validated, session-persisted)
│   │   │   ├── results/page.tsx     # Demonstration scheme recommendation & alternatives
│   │   │   ├── calculator/page.tsx  # Scheme-aware financial breakdown & stacked outlay bar
│   │   │   ├── partners/page.tsx    # Channel partner directory & illustrative map
│   │   │   └── next-steps/page.tsx  # Interactive document readiness checklist & print view
│   │   ├── components/
│   │   │   ├── ui/                  # Accessible Button, Input, Card, Badge, Stepper, Banner
│   │   │   ├── layout/              # Header, Footer, Navigation, Breadcrumbs
│   │   │   ├── assessment/          # ChoiceCard (48px+ tap targets, accessible radio)
│   │   │   ├── schemes/             # SchemeCard with policy source citations
│   │   │   ├── finance/             # FinancialMetricCard, FinancingContributionBar
│   │   │   └── partners/            # PartnerCard with Gross NPA & overdue indicators
│   │   ├── lib/
│   │   │   ├── api/client.ts        # Typed API client with explicit error handling
│   │   │   ├── fixtures/            # Authoritative demonstration datasets (NSFDC guidelines)
│   │   │   └── validation/          # Zod assessment validation schemas
│   │   └── types/                   # TypeScript definitions
│   ├── Dockerfile
│   └── package.json
│
├── backend/                         # Python FastAPI Modular Monolith
│   ├── app/
│   │   ├── main.py                  # FastAPI factory, CORS, exception handlers
│   │   ├── api/
│   │   │   └── routers/
│   │   │       ├── health.py        # /health (liveness) & /ready (PostGIS readiness check)
│   │   │       ├── schemes.py       # /schemes (catalogue & code lookup)
│   │   │       ├── partners.py      # /partners (fictional branch directory & NPA metrics)
│   │   │       ├── assessments.py   # Scaffolded /assessments/evaluate (HTTP 501 boundary)
│   │   │       └── calculations.py  # Scaffolded /calculations/simulate (HTTP 501 boundary)
│   │   ├── core/                    # Pydantic Settings & sanitized logging
│   │   ├── db/                      # SQLAlchemy 2 engine, session, and readiness probe
│   │   ├── models/                  # SQLAlchemy ORM (Schemes, Partners, Snapshots, Geometry)
│   │   └── schemas/                 # Pydantic v2 request/response models
│   ├── alembic/                     # Migrations enabling PostGIS and creating 6 tables
│   ├── seed.py                      # Idempotent database seed script
│   ├── tests/                       # Pytest test suite (12 automated tests)
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml               # Multi-container setup (PostGIS 16-3.4, Backend, Frontend)
├── design.md                        # Master Product Design Specification
└── README.md
```

---

## 3. Getting Started

### Prerequisites
- **Node.js**: `v18+` (Tested on Node `v26.4.0`)
- **Python**: `3.10+` (Tested on Python `3.14.0`)
- **Docker & Docker Compose**: (Optional for containerized run; standalone mode supported)

---

### Option A: Running with Docker Compose (Recommended for Full Stack)

1. Launch all services (PostgreSQL with PostGIS, FastAPI, and Next.js):
   ```bash
   docker compose up --build
   ```

2. Run database migrations:
   ```bash
   docker compose exec backend alembic upgrade head
   ```

3. Seed demonstration records:
   ```bash
   docker compose exec backend python seed.py
   ```

4. Open your browser:
   - **Frontend App**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000](http://localhost:8000)
   - **Interactive API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option B: Running Standalone Without Docker (Local Development)

#### 1. Backend Setup
```bash
cd backend

# Create and activate Python virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend development server
uvicorn app.main:app --reload --port 8000
```
*Note: If PostgreSQL is not running locally, the backend starts gracefully in standalone mode. `/api/v1/health` returns status OK, and `/api/v1/ready` reports database status.*

#### 2. Frontend Setup
```bash
cd frontend

# Install Node dependencies (lockfile committed)
npm install

# Run Next.js development server
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000).

---

## 4. Running Verification Checks

### Frontend Checks
```bash
cd frontend

# 1. Type check
npm run typecheck

# 2. Production build
npm run build
```

### Backend Checks
```bash
# Run the complete test suite (12 tests covering health, ready, schemes, partners, 501 boundaries)
backend\.venv\Scripts\pytest backend/tests -v
```

---

## 5. API Endpoints Reference

| Method | Endpoint | Description | Status in Step 1 |
|---|---|---|---|
| `GET` | `/` | Root service metadata & quick links | Active |
| `GET` | `/api/v1/health` | Liveness probe | Active (`200 OK`) |
| `GET` | `/api/v1/ready` | Database & PostGIS readiness verification | Active |
| `GET` | `/api/v1/schemes` | Concessional schemes catalogue | Active (Demonstration Data) |
| `GET` | `/api/v1/schemes/{code}` | Single scheme details by code | Active |
| `GET` | `/api/v1/partners` | Channel partner branches with NPA & quota metrics | Active (Demonstration Data) |
| `POST` | `/api/v1/assessments/evaluate` | Production statutory rule-matching engine | Boundary Scaffolded (`501 Not Implemented`) |
| `POST` | `/api/v1/calculations/simulate` | Production loan amortization engine | Boundary Scaffolded (`501 Not Implemented`) |

---

## 6. Design & Accessibility Adherence

The UI strictly follows [design.md](file:///d:/real%20%20sih%20work/design.md):
- **Civic Color Palette**: Civic blue (`#0B5CAD`), Deep navy text (`#172033`), Muted borders (`#C9D3DF`), Soft neutral canvas (`#F7F9FC`).
- **Typography**: Noto Sans font family with future Indic script readiness.
- **Accessibility (WCAG 2.2 AA)**:
  - 48px+ minimum touch targets on buttons and form inputs.
  - Visible keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-primary-600`).
  - Text and icon status pairing (never communicating state by color alone).
  - Respect for `prefers-reduced-motion`.
  - Semantic `<nav aria-label="Assessment Progress">` with `aria-current="step"`.
  - `@media print` stylesheet on the Next Steps page for printing clean guidance summaries.
- **Preliminary Guidance Policy**:
  - Visible "Prototype · Sample data" badges on demonstration screens.
  - Clear statutory disclaimer explaining that preliminary recommendations do not constitute official bank loan approval.

---

## 7. Next Implementation Steps (Step 2 Roadmap)

1. **Deterministic Rule Engine**: Implement `rule_evaluator.py` evaluating discrete parameters (caste, income ceiling $\le ₹5\text{L}$, project cost ranges, age).
2. **Scheme-Aware Financial Simulator**: Implement `loan_calc.py` for exact loan quantum (up to 90%), promoter equity (10%), dynamic grace moratorium interest accrual, and standard monthly amortization.
3. **PostGIS Spatial Router**: Implement `ST_DWithin` radius queries filtering out branches with $>5\%$ Gross NPAs or exhausted quotas, ranking candidates via the Partner Suitability Score (PSS).
4. **Interactive Leaflet OSM Maps**: Replace the illustrative map visualizer with dynamic interactive Leaflet.js tiles and branch markers.
