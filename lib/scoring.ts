import { Lead } from './types';

export const SCORING_WEIGHTS = {
    ROLE_FIT: 30,
    COMPANY_INTENT: 20,
    TECHNOGRAPHIC_IN_VITRO: 15,
    TECHNOGRAPHIC_NAMS: 10,
    LOCATION_HUB: 10,
    SCIENTIFIC_INTENT: 40,
};

const HUBS = ['Boston', 'Cambridge', 'San Francisco', 'Bay Area', 'Basel', 'London', 'Oxford', 'Research Triangle Park', 'San Diego'];
const ROLE_KEYWORDS = ['Toxicology', 'Safety', 'Hepatic', '3D', 'Preclinical', 'Liver', 'Discovery', 'In-Vitro'];
const FUNDING_TARGETS = ['Series A', 'Series B'];

export function calculateScore(leadInput: Omit<Lead, 'calculatedScore' | 'rank' | 'scoreBreakdown'>): Lead {
    let roleFit = 0;
    let companyIntent = 0;
    let technographic = 0;
    let location = 0;
    let scientificIntent = 0;

    // 1. Role Fit (+30)
    // Director of Toxicology, Head of Preclinical Safety
    if (ROLE_KEYWORDS.some(kw => leadInput.title.toLowerCase().includes(kw.toLowerCase()))) {
        roleFit = SCORING_WEIGHTS.ROLE_FIT;
    }

    // 2. Company Intent (+20) - Series A/B
    if (FUNDING_TARGETS.includes(leadInput.company.fundingStage)) {
        companyIntent = SCORING_WEIGHTS.COMPANY_INTENT;
    }

    // 3. Technographic
    // "Company already uses similar tech (e.g., in vitro models), Medium(+15)"
    // "open to New Approach Methodologies (or NAMs), Medium(+10)"
    const techs = leadInput.company.technographics.map(t => t.toLowerCase());
    if (techs.some(t => t.includes('in-vitro') || t.includes('vitro') || t.includes('organ-on-chip'))) {
        technographic += SCORING_WEIGHTS.TECHNOGRAPHIC_IN_VITRO;
    }
    if (techs.some(t => t.includes('nam') || t.includes('new approach'))) {
        technographic += SCORING_WEIGHTS.TECHNOGRAPHIC_NAMS;
    }

    // 4. Location (+10)
    // Located in a Hub
    if (HUBS.some(hub => leadInput.location.toLowerCase().includes(hub.toLowerCase()))) {
        location = SCORING_WEIGHTS.LOCATION_HUB;
    }

    // 5. Scientific Intent (+40)
    // Published relevant paper in last 2 years
    const currentYear = new Date().getFullYear();
    const recentRelevantPubs = leadInput.publications.filter(p => {
        // Last 2 years. Since mock time is 2025, we look at 2024, 2025.
        const isRecent = p.year >= (currentYear - 2);
        const isRelevant = p.keywords.some(k =>
            k.toLowerCase().includes('dili') ||
            k.toLowerCase().includes('liver') ||
            k.toLowerCase().includes('toxicity') ||
            k.toLowerCase().includes('3d')
        );
        return isRecent && isRelevant;
    });

    if (recentRelevantPubs.length > 0) {
        scientificIntent = SCORING_WEIGHTS.SCIENTIFIC_INTENT;
    }

    const rawTotal = roleFit + companyIntent + technographic + location + scientificIntent;
    const totalScore = Math.min(100, rawTotal);

    let rank: Lead['rank'] = 'Low';
    if (totalScore >= 80) rank = 'Very High';
    else if (totalScore >= 60) rank = 'High';
    else if (totalScore >= 40) rank = 'Medium';

    return {
        ...leadInput,
        calculatedScore: totalScore,
        rank,
        scoreBreakdown: {
            roleFit,
            companyIntent,
            technographic,
            location,
            scientificIntent,
            total: totalScore
        }
    };
}
