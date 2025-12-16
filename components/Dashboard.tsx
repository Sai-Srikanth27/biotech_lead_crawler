'use client';

import { useState, useMemo } from 'react';
import { MOCK_LEADS } from '@/lib/mockData';
import { Lead } from '@/lib/types';
import { Search, MapPin, Building2, FlaskConical, Download } from 'lucide-react';
import clsx from 'clsx';

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [minScore, setMinScore] = useState(0);

    const filteredLeads = useMemo(() => {
        return MOCK_LEADS.filter(lead => {
            const matchesSearch =
                lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.company.name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesLocation = locationFilter ? lead.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
            const matchesScore = lead.calculatedScore >= minScore;

            return matchesSearch && matchesLocation && matchesScore;
        });
    }, [searchQuery, locationFilter, minScore]);

    const exportToCSV = () => {
        const headers = ['Rank,Score,Name,Title,Company,Location,Email,LinkedIn'];
        const rows = filteredLeads.map(lead =>
            [
                lead.rank,
                lead.calculatedScore,
                `"${lead.name}"`,
                `"${lead.title}"`,
                `"${lead.company.name}"`,
                `"${lead.location}"`,
                lead.email,
                lead.linkedinUrl
            ].join(',')
        );

        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "biotech_leads_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans selection:bg-purple-500/30">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                        BioScout 3D
                    </h1>
                    <p className="text-slate-400 mt-1">AI-Powered Lead Prioritization for 3D In-Vitro Models</p>
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
                <StatCard title="Total Leads Scanned" value={MOCK_LEADS.length} icon={<Search size={20} />} />
                <StatCard title="High Probability" value={MOCK_LEADS.filter(l => l.rank === 'Very High' || l.rank === 'High').length} icon={<FlaskConical size={20} />} color="text-teal-400" />
                <StatCard title="Hub Locations" value={MOCK_LEADS.filter(l => l.scoreBreakdown.location > 0).length} icon={<MapPin size={20} />} color="text-blue-400" />
                <StatCard title="Funded Companies" value={MOCK_LEADS.filter(l => l.scoreBreakdown.companyIntent > 0).length} icon={<Building2 size={20} />} color="text-amber-400" />
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search name, title, company..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:outline-none transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                >
                    <option value="">All Locations</option>
                    <option value="Cambridge">Cambridge</option>
                    <option value="Boston">Boston</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="Remote">Remote</option>
                    <option value="London">London</option>
                    <option value="Basel">Basel</option>
                </select>
                <select
                    className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                >
                    <option value="0">All Probabilities</option>
                    <option value="40">Medium (40+)</option>
                    <option value="60">High (60+)</option>
                    <option value="80">Very High (80+)</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden backdrop-blur-md shadow-2xl">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-xs border-b border-slate-800 font-medium">
                        <tr>
                            <th className="px-6 py-4">Rank</th>
                            <th className="px-6 py-4">Probability</th>
                            <th className="px-6 py-4">Name / Title</th>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Weighted Signals</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {filteredLeads.map(lead => (
                            <LeadRow key={lead.id} lead={lead} />
                        ))}
                        {filteredLeads.length === 0 && (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">No leads found matching criteria.</td></tr>
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

function LeadRow({ lead }: { lead: Lead }) {
    const getRankColor = (rank: string) => {
        switch (rank) {
            case 'Very High': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]';
            case 'High': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
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
                            {lead.scoreBreakdown.scientificIntent > 0 && (
                                <div className="flex justify-between text-emerald-400"><span>Scientific Intent</span><span>+{lead.scoreBreakdown.scientificIntent}</span></div>
                            )}
                            {lead.scoreBreakdown.roleFit > 0 && (
                                <div className="flex justify-between text-blue-400"><span>Role Fit</span><span>+{lead.scoreBreakdown.roleFit}</span></div>
                            )}
                            {lead.scoreBreakdown.companyIntent > 0 && (
                                <div className="flex justify-between text-amber-400"><span>Funding</span><span>+{lead.scoreBreakdown.companyIntent}</span></div>
                            )}
                            {lead.scoreBreakdown.technographic > 0 && (
                                <div className="flex justify-between text-purple-400"><span>Tech Fit</span><span>+{lead.scoreBreakdown.technographic}</span></div>
                            )}
                            {lead.scoreBreakdown.location > 0 && (
                                <div className="flex justify-between text-slate-300"><span>Location</span><span>+{lead.scoreBreakdown.location}</span></div>
                            )}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 align-top">
                <div className="font-semibold text-slate-100 group-hover:text-teal-400 transition-colors">{lead.name}</div>
                <div className="text-slate-400 text-xs mt-0.5">{lead.title}</div>
            </td>
            <td className="px-6 py-4 align-top">
                <div className="text-slate-200 font-medium">{lead.company.name}</div>
                <div className="text-slate-500 text-xs mt-0.5 flex flex-wrap gap-1">
                    <span>{lead.company.fundingStage}</span>
                    <span>•</span>
                    <span>{lead.company.industry}</span>
                </div>
                {lead.company.technographics.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                        {lead.company.technographics.map((t, i) => (
                            <span key={i} className="text-[10px] text-slate-500 bg-slate-800 px-1 rounded">{t}</span>
                        ))}
                    </div>
                )}
            </td>
            <td className="px-6 py-4 align-top">
                <div className="flex items-start gap-1.5 text-slate-300 text-sm">
                    <MapPin size={14} className="text-slate-500 mt-0.5 shrink-0" />
                    <div>
                        <div>{lead.location}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">HQ: {lead.company.hqLocation}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 align-top">
                <div className="flex flex-wrap gap-1.5">
                    {lead.scoreBreakdown.scientificIntent > 0 && (
                        <span title="Published relevant research recently" className="cursor-help px-1.5 py-0.5 bg-purple-500/10 text-purple-300 rounded text-[10px] border border-purple-500/20 hover:border-purple-500/40 transition">Pubs</span>
                    )}
                    {lead.scoreBreakdown.companyIntent > 0 && (
                        <span title="Company is well-funded (Series A/B)" className="cursor-help px-1.5 py-0.5 bg-green-500/10 text-green-300 rounded text-[10px] border border-green-500/20 hover:border-green-500/40 transition">Funded</span>
                    )}
                    {lead.scoreBreakdown.location > 0 && (
                        <span title="Located in a Biotech Hub" className="cursor-help px-1.5 py-0.5 bg-blue-500/10 text-blue-300 rounded text-[10px] border border-blue-500/20 hover:border-blue-500/40 transition">Hub</span>
                    )}
                    {lead.scoreBreakdown.roleFit > 0 && (
                        <span title="Role matches Key Decision Maker" className="cursor-help px-1.5 py-0.5 bg-orange-500/10 text-orange-300 rounded text-[10px] border border-orange-500/20 hover:border-orange-500/40 transition">Role</span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 align-top">
                <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-slate-200 bg-blue-600 rounded-md hover:bg-blue-500 transition-colors">
                    Connect
                </a>
            </td>
        </tr>
    );
}

function StatCard({ title, value, icon, color = "text-slate-100" }: { title: string, value: number, icon: React.ReactNode, color?: string }) {
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
