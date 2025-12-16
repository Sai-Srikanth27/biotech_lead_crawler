# Biotech Lead Crawler & Probability Engine

## Goal
Build a web agent/dashboard to identify, enrich, and rank biotech leads for 3D in-vitro models.

## Implementation Status
- [x] **Project Setup**: Next.js 15, Tailwind CSS, TypeScript.
- [x] **Data Engine**:
    - `lib/types.ts`: Defined Lead schema.
    - `lib/mockData.ts`: Generated realistic biotech profiles.
    - `lib/scoring.ts`: Implemented weighted probability algorithm (Role +30, Funding +20, etc).
- [x] **User Interface**:
    - `components/Dashboard.tsx`: Interactive dashboard with filtering, search, and stats.
    - Glassmorphic design with dark mode aesthetics.
- [x] **Ready to Run**: Run `npm run dev` to launch.

## Next/Advanced Steps (Future)
1.  **Backend Integration**: Connect `lib/data.ts` to a real database (Postgres).
2.  **API Connections**:
    - **LinkedIn**: Integrate Proxycurl API or RapidAPI for real profile fetching.
    - **PubMed**: Use NCBI E-utilities API to check scientific intent.
    - **Crunchbase**: Use Crunchbase API for funding data.
3.  **Crawler**: Build a Python service (Selenium/Playwright) to feed the database if APIs are cost-prohibitive.
