import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { ThemeToggle } from '../../components/ThemeToggle';
import { RoadmapHero, MarketPulse, CompaniesBoard, OpportunitiesBoard, StudentPathSection } from './sections/RoadmapSections';
import { DomainGrid } from './sections/DomainGrid';
import { SalaryLab } from './sections/SalaryLab';
import { SOURCES, AS_OF } from './data/careerData';

/**
 * Career Roadmap — a focused, honest map of an ECE/VLSI career in India.
 *
 * Rebuilt (2026) around real, dated, sourced market data (see data/careerData.ts)
 * and the site's neo-brutalist design system. A single scroll with a sticky
 * section nav: Opportunity → Domains → Salaries → Companies → Openings → Path.
 * PortalLayout hides its own nav on this route, so the bar below carries the
 * Portal-back control + theme toggle itself.
 */

const NAV = [
  { id: 'market', label: 'Opportunity' },
  { id: 'domains', label: 'Domains' },
  { id: 'salaries', label: 'Salaries' },
  { id: 'companies', label: 'Companies' },
  { id: 'opportunities', label: 'Openings' },
  { id: 'path', label: 'The Path' },
];

const CareerRoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-bg-void text-text-main">
      {/* Self-contained top bar: Portal back · section nav · theme toggle */}
      <div className="sticky top-0 z-30 bg-bg-void border-b-2 border-edge">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/portal')}
            aria-label="Back to portal"
            className="brutal-btn inline-flex h-9 items-center gap-1.5 bg-bg-elev px-3 text-[12px] font-bold text-text-main shrink-0"
          >
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Portal</span>
          </button>

          <nav aria-label="Sections" className="flex-1 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => jump(n.id)}
                className="whitespace-nowrap font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 text-text-sub hover:text-text-main hover:bg-bg-base border-2 border-transparent hover:border-edge transition-colors rounded-full"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="shrink-0"><ThemeToggle /></div>
        </div>
      </div>

      <RoadmapHero />
      <MarketPulse />
      <DomainGrid />
      <SalaryLab />
      <CompaniesBoard />
      <OpportunitiesBoard />
      <StudentPathSection />

      {/* Sources + honesty note */}
      <footer className="border-t-2 border-edge bg-bg-base">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-3">Sources · figures as of {AS_OF}</div>
          <p className="text-sm text-text-sub mb-4 max-w-2xl leading-relaxed">
            Pay and demand are ranges that vary by company tier, city, process node and market cycle.
            Treat these as a compass, not a contract — and always verify a specific offer for yourself.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {SOURCES.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                className="font-mono text-[11px] text-text-dim hover:text-signal-core transition-colors underline-offset-2 hover:underline">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CareerRoadmapPage;
