import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shield, Cpu, Zap, Award, ExternalLink } from 'lucide-react';
import { SectionHead } from '../sections/RoadmapUI';

export interface ComparisonFeature {
  feature: string;
  bitforbytes: string | boolean;
  youtubePdf: string | boolean;
  coachingInst: string | boolean;
  genericEdtech: string | boolean;
}

export const COMPARISON_DATA: ComparisonFeature[] = [
  {
    feature: 'Hands-on Browser HDL / Verilog IDE',
    bitforbytes: 'Included (90+ Interactive Workstations)',
    youtubePdf: 'None (Static text / Videos only)',
    coachingInst: 'Local installation required',
    genericEdtech: 'Basic code editor (Software only)'
  },
  {
    feature: '7-Layer Microchip Die Physics Simulator',
    bitforbytes: 'Interactive 3nm FinFET / GAAFET Explorer',
    youtubePdf: 'None',
    coachingInst: 'Theoretical slide decks',
    genericEdtech: 'None'
  },
  {
    feature: 'Pre-Filtered Naukri & LinkedIn Job Portals',
    bitforbytes: '1-Click Direct Recruiter Searches',
    youtubePdf: 'None',
    coachingInst: 'Manual job forwarding',
    genericEdtech: 'Generic job board'
  },
  {
    feature: 'ATS-Optimized Semiconductor Resume Generator',
    bitforbytes: 'Automated 1-Click Bullet Compiler',
    youtubePdf: 'None',
    coachingInst: 'Manual resume reviews',
    genericEdtech: 'Generic templates'
  },
  {
    feature: 'Cost & Accessibility',
    bitforbytes: '100% Free Forever (No Gating)',
    youtubePdf: 'Free (Fragmented)',
    coachingInst: '₹35,000 – ₹75,000 INR',
    genericEdtech: '₹4,000 – ₹15,000 Subscription'
  },
  {
    feature: '2026 Industry Spec & STA / UVM Coverage',
    bitforbytes: 'Verified 2026 Semiconductor Specs',
    youtubePdf: 'Outdated (2016-2020 playlists)',
    coachingInst: 'Varies by instructor',
    genericEdtech: 'High-level intro only'
  }
];

export const PlatformComparisonSection: React.FC = () => {
  return (
    <section id="platform-comparison" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-24">
      <SectionHead
        kicker="WHY BITFORBYTES STANDS APART"
        title="BitForBytes vs. Traditional ECE Learning Paths"
        sub="Compare our interactive semiconductor workstations and recruiter intelligence against static PDFs, YouTube playlists, and expensive offline coaching."
      />

      <div className="bg-bg-base border-2 border-edge shadow-brutal overflow-x-auto">
        <table className="w-full text-left font-mono border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b-2 border-ghost-trace bg-matte-obsidian">
              <th className="p-4 text-xs font-bold text-text-dim uppercase tracking-wider">Evaluation Metrics</th>
              <th className="p-4 text-xs font-bold text-plasma-cyan uppercase tracking-wider bg-plasma-cyan/10 border-x border-plasma-cyan/30">
                ⚡ BitForBytes Platform
              </th>
              <th className="p-4 text-xs font-bold text-text-sub uppercase tracking-wider">YouTube & Static PDFs</th>
              <th className="p-4 text-xs font-bold text-text-sub uppercase tracking-wider">Offline Coaching (₹50k+)</th>
              <th className="p-4 text-xs font-bold text-text-sub uppercase tracking-wider">Generic EdTech</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_DATA.map((row, idx) => (
              <tr key={idx} className="border-b border-ghost-trace/40 hover:bg-matte-obsidian/30 transition-colors text-xs">
                <td className="p-4 font-bold text-text-main">{row.feature}</td>
                <td className="p-4 font-bold text-plasma-cyan bg-plasma-cyan/5 border-x border-plasma-cyan/20">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-plasma-cyan shrink-0" />
                    <span>{row.bitforbytes}</span>
                  </div>
                </td>
                <td className="p-4 text-text-dim">
                  <div className="flex items-center gap-1.5">
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{row.youtubePdf}</span>
                  </div>
                </td>
                <td className="p-4 text-text-dim">
                  <span>{row.coachingInst}</span>
                </td>
                <td className="p-4 text-text-dim">
                  <span>{row.genericEdtech}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
