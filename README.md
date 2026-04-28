# ClaimLens — AI-Powered Claims Review Platform

A production-grade healthcare claims review dashboard that surfaces AI-driven decisions for claim adjudicators. Built with a feature-based architecture and a glassmorphic dark/light design system.

---

## Problem Statements Covered

| Dashboard | Problem | Description |
|-----------|---------|-------------|
| **Claim Decision Engine** | 1 & 3 | End-to-end claim review: STG compliance, document inventory, treatment timeline, financial analysis, fraud signals, and final adjudication actions |
| **Imaging Validation** | 2 | Medical image vs. radiology report consistency analysis: AI findings, NLP extraction, correlation tables, inconsistency detection, and STG alignment |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3 + DaisyUI 4 |
| State | Redux Toolkit (slices) |
| Data Fetching | RTK Query (mock base query) |
| Animations | Framer Motion 11 |
| Charts | Recharts 2 |
| Icons | Inline SVG |

---

## Project Structure

```
claim-lens/
├── index.html
├── vite.config.ts
├── tailwind.config.cjs
├── postcss.config.cjs
├── tsconfig.json
└── src/
    ├── main.tsx                      # Entry point
    ├── App.tsx                       # Router + ThemeSyncer (Redux → data-theme)
    ├── index.css                     # Global styles, design tokens, glass utilities
    │
    ├── app/
    │   ├── store.ts                  # Redux store (RTK + middleware)
    │   └── hooks.ts                  # Typed useAppDispatch / useAppSelector
    │
    ├── types/
    │   ├── common.ts                 # Status, RiskLevel, MatchStatus, RuleStatus
    │   ├── claims.ts                 # ClaimDecision, ClaimSummary, STGRule, …
    │   └── imaging.ts                # ImagingAnalysis, AIFinding, CorrelationRow, …
    │
    ├── data/
    │   ├── mockClaims.ts             # Full mock ClaimDecision object
    │   └── mockImaging.ts            # Full mock ImagingAnalysis object
    │
    ├── services/
    │   ├── baseQuery.ts              # Mock RTK Query base query (simulates latency)
    │   ├── claimsApi.ts              # getClaimDecision, approveClaim, rejectClaim, sendQuery
    │   └── imagingApi.ts             # getImagingAnalysis
    │
    ├── features/
    │   ├── ui/
    │   │   └── uiSlice.ts            # theme, activeModal, selectedVisualProof
    │   ├── claims/
    │   │   ├── claimsSlice.ts        # selectedClaimId, filterStatus, searchQuery
    │   │   └── components/
    │   │       ├── DecisionSummaryPanel.tsx   # Sticky top: status, confidence, risk, reasons
    │   │       ├── PatientClaimCard.tsx       # Patient demographics + claim metadata
    │   │       ├── DocumentInventory.tsx      # Present / missing documents with flags
    │   │       ├── VisualProofPanel.tsx       # Stamp, signature, sticker, QR detection
    │   │       ├── DocumentPreviewModal.tsx   # Redux-driven Framer Motion modal
    │   │       ├── STGComplianceTable.tsx     # Rule vs observed table + compliance score
    │   │       ├── TreatmentTimeline.tsx      # Day-by-day vertical timeline with gap alerts
    │   │       ├── FinancialAnalysis.tsx      # Recharts bar + itemised table + fraud signals
    │   │       └── RecommendedActions.tsx     # Approve / Send Query / Reject RTK mutations
    │   └── imaging/
    │       ├── imagingSlice.ts       # selectedStudyId, activeImageIndex, zoom, contrast
    │       └── components/
    │           ├── ImagingHeaderPanel.tsx     # Claim metadata bar + key findings summary
    │           ├── ImageViewer.tsx            # Mock SVG scan + Redux zoom/contrast controls
    │           ├── AIFindingsPanel.tsx        # Per-finding detection + confidence bars
    │           ├── MultiImageAnalysis.tsx     # X-Ray/CT/MRI cards with active-image Redux state
    │           ├── NLPReportExtraction.tsx    # Extracted diagnosis, severity, findings
    │           ├── FindingCorrelationTable.tsx# AI vs report match/mismatch/partial table
    │           ├── InconsistencyDetection.tsx # Warning / pass inconsistency alerts
    │           ├── STGAlignmentPanel.tsx      # Package claimed vs evidence checklist
    │           └── RadiologyTimeline.tsx      # Day-by-day modality timeline
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx            # Sticky nav + theme toggle (Sun/Moon SVG)
    │   │   └── PageLayout.tsx        # Max-width wrapper
    │   └── ui/                       # Reusable primitives (barrel-exported from index.ts)
    │       ├── StatusBadge.tsx       # PASS / FAIL / CONDITIONAL pill
    │       ├── RiskIndicator.tsx     # Animated bar-chart risk meter
    │       ├── AnimatedCounter.tsx   # rAF-based ease-out counter
    │       ├── ProgressBar.tsx       # Framer Motion animated bar (auto-colours by value)
    │       ├── InfoCard.tsx          # Label + value tile with optional icon
    │       ├── SectionContainer.tsx  # Accordion with Framer Motion collapse
    │       ├── DataTable.tsx         # Generic typed table with row-highlight support
    │       ├── Timeline.tsx          # Vertical timeline with gap-detection entries
    │       ├── SkeletonLoader.tsx    # Pulse skeletons + full-page layout skeletons
    │       └── Tooltip.tsx           # Hover tooltip (top/bottom)
    │
    ├── pages/
    │   ├── ClaimDashboard.tsx        # Claim Decision Engine page (RTK Query fetch)
    │   └── ImagingDashboard.tsx      # Imaging Validation page (RTK Query fetch)
    │
    └── utils/
        └── formatters.ts             # formatCurrency (₹ en-IN), formatPercent, clamp
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type-check
npx tsc --noEmit

# Production build
npm run build
```

