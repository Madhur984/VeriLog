import React from 'react';
import { dreamCompanies } from '../data/companies';
import { hackathons } from '../data/hackathons';
import { JOB_PORTALS, GITHUB_AWESOME_REPOS } from '../data/domainRoadmaps';
import { DataTerminal } from '../components/DataTerminal';
import { CompanyLogoSvg } from '../components/CompanyLogos';
import { ExternalLink, Linkedin, Search, Code, Bookmark } from 'lucide-react';

interface IntelHubSectionProps {
  onOpenInternships: () => void;
  onOpenGovt: () => void;
  onOpenSimulator: () => void;
}

export const IntelHubSection: React.FC<IntelHubSectionProps> = ({
  onOpenInternships,
  onOpenGovt,
  onOpenSimulator
}) => {
  return (
    <section id="intel-hub" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 scroll-mt-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-mono font-bold text-text-main tracking-tighter uppercase">
            Intel <span className="text-plasma-cyan">Hub</span>
          </h2>
          <p className="text-text-dim font-mono text-xs uppercase tracking-widest">
            Opportunities, company career links, and learning repositories
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onOpenSimulator}
            className="px-6 py-2 bg-accent-orange text-matte-obsidian font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-accent-orange/90 transition-colors shadow-brutal"
          >
            Open career-path simulator
          </button>
        </div>
      </div>

      {/* Live Job Search Portals Matrix */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-plasma-cyan" />
            <h3 className="text-sm font-mono font-bold uppercase text-text-main tracking-widest">
              Direct ECE Job Search Portals
            </h3>
          </div>
          <span className="text-[10px] font-mono text-text-dim uppercase">Pre-Filtered Queries</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {JOB_PORTALS.map((portal) => (
            <a
              key={portal.id}
              href={portal.searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-bg-base border border-ghost-trace/50 hover:border-plasma-cyan transition-all group flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-2">
                <span 
                  className="w-7 h-7 flex items-center justify-center text-[10px] font-bold font-mono text-white rounded"
                  style={{ backgroundColor: portal.color }}
                >
                  {portal.logoText}
                </span>
                <ExternalLink className="w-3 h-3 text-text-dim group-hover:text-plasma-cyan transition-colors" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-text-main group-hover:text-plasma-cyan transition-colors">
                  {portal.name}
                </h4>
                <p className="text-[10px] font-mono text-text-dim mt-1 line-clamp-2">
                  {portal.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Main Grid: Corporate Directory + Strategic Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dream Companies Grid */}
        <div className="lg:col-span-8">
          <DataTerminal title="CORPORATE ENTITY DIRECTORY" subtitle="Target Tiers, Direct LinkedIn & Naukri Career Pages">
            <div className="grid grid-cols-1 md:grid-cols-2 border-l border-t border-ghost-trace/30">
              {dreamCompanies.slice(0, 10).map((company, i) => (
                <div key={i} className="p-6 border-r border-b border-ghost-trace/30 hover:bg-text-main/5 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-matte-obsidian border border-ghost-trace flex items-center justify-center p-1.5 shrink-0">
                        <CompanyLogoSvg companyId={company.name} size={22} />
                      </div>
                      <div>
                        <h4 className="text-base font-mono font-bold text-text-main tracking-tight group-hover:text-plasma-cyan transition-colors">
                          {company.name}
                        </h4>
                        <span className="text-[9px] font-mono text-text-dim uppercase border border-ghost-trace px-2 py-0.5">
                          {company.domain.split('/')[0]}
                        </span>
                      </div>
                    </div>
                    
                    {/* LinkedIn & Naukri Direct Buttons */}
                    <div className="flex items-center gap-1.5">
                      <a
                        href={company.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${company.name} LinkedIn Jobs`}
                        className="p-1.5 bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all rounded"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={company.naukriUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${company.name} Naukri Openings`}
                        className="px-1.5 py-1 bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#0066FF] hover:bg-[#0066FF] hover:text-white font-mono text-[9px] font-bold transition-all rounded"
                      >
                        Naukri
                      </a>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-mono text-text-dim uppercase tracking-widest">India CTC</label>
                        <div className="text-xs font-mono text-text-sub font-bold mt-0.5">{company.salaryIndia}</div>
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-text-dim uppercase tracking-widest">Global Pay</label>
                        <div className="text-xs font-mono text-text-sub mt-0.5">{company.salaryGlobal}</div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-mono text-text-dim uppercase tracking-widest">Recruitment Focus</label>
                      <p className="text-[11px] font-mono text-text-dim mt-1 leading-relaxed">
                        {company.whatTheyLookFor}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 text-center bg-matte-obsidian/40 border-t border-ghost-trace/30">
              <span className="text-[10px] font-mono text-text-dim uppercase tracking-widest">
                Direct Recruiter Links Active for 15+ Top Semiconductor Corporations
              </span>
            </div>
          </DataTerminal>
        </div>

        {/* Global Opportunities & Quick Links */}
        <div className="lg:col-span-4 space-y-8">
          <DataTerminal title="STRATEGIC OPPORTUNITIES" subtitle="Funding & Fellowships">
            <div className="p-6 space-y-4">
              {[
                { label: 'Internships', desc: 'India, international and research positions', action: onOpenInternships },
                { label: 'Government initiatives', desc: 'ISM, MeitY and research funding', action: onOpenGovt },
                { label: 'Career-path simulator', desc: 'Explore five-year skill and role outcomes', action: onOpenSimulator }
              ].map((link, i) => (
                <button 
                  key={i}
                  onClick={link.action}
                  className="w-full group text-left p-4 border border-ghost-trace hover:border-plasma-cyan/50 transition-all bg-matte-obsidian/30"
                >
                  <div className="text-xs font-mono text-text-main group-hover:text-plasma-cyan transition-colors uppercase tracking-widest font-bold">
                    {link.label}
                  </div>
                  <div className="text-[10px] font-mono text-text-dim mt-1">
                    {link.desc}
                  </div>
                </button>
              ))}
            </div>
          </DataTerminal>

          <DataTerminal title="COMPETITION PIPELINE" subtitle="Active Hackathons">
            <div className="divide-y divide-ghost-trace/30">
              {hackathons.slice(0, 3).map((h, i) => (
                <div key={i} className="p-5 hover:bg-text-main/5 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-xs font-mono text-text-main font-bold uppercase">{h.name}</h5>
                    <div className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${
                      h.status === 'OPEN' ? 'border-green-500/50 text-green-400' : 'border-accent-orange/50 text-accent-orange'
                    }`}>
                      {h.status}
                    </div>
                  </div>
                  <p className="text-[10px] font-mono text-text-dim mb-3">{h.organizer}</p>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-plasma-cyan">{h.prize.split('(')[0]}</span>
                    <span className="text-text-dim italic">{h.nextEdition.split('-')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </DataTerminal>
        </div>
      </div>

      {/* Curated GitHub Awesome Repositories Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-plasma-cyan" />
          <h3 className="text-sm font-mono font-bold uppercase text-text-main tracking-widest">
            Curated GitHub Awesome Repositories
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GITHUB_AWESOME_REPOS.map((repo) => (
            <a
              key={repo.name}
              href={repo.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 bg-bg-base border border-ghost-trace/50 hover:border-plasma-cyan transition-all group flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex flex-wrap gap-2 justify-between items-center mb-2">
                  <span className="font-mono font-bold text-xs text-plasma-cyan group-hover:underline">
                    {repo.name}
                  </span>
                  <span className="text-[9px] font-mono text-text-dim uppercase border border-ghost-trace px-1.5 py-0.5">
                    {repo.domain}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-text-dim leading-relaxed">
                  {repo.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-text-sub group-hover:text-text-main">
                <Bookmark className="w-3 h-3 text-plasma-cyan" />
                <span>Explore GitHub Repository →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
