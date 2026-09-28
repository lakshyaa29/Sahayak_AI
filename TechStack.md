# SAHAYAK AI: Tech Stack & System Architecture

**SIH26092 - Technical Architecture Document**

*AI-Driven Scheme Matching, Concessional Finance Guidance & Geo-Spatial Routing*

| Attribute | Details |
|---|---|
| **Domain** | FinTech / Social Justice |
| **Target Audience** | Marginalized SC Entrepreneurs |
| **Deployment Model** | Offline-First PWA + Microservices |
| **Core Paradigm** | Deterministic Rules + AI Translation |

## Core Architectural Principle

> **"AI understands and translates; verified code and mathematical engines decide."**

In government financial distribution, statutory eligibility and loan arithmetic must never be delegated to non-deterministic generative models. SAHAYAK AI restricts Large Language Models strictly to multilingual intent extraction and contextual document querying, ensuring full auditability, regulatory safety, and zero hallucinations.

## 1. End-to-End System Architecture

```text
[ MULTILINGUAL CITIZEN INTERFACE (PWA) ]
  - Next.js 14 App Router (Offline Service Workers)
  - Bhashini ASR/TTS API
  - Tailwind CSS + Accessible UI Components
  - Zustand Form State
                |
                v
      REST API / WebSockets (TLS Encrypted)

[ FASTAPI API GATEWAY & ORCHESTRATION LAYER ]
  - Pydantic v2 Strict Request Validation
  - Rate-Limiter (Redis)
  - JWT Session Verification
  - Structured Audit Logger
                |
      +---------+---------+
      v         v         v
[ BENEFICIARY AI ]   [ DETERMINISTIC CORE ]   [ GEO-SPATIAL ROUTER ]
  - Natural Intent     - Caste & Income          - PostGIS Proximity Engine
    Extractor            Evaluator               - NPA / Overdue Filter
  - Bhashini /         - Scheme Matrix          - Partner Suitability Ranker
    IndicTrans2           Matcher
  - pgvector Grounded  - Loan & EMI
    RAG                   Amortization
      +---------+---------+
                |
                v
[ PERSISTENCE & INFRASTRUCTURE ]
  - PostgreSQL 16 (Primary Scheme & Partner Store)
  - PostGIS Extension (Spatial Geometries & Polygons)
  - Redis (Cache & Session Store)
  - Dockerized CI/CD Containerization
```

## 2. Architectural Layer & Component Breakdown

### Layer 1: Multilingual Citizen Interface (Frontend)

The frontend is built as a lightweight, mobile-first Progressive Web App (PWA) engineered specifically for low-end Android smartphones and high-latency 2G/3G rural networks:

- **Framework - Next.js 14 (React, App Router):** Enables server-side static page pre-rendering, minimal JavaScript payload delivery, and Service Worker caching for offline checklist review.
- **Styling - Tailwind CSS & Lucide Icons:** Provides utility-first zero-runtime CSS with strict accessibility compliance (WCAG 2.1 AA) and high-contrast styling for outdoor sunlight readability.
- **Voice & Vernacular Integration - Bhashini Open APIs (ULCA) & Web Speech API:** Delivers speech-to-text (ASR) and text-to-speech (TTS) across 22 scheduled Indian languages (Hindi, Marathi, Tamil, Telugu, etc.), eliminating literacy barriers for first-generation rural applicants.
- **Form State Persistence - Zustand:** Manages complex multi-step application wizard forms in client memory without unnecessary DOM re-renders or payload bloat.

### Layer 2: Application Core & AI Orchestration (Backend)

The backend acts as the secure boundary between citizen interactions and governmental eligibility logic:

- **API Server - Python FastAPI:** High-throughput, non-blocking asynchronous architecture built on Starlette and Uvicorn, with native OpenAPI/Swagger auto-documentation.
- **Schema Validation - Pydantic v2:** Enforces compile-time and runtime field verification for all sensitive inputs (e.g., family income ceiling <= Rs. 5,00,000, positive project costs, caste validation flags).
- **Intent & Parameter Extraction - LangChain / LlamaIndex:** Leverages quantized open-weight instruction models (Llama-3-8B via vLLM or Groq / GPT-4o-mini) solely to parse unstructured voice transcripts into structured JSON payloads.