The dev server starts at **http://localhost:5173**

---

## Key Features

### Claim Decision Engine (`/claims`)
- **Sticky decision summary** — status badge, animated confidence counter, risk meter, STG compliance bar, key reasons
- **Document inventory** — present/missing detection with duplicate and low-quality flags
- **Visual proof panel** — hospital stamp, doctor signature, implant sticker, QR/barcode with preview modal
- **STG compliance table** — rule-by-rule expected vs observed with pass/warn/fail status; rows highlighted red on fail
- **Treatment timeline** — vertical day-by-day timeline with automatic gap detection alerts
- **Financial analysis** — Recharts horizontal bar chart + itemised table + fraud signal cards
- **Recommended actions panel** — Approve / Send Query / Reject with RTK Query mutations and loading spinners

### Imaging Validation (`/imaging`)
- **Interactive scan viewer** — mock SVG bone anatomy with animated bounding boxes; Redux-connected zoom and contrast controls
- **AI clinical findings** — per-finding detection status with Framer Motion confidence progress bars
- **Multi-image analysis** — X-Ray / CT / MRI cards with Redux `activeImageIndex` sync to viewer
- **NLP report extraction** — extracted diagnosis, severity, and findings with extraction confidence badge
- **Finding correlation table** — image AI vs report match/mismatch/partial with row-level red highlighting
- **Inconsistency detection** — warning and pass alert cards
- **STG alignment** — evidence checklist for claimed package with compliance score bar
- **Radiology timeline** — modality sequence with clinical logic assessment

### Design System
- **Glassmorphism** — `backdrop-blur`, per-theme CSS variable tokens (`--glass-bg`, `--glass-shadow`, etc.)
- **Dark / Light toggle** — `ThemeSyncer` component keeps `<html data-theme>` in sync with Redux; CSS variables flip the entire palette instantly
- **Framer Motion** — staggered list entrances, accordion expand/collapse, animated scan line, spring modals
- **Skeleton loaders** — full-layout skeletons displayed while RTK Query fetches
- **AnimatedCounter** — `requestAnimationFrame` ease-out used for confidence % on load

---

## State Management

```
Redux Store
├── claims       (selectedClaimId, filterStatus, searchQuery)
├── imaging      (selectedStudyId, activeImageIndex, zoomLevel, contrastLevel)
├── ui           (theme, activeModal, selectedVisualProof)
├── claimsApi    (RTK Query: getClaimDecision, approveClaim, rejectClaim, sendQuery)
└── imagingApi   (RTK Query: getImagingAnalysis)
```

RTK Query uses a **mock base query** (`src/services/baseQuery.ts`) that simulates 700–1200 ms network latency and returns data from the local mock objects. Swap `mockBaseQuery` for `fetchBaseQuery` with a real `baseUrl` to connect to a live API with zero other changes.

---

## Theme System

Themes are defined as scoped CSS variable blocks in `src/index.css`:

```css
[data-theme="claimlens"] {          /* dark */
  --glass-bg:    rgba(255,255,255,0.03);
  --header-bg:   rgba(5,13,26,0.84);
  --body-bg:     #050d1a;
  /* … */
}

[data-theme="light"] {
  --glass-bg:    rgba(255,255,255,0.85);
  --header-bg:   rgba(248,250,252,0.92);
  --body-bg:     #f1f5f9;
  /* … */
}
```

`ThemeSyncer` (inside the Redux `Provider`) watches `state.ui.theme` and updates `document.documentElement.setAttribute('data-theme', …)` on every change. All `.glass`, `.glass-elevated`, and layout components consume these variables, so the entire UI adapts without component re-renders.

---

## Connecting to a Real API

1. Open `src/services/baseQuery.ts`
2. Replace `mockBaseQuery` with RTK Query's `fetchBaseQuery`:

```ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const realBaseQuery = fetchBaseQuery({
  baseUrl: 'https://your-api.example.com/v1',
  prepareHeaders: (headers) => {
    headers.set('Authorization', `Bearer ${getToken()}`);
    return headers;
  },
});
```

3. Import `realBaseQuery` in `claimsApi.ts` and `imagingApi.ts` instead of `mockBaseQuery`

All loading states, error handling, and caching behaviour is already wired — nothing else needs to change.
