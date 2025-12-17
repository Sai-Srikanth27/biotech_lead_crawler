'use client';

import { useState, useMemo } from 'react';
import { MOCK_LEADS } from '@/lib/mockData';
import { FundingLead } from '@/lib/types';
import { Search, TrendingUp, Building2, Users, Download, DollarSign } from 'lucide-react';
import clsx from 'clsx';

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [minScore, setMinScore] = useState(0);

    const filteredLeads = useMemo(() => {
        return MOCK_LEADS.filter(lead => {
            const matchesSearch =
                lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.round.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.investors.some(inv => inv.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCountry = countryFilter ? lead.country.toLowerCase().includes(countryFilter.toLowerCase()) : true;
            const matchesScore = lead.calculatedScore >= minScore;

            return matchesSearch && matchesCountry && matchesScore;
        });
    }, [searchQuery, countryFilter, minScore]);

    const exportToCSV = () => {
        // Helper function to escape CSV fields
        const escapeCSV = (field: any): string => {
            if (field === null || field === undefined || field === '') return '';
            const str = String(field);
            // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const headers = ['Rank', 'Score', 'Company', 'Domain', 'Round', 'Amount (USD)', 'Lead Investor', 'Country', 'Hiring Tier', 'Tech Roles', 'Careers URL'];

        const rows = filteredLeads.map(lead => [
            lead.rank,
            lead.calculatedScore,
            lead.company,
            lead.domain,
            lead.round,
            lead.amount,
            lead.leadInvestor,
            lead.country,
            lead.hiringTier,
            lead.techRoles,
            lead.careersUrl
        ].map(escapeCSV).join(','));

        // Add BOM for Excel compatibility
        const BOM = '\uFEFF';
        const csvContent = BOM + [headers.join(','), ...rows].join('\n');

        // Create blob instead of data URI for better compatibility
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'fundscout_leads_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans selection:bg-purple-500/30">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                        FundScout AI
                    </h1>
                    <p className="text-slate-400 mt-1">AI-Powered Investment & Partnership Lead Prioritization</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg border border-slate-700 hover:bg-slate-800 transition text-sm font-medium active:scale-95"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Companies" value={MOCK_LEADS.length} icon={<Building2 size={20} />} />
                <StatCard title="High Priority" value={MOCK_LEADS.filter(l => l.rank === 'Very High' || l.rank === 'High').length} icon={<TrendingUp size={20} />} color="text-teal-400" />
                <StatCard title="Active Hiring" value={MOCK_LEADS.filter(l => l.hiringTier === 'A' || l.hiringTier === 'B').length} icon={<Users size={20} />} color="text-blue-400" />
                <StatCard title="Avg Funding" value={`$${Math.round(MOCK_LEADS.reduce((sum, l) => sum + l.amount, 0) / MOCK_LEADS.length / 1000000)}M`} icon={<DollarSign size={20} />} color="text-amber-400" />
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search company, round, investors..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:outline-none transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                >
                    <option value="">All Countries</option>
                    <option value="USA">USA</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">UK</option>
                    <option value="Israel">Israel</option>
                    <option value="Finland">Finland</option>
                </select>
                <select
                    className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                >
                    <option value="0">All Priorities</option>
                    <option value="35">Medium (35+)</option>
                    <option value="55">High (55+)</option>
                    <option value="75">Very High (75+)</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden backdrop-blur-md shadow-2xl">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-xs border-b border-slate-800 font-medium">
                        <tr>
                            <th className="px-6 py-4">Rank</th>
                            <th className="px-6 py-4">Score</th>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Funding</th>
                            <th className="px-6 py-4">Investors</th>
                            <th className="px-6 py-4">Hiring</th>
                            <th className="px-6 py-4">Signals</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {filteredLeads.map(lead => (
                            <LeadRow key={lead.id} lead={lead} />
                        ))}
                        {filteredLeads.length === 0 && (
                            <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-500">No companies found matching criteria.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 text-center text-xs text-slate-600">
                © {new Date().getFullYear()} KAMBHAMPATI SAI SRIKANTH. All rights reserved.
            </div>
        </div>
    );
}

function LeadRow({ lead }: { lead: FundingLead }) {
    const getRankColor = (rank: string) => {
        switch (rank) {
            case 'Very High': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]';
            case 'High': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    const formatAmount = (amount: number) => {
        if (amount === 0) return 'Undisclosed';
        if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
        if (amount >= 1000000) return `$${(amount / 1000000).toFixed(0)}M`;
        return `$${(amount / 1000).toFixed(0)}K`;
    };

    return (
        <tr className="hover:bg-slate-800/30 transition duration-200 group">
            <td className="px-6 py-4 align-top">
                <span className={clsx("px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide border", getRankColor(lead.rank))}>
                    {lead.rank}
                </span>
            </td>
            <td className="px-6 py-4 align-top">
                <div className="group/score relative cursor-help">
                    <div className="font-mono font-medium text-slate-200 text-base">
                        {lead.calculatedScore}<span className="text-slate-600 text-sm">/100</span>
                    </div>
                    <div className="w-16 h-1 mt-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-teal-400" style={{ width: `${lead.calculatedScore}%` }}></div>
                    </div>

                    {/* Score Breakdown Tooltip */}
                    <div className="absolute left-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl z-10 opacity-0 group-hover/score:opacity-100 transition-opacity pointer-events-none group-hover/score:pointer-events-auto">
                        <div className="text-xs font-semibold text-slate-400 uppercase mb-2 border-b border-slate-800 pb-1">Score Breakdown</div>
                        <div className="space-y-1 text-xs">
                            {lead.scoreBreakdown.fundingStage > 0 && (
                                <div className="flex justify-between text-emerald-400"><span>Funding Stage</span><span>+{lead.scoreBreakdown.fundingStage}</span></div>
                            )}
                            {lead.scoreBreakdown.fundingAmount > 0 && (
                                <div className="flex justify-between text-blue-400"><span>Funding Amount</span><span>+{lead.scoreBreakdown.fundingAmount}</span></div>
                            )}
                            {lead.scoreBreakdown.investorQuality > 0 && (
                                <div className="flex justify-between text-amber-400"><span>Investor Quality</span><span>+{lead.scoreBreakdown.investorQuality}</span></div>
                            )}
                            {lead.scoreBreakdown.hiringActivity > 0 && (
                                <div className="flex justify-between text-purple-400"><span>Hiring Activity</span><span>+{lead.scoreBreakdown.hiringActivity}</span></div>
                            )}
                            {lead.scoreBreakdown.techRoles > 0 && (
                                <div className="flex justify-between text-slate-300"><span>Tech Roles</span><span>+{lead.scoreBreakdown.techRoles}</span></div>
                            )}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 align-top">
                <div className="font-semibold text-slate-100 group-hover:text-teal-400 transition-colors">{lead.company}</div>
                <a href={lead.domain} target="_blank" rel="noopener noreferrer" className="text-slate-500 text-xs mt-0.5 hover:text-teal-400 transition block truncate max-w-[200px]">{lead.domain}</a>
            </td>
            <td className="px-6 py-4 align-top">
                <div className="text-slate-200 font-medium">{formatAmount(lead.amount)}</div>
                <div className="text-slate-500 text-xs mt-0.5">{lead.round || 'N/A'}</div>
                <div className="text-slate-600 text-[10px] mt-0.5">{lead.dateAnnounced}</div>
            </td>
            <td className="px-6 py-4 align-top max-w-[200px]">
                {lead.leadInvestor && (
                    <div className="text-slate-200 font-medium text-xs mb-1">{lead.leadInvestor}</div>
                )}
                <div className="text-slate-500 text-[10px] line-clamp-2">
                    {lead.investors.slice(0, 3).join(', ')}
                    {lead.investors.length > 3 && ` +${lead.investors.length - 3} more`}
                </div>
            </td>
            <td className="px-6 py-4 align-top">
                <div className="flex items-center gap-2">
                    <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold", {
                        'bg-green-500/20 text-green-300': lead.hiringTier === 'A',
                        'bg-blue-500/20 text-blue-300': lead.hiringTier === 'B',
                        'bg-slate-500/20 text-slate-400': lead.hiringTier === 'C'
                    })}>
                        Tier {lead.hiringTier}
                    </span>
                    {lead.techRoles > 0 && (
                        <span className="text-slate-400 text-xs">{lead.techRoles} roles</span>
                    )}
                </div>
                {lead.atsProvider && (
                    <div className="text-slate-600 text-[10px] mt-1">{lead.atsProvider}</div>
                )}
            </td>
            <td className="px-6 py-4 align-top">
                <div className="flex flex-wrap gap-1.5">
                    {lead.scoreBreakdown.fundingStage > 0 && (
                        <span title="Target funding stage (Series A/B/C)" className="cursor-help px-1.5 py-0.5 bg-emerald-500/10 text-emerald-300 rounded text-[10px] border border-emerald-500/20 hover:border-emerald-500/40 transition">Stage</span>
                    )}
                    {lead.scoreBreakdown.fundingAmount > 0 && (
                        <span title="Large funding round" className="cursor-help px-1.5 py-0.5 bg-blue-500/10 text-blue-300 rounded text-[10px] border border-blue-500/20 hover:border-blue-500/40 transition">Amount</span>
                    )}
                    {lead.scoreBreakdown.investorQuality > 0 && (
                        <span title="Top-tier investors" className="cursor-help px-1.5 py-0.5 bg-amber-500/10 text-amber-300 rounded text-[10px] border border-amber-500/20 hover:border-amber-500/40 transition">Investors</span>
                    )}
                    {lead.scoreBreakdown.hiringActivity > 0 && (
                        <span title="Active hiring (Tier A/B)" className="cursor-help px-1.5 py-0.5 bg-purple-500/10 text-purple-300 rounded text-[10px] border border-purple-500/20 hover:border-purple-500/40 transition">Hiring</span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 align-top">
                {lead.careersUrl ? (
                    <a href={lead.careersUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-slate-200 bg-blue-600 rounded-md hover:bg-blue-500 transition-colors">
                        Careers
                    </a>
                ) : (
                    <a href={lead.domain} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors">
                        Visit
                    </a>
                )}
            </td>
        </tr>
    );
}

function StatCard({ title, value, icon, color = "text-slate-100" }: { title: string, value: number | string, icon: React.ReactNode, color?: string }) {
    return (
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition">
            <div className={`p-3 bg-slate-950 rounded-lg shadow-inner ${color}`}>{icon}</div>
            <div>
                <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-0.5">{title}</div>
                <div className="text-2xl font-bold text-slate-100">{value}</div>
            </div>
        </div>
    )
}
