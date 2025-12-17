import { MOCK_LEADS } from './lib/mockData';
import * as fs from 'fs';

// Generate CSV with all data
const headers = [
    'Rank',
    'Score',
    'Company',
    'Domain',
    'LinkedIn',
    'Amount (USD)',
    'Round',
    'Lead Investor',
    'All Investors',
    'Country',
    'Date Announced',
    'Hiring Tier',
    'Tech Roles',
    'ATS Provider',
    'Careers URL',
    'Source URL',
    'Score: Funding Stage',
    'Score: Funding Amount',
    'Score: Investor Quality',
    'Score: Hiring Activity',
    'Score: Tech Roles'
];

const rows = MOCK_LEADS.map(lead => [
    lead.rank,
    lead.calculatedScore,
    lead.company,
    lead.domain,
    lead.linkedin,
    lead.amount,
    lead.round,
    lead.leadInvestor,
    lead.investors.join('; '),
    lead.country,
    lead.dateAnnounced,
    lead.hiringTier,
    lead.techRoles,
    lead.atsProvider,
    lead.careersUrl,
    lead.sourceUrl,
    lead.scoreBreakdown.fundingStage,
    lead.scoreBreakdown.fundingAmount,
    lead.scoreBreakdown.investorQuality,
    lead.scoreBreakdown.hiringActivity,
    lead.scoreBreakdown.techRoles
]);

// Escape CSV fields
const escapeCSV = (field: any): string => {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
].join('\n');

// Write to file
fs.writeFileSync('fundscout_output.csv', csvContent, 'utf-8');

console.log('✅ CSV exported successfully to fundscout_output.csv');
console.log(`📊 Total companies: ${MOCK_LEADS.length}`);
console.log(`🎯 Very High priority: ${MOCK_LEADS.filter(l => l.rank === 'Very High').length}`);
console.log(`🎯 High priority: ${MOCK_LEADS.filter(l => l.rank === 'High').length}`);
console.log(`📈 Average score: ${Math.round(MOCK_LEADS.reduce((sum, l) => sum + l.calculatedScore, 0) / MOCK_LEADS.length)}`);
