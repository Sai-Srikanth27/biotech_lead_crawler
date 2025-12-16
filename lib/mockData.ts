import { Lead } from './types';
import { calculateScore } from './scoring';

const rawLeads: Omit<Lead, 'calculatedScore' | 'rank' | 'scoreBreakdown'>[] = [
    {
        id: '1',
        name: 'Dr. Elena Rossi',
        title: 'Director of Toxicology',
        company: {
            name: 'Hepatix Bio',
            hqLocation: 'Cambridge, MA',
            isRemoteFriendly: false,
            fundingStage: 'Series B',
            technographics: ['In-Vitro Models', 'High Content Screening'],
            industry: 'Biotech'
        },
        location: 'Cambridge, MA',
        email: 'elena.rossi@hepatix.bio',
        linkedinUrl: 'https://linkedin.com/in/example',
        publications: [
            { title: 'Novel 3D Liver Models for DILI Prediction', year: 2024, keywords: ['DILI', 'Liver', '3D'] }
        ]
    },
    {
        id: '2',
        name: 'James Smith',
        title: 'Senior Scientist',
        company: {
            name: 'OldSchool Pharma',
            hqLocation: 'New Jersey',
            isRemoteFriendly: true,
            fundingStage: 'Public',
            technographics: ['Animal Models'],
            industry: 'Pharma'
        },
        location: 'Remote (Texas)',
        email: 'j.smith@oldschool.com',
        linkedinUrl: 'https://linkedin.com/in/example',
        publications: []
    },
    {
        id: '3',
        name: 'Dr. Sarah Chen',
        title: 'Head of Preclinical Safety',
        company: {
            name: 'NeuroGen',
            hqLocation: 'San Francisco, CA',
            isRemoteFriendly: true,
            fundingStage: 'Series A',
            technographics: ['NAMs', 'Organ-on-Chip'],
            industry: 'Biotech'
        },
        location: 'San Francisco, CA',
        email: 'sarah.chen@neurogen.com',
        linkedinUrl: 'https://linkedin.com/in/example',
        publications: [
            { title: 'Microphysiological Systems in Safety', year: 2025, keywords: ['Safety', 'Organ-on-Chip'] }
        ]
    },
    {
        id: '4',
        name: 'Michael Johnson',
        title: 'VP of Discovery',
        company: {
            name: 'BioFuture',
            hqLocation: 'London, UK',
            isRemoteFriendly: false,
            fundingStage: 'Series A',
            technographics: ['In-Vitro'],
            industry: 'Biotech'
        },
        location: 'London, UK',
        email: 'm.johnson@biofuture.co.uk',
        linkedinUrl: 'https://linkedin.com/in/example',
        publications: []
    },
    {
        id: '5',
        name: 'Emily White',
        title: 'Research Associate',
        company: {
            name: 'TinyBio',
            hqLocation: 'Boston, MA',
            isRemoteFriendly: false,
            fundingStage: 'Seed',
            technographics: [],
            industry: 'Biotech'
        },
        location: 'Boston, MA',
        email: 'emily@tinybio.com',
        linkedinUrl: 'https://linkedin.com/in/example',
        publications: []
    },
    {
        id: '6',
        name: 'Dr. Marcus Weber',
        title: 'Safety Assessment Lead',
        company: {
            name: 'Roche',
            hqLocation: 'Basel, Switzerland',
            isRemoteFriendly: true,
            fundingStage: 'Public',
            technographics: ['In-Vitro', 'NAMs', 'Robotics'],
            industry: 'Pharma'
        },
        location: 'Basel, Switzerland',
        email: 'marcus.weber@roche.com',
        linkedinUrl: 'https://linkedin.com/in/example',
        publications: [
            { title: 'Liver Toxicity Mechanisms', year: 2023, keywords: ['Liver', 'Toxicity'] }
        ]
    },
    {
        id: '7',
        name: 'Dr. Arina Ivanov',
        title: 'Postdoc Fellow',
        company: {
            name: 'Broad Institute',
            hqLocation: 'Cambridge, MA',
            isRemoteFriendly: false,
            fundingStage: 'Public', // Grant based
            technographics: ['CRISPR', '3D'],
            industry: 'Academia'
        },
        location: 'Cambridge, MA',
        email: 'a.ivanov@broad.org',
        linkedinUrl: 'https://linkedin.com/in/example',
        publications: [
            { title: '3D Spheroids in Cancer', year: 2024, keywords: ['3D', 'Cancer'] }
        ]
    },
    {
        id: '8',
        name: 'David Kim',
        title: 'Director of Biology',
        company: {
            name: 'MegaBio',
            hqLocation: 'San Diego, CA',
            isRemoteFriendly: true,
            fundingStage: 'Series C',
            technographics: ['In-Vitro'],
            industry: 'Biotech'
        },
        location: 'San Diego, CA',
        email: 'dkim@megabio.com',
        linkedinUrl: 'https://linkedin.com/in/example',
        publications: []
    }
];

export const MOCK_LEADS: Lead[] = rawLeads.map(calculateScore).sort((a, b) => b.calculatedScore - a.calculatedScore);
