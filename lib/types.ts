export interface FundingLead {
  id: string;
  company: string;
  domain: string;
  linkedin: string;
  amount: number; // in USD
  round: string;
  investors: string[];
  leadInvestor: string;
  country: string;
  dateAnnounced: string;
  hiringTier: 'A' | 'B' | 'C' | 'Unknown';
  techRoles: number;
  atsProvider: string;
  careersUrl: string;
  sourceUrl: string;

  // Scoring / Enrichment
  calculatedScore: number;
  rank: 'Very High' | 'High' | 'Medium' | 'Low';
  scoreBreakdown: {
    fundingStage: number;
    fundingAmount: number;
    investorQuality: number;
    hiringActivity: number;
    techRoles: number;
    total: number;
  };
}
