export interface Company {
  name: string;
  hqLocation: string;
  isRemoteFriendly: boolean;
  fundingStage: 'Seed' | 'Series A' | 'Series B' | 'Series C' | 'IPO' | 'Public' | 'Bootstrapped';
  technographics: string[]; // e.g. 'In-Vitro', 'Organ-on-Chip', 'NAMs', 'High Content Screening'
  industry: string;
}

export interface Publication {
  title: string;
  year: number;
  keywords: string[];
}

export interface Lead {
  id: string;
  name: string;
  title: string;
  company: Company;
  location: string; // The person's location
  email: string;
  linkedinUrl: string;
  publications: Publication[];
  
  // Scoring / Enrichment
  calculatedScore: number;
  rank: 'Very High' | 'High' | 'Medium' | 'Low';
  scoreBreakdown: {
    roleFit: number;
    companyIntent: number;
    technographic: number;
    location: number;
    scientificIntent: number;
    total: number;
  };
}