### Layer 3: Deterministic Decision & Scheme-Aware Financial Simulator

To eliminate black-box decision risks and guarantee government-grade auditability:

- **Rule Evaluation Engine:** Custom Python JSON-schema logic engine evaluating discrete parameters: Annual Family Income ceiling (<= Rs. 5,00,000), caste category, project cost bounds (Micro Finance up to Rs. 1,40,000 vs. Term Loans up to Rs. 50,00,000), and applicant age.
- **Financial Simulator (NumPy-Financial):** Computes permissible loan quantum (up to 90% of total project cost), required beneficiary contribution (minimum 10%), dynamic interest schedules (6.5% to 15%), and moratorium amortization (3 to 12 months grace periods).
- **Audit & Traceability Module:** Generates a cryptographically hashed execution trace for every match, logging exact rule-set versions, thresholds satisfied, and rationale for transparent citizen appeals.

### Layer 4: Geo-Spatial Channel Partner Locator & Operational Router

Moving beyond standard proximity search to operationally aware institutional routing:

- **Spatial Extension - PostGIS:** Performs indexed spatial queries (`ST_DWithin`, `ST_Distance`) against geographical coordinates of over 100 Channel Partners (SCAs, PSBs, RRBs, NBFC-MFIs).
- **Operational Suitability Filtering:** Disqualifies institutions with non-operational status, unsupported loan categories, high gross NPA ratios exceeding pre-set regulatory thresholds (>5%), or exhausted annual fund allocations.
- **Partner Suitability Ranking (PSS):** Ranks eligible branches using a multi-criteria decision function:

  ```text
  PSS = w1 * Proximity + w2 * Fund Utilization Quota + w3 * Historical Turnaround
  ```

- **Interactive Map Rendering - Leaflet.js & OpenStreetMap (OSM):** Zero-cost, privacy-respecting, open-source tile rendering without commercial API quota restrictions.

## 3. Data Architecture & Storage Stratification

| Component | Technology Choice | Functional Responsibility |
|---|---|---|
| **Primary RDBMS** | PostgreSQL 16 | Relational master records: beneficiary profiles, verified scheme definitions, channel partner directories, and auditable transaction logs. |
| **Spatial Layer** | PostGIS 3.4 | Geographic indexing of bank branches, district boundaries, and radius-based spatial searches using spatial R-tree indexes. |
| **Vector Engine** | pgvector Extension | Vector embeddings for Retrieval-Augmented Generation (RAG) over official scheme circulars, policy amendments, and FAQs. |
| **In-Memory Cache** | Redis 7 | Ephemeral session management, multi-step state caching, and partner allocation rate-limiting. |
| **DevOps / Runtime** | Docker & Docker Compose | Multi-container orchestration ensuring unified environments between hackathon evaluation and production hosting. |

## 4. Phased Implementation Roadmap for SIH

| Phase | Core Milestone | Key Technical Deliverables |
|---|---|---|
| **Phase 1: Foundation** | Data Modeling & Schema Seeding | PostgreSQL + PostGIS schema creation; seeding 5 flagship SC schemes + 150 simulated channel partner branches across pilot districts with operational metrics. |
| **Phase 2: Core Logic** | Decision & Routing Backend | FastAPI endpoints implementing deterministic eligibility filtering, loan amortization math, and PostGIS distance/NPA scoring. |
| **Phase 3: AI Layer** | Multilingual NLP & RAG Pipeline | Integration of Bhashini voice endpoints; LangChain parameter extractor; grounded policy FAQ retrieval with pgvector. |
| **Phase 4: Frontend** | Progressive Web App Interface | Next.js 3-step interactive citizen wizard (Voice/Text Input -> Scheme & EMI Simulator -> Interactive Leaflet Routing Map). |
| **Phase 5: Readiness** | Auditability & Document Checklist | Application readiness checklist generator exporting structured PDF summary for physical bank submission. |

---

*SAHAYAK AI - SIH26092 Technical Architecture Specification*
