import { FundingLead } from './types';

export const SCORING_WEIGHTS = {
    FUNDING_STAGE: 30,      // Series A/B
    FUNDING_AMOUNT: 25,     // Large raises ($20M+)
    INVESTOR_QUALITY: 20,   // Top-tier VCs
    HIRING_ACTIVITY: 15,    // Hiring Tier A/B
    TECH_ROLES: 10,         // Number of tech positions
};

const TARGET_ROUNDS = ['Series A', 'Series B', 'Series C'];
const TOP_TIER_INVESTORS = [
    'Sequoia Capital', 'Andreessen Horowitz', 'a16z', 'Khosla Ventures',
    'Accel', 'Greylock', 'Benchmark', 'Lightspeed', 'Index Ventures',
    'General Catalyst', 'Battery Ventures', 'Insight Partners',
    'Y Combinator', 'Lux Capital', 'NEA', 'Atomico'
];

export function calculateScore(leadInput: Omit<FundingLead, 'calculatedScore' | 'rank' | 'scoreBreakdown'>): FundingLead {
    let fundingStage = 0;
    let fundingAmount = 0;
    let investorQuality = 0;
    let hiringActivity = 0;
    let techRoles = 0;

    // 1. Funding Stage (+30) - Series A/B/C preferred
    if (TARGET_ROUNDS.some(round => leadInput.round.toLowerCase().includes(round.toLowerCase()))) {
        fundingStage = SCORING_WEIGHTS.FUNDING_STAGE;
    }

    // 2. Funding Amount (+25) - Large raises
    if (leadInput.amount >= 50000000) {
        fundingAmount = SCORING_WEIGHTS.FUNDING_AMOUNT;
    } else if (leadInput.amount >= 20000000) {
        fundingAmount = Math.floor(SCORING_WEIGHTS.FUNDING_AMOUNT * 0.7);
    } else if (leadInput.amount >= 10000000) {
        fundingAmount = Math.floor(SCORING_WEIGHTS.FUNDING_AMOUNT * 0.4);
    }

    // 3. Investor Quality (+20) - Top-tier VCs
    const hasTopInvestor = leadInput.investors.some(inv =>
        TOP_TIER_INVESTORS.some(top => inv.toLowerCase().includes(top.toLowerCase()))
    ) || TOP_TIER_INVESTORS.some(top => leadInput.leadInvestor.toLowerCase().includes(top.toLowerCase()));

    if (hasTopInvestor) {
        investorQuality = SCORING_WEIGHTS.INVESTOR_QUALITY;
    }

    // 4. Hiring Activity (+15) - Tier A/B
    if (leadInput.hiringTier === 'A') {
        hiringActivity = SCORING_WEIGHTS.HIRING_ACTIVITY;
    } else if (leadInput.hiringTier === 'B') {
        hiringActivity = Math.floor(SCORING_WEIGHTS.HIRING_ACTIVITY * 0.6);
    }

    // 5. Tech Roles (+10) - Number of open positions
    if (leadInput.techRoles >= 10) {
        techRoles = SCORING_WEIGHTS.TECH_ROLES;
    } else if (leadInput.techRoles >= 5) {
        techRoles = Math.floor(SCORING_WEIGHTS.TECH_ROLES * 0.7);
    } else if (leadInput.techRoles >= 1) {
        techRoles = Math.floor(SCORING_WEIGHTS.TECH_ROLES * 0.3);
    }

    const rawTotal = fundingStage + fundingAmount + investorQuality + hiringActivity + techRoles;
    const totalScore = Math.min(100, rawTotal);

    let rank: FundingLead['rank'] = 'Low';
    if (totalScore >= 75) rank = 'Very High';
    else if (totalScore >= 55) rank = 'High';
    else if (totalScore >= 35) rank = 'Medium';

    return {
        ...leadInput,
        calculatedScore: totalScore,
        rank,
        scoreBreakdown: {
            fundingStage,
            fundingAmount,
            investorQuality,
            hiringActivity,
            techRoles,
            total: totalScore
        }
    };
}
