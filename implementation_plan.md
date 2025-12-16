# Biotech Lead Crawler & Probability Engine

## Goal
Build a web agent/dashboard to identify, enrich, and rank biotech leads for 3D in-vitro models.

## Architecture
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS (Premium, Dark Mode, Glassmorphism)
- **Language**: TypeScript
- **Data**: Mock Data Generation (Simulating LinkedIn/PubMed) -> Internal JSON Store -> Dashboard

## Features
1.  **Lead Dashboard**: Table view with Name, Title, Company, Location, Rank, Probability (%).
2.  **Probability Engine**:
    *   **Role Fit (+30)**: Title contains Toxicology, Safety, Hepatic, 3D.
    *   **Company Intent (+20)**: Series A/B Funding.
    *   **Technographics (+15/10)**: Uses In-Vitro / NAMs.
    *   **Location (+10)**: Hubs (Boston, Cambridge, Bay Area, Basel, UK Golden Triangle).
    *   **Scientific Intent (+40)**: Published on DILI/Liver Toxicity in last 2 years.
3.  **Search & Filter**: Filter by Location, Title, Rank.
4.  **Detail View**: (Optional) Pop-over showing score breakdown.

## Implementation Steps
1.  [x] Initialize Project
2.  [ ] Setup Tailwind Theme (Dark/Glass)
3.  [ ] Create Types & Mock Data Generator (`lib/data.ts`)
4.  [ ] Implement Scoring Logic (`lib/scoring.ts`)
5.  [ ] Build UI Components (`components/Dashboard.tsx`, `components/LeadTable.tsx`)
6.  [ ] Assemble Main Page (`app/page.tsx`)
