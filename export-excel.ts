import { MOCK_LEADS } from './lib/mockData';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

// Prepare data for Excel
const data = MOCK_LEADS.map(lead => ({
    'Rank': lead.rank,
    'Score': lead.calculatedScore,
    'Company': lead.company,
    'Domain': lead.domain,
    'LinkedIn': lead.linkedin,
    'Amount (USD)': lead.amount,
    'Round': lead.round,
    'Lead Investor': lead.leadInvestor,
    'All Investors': lead.investors.join('; '),
    'Country': lead.country,
    'Date Announced': lead.dateAnnounced,
    'Hiring Tier': lead.hiringTier,
    'Tech Roles': lead.techRoles,
    'ATS Provider': lead.atsProvider,
    'Careers URL': lead.careersUrl,
    'Source URL': lead.sourceUrl,
    'Score: Funding Stage': lead.scoreBreakdown.fundingStage,
    'Score: Funding Amount': lead.scoreBreakdown.fundingAmount,
    'Score: Investor Quality': lead.scoreBreakdown.investorQuality,
    'Score: Hiring Activity': lead.scoreBreakdown.hiringActivity,
    'Score: Tech Roles': lead.scoreBreakdown.techRoles
}));

// Create workbook and worksheet
const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'FundScout Leads');

// Auto-size columns
const maxWidth = 50;
const colWidths = Object.keys(data[0]).map(key => {
    const maxLen = Math.max(
        key.length,
        ...data.map(row => String(row[key as keyof typeof row] || '').length)
    );
    return { wch: Math.min(maxLen + 2, maxWidth) };
});
worksheet['!cols'] = colWidths;

// Write to Excel file
XLSX.writeFile(workbook, 'fundscout_output.xlsx');

console.log('✅ Excel file exported successfully to fundscout_output.xlsx');
console.log(`📊 Total companies: ${MOCK_LEADS.length}`);
console.log(`🎯 Very High priority: ${MOCK_LEADS.filter(l => l.rank === 'Very High').length}`);
console.log(`🎯 High priority: ${MOCK_LEADS.filter(l => l.rank === 'High').length}`);
console.log(`📈 Average score: ${Math.round(MOCK_LEADS.reduce((sum, l) => sum + l.calculatedScore, 0) / MOCK_LEADS.length)}`);
