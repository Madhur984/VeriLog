import React from 'react';
import { dreamCompanies } from '../data/companies';
import { hackathons } from '../data/hackathons';
import { DataTerminal } from '../components/DataTerminal';

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
    <section id="intel-hub" className="py-24 px-6 max-w-7xl mx-auto space-y-16 scroll-mt-32">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-mono font-bold text-text-main tracking-tighter uppercase">
            Intel <span className="text-plasma-cyan">Hub</span>
          </h2>
          <p className="text-text-dim font-mono text-xs uppercase tracking-widest">
            Strategic Opportunities & Corporate Intelligence
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onOpenSimulator}
            className="px-6 py-2 bg-accent-orange text-matte-obsidian font-mono text-[10px] font-bold uppercase tracking-widest"
          >
            Launch Trajectory Simulator
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dream Companies Grid */}
        <div className="lg:col-span-8">
          <DataTerminal title="CORPORATE ENTITY DIRECTORY" subtitle="Target Tiers & Recruitment Patterns">
            <div className="grid grid-cols-1 md:grid-cols-2 border-l border-t border-ghost-trace/30">
              {dreamCompanies.slice(0, 8).map((company, i) => (
                <div key={i} className="p-6 border-r border-b border-ghost-trace/30 hover:bg-white/5 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-mono font-bold text-text-main tracking-tight group-hover:text-plasma-cyan transition-colors">
                      {company.name}
                    </h4>
                    <span className="text-[9px] font-mono text-text-dim uppercase border border-ghost-trace px-2 py-0.5">
                      {company.domain.split('/')[0]}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-mono text-text-dim uppercase tracking-widest">Salary Band</label>
                        <div className="text-xs font-mono text-text-sub mt-0.5">{company.salaryIndia}</div>
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-text-dim uppercase tracking-widest">Global Pay</label>
                        <div className="text-xs font-mono text-text-sub mt-0.5">{company.salaryGlobal}</div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-mono text-text-dim uppercase tracking-widest">Recruitment Filter</label>
                      <p className="text-[11px] font-mono text-text-dim mt-1 leading-relaxed">
                        {company.whatTheyLookFor}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 text-center">
              <button className="text-[10px] font-mono text-plasma-cyan uppercase tracking-widest hover:underline">
                View All 50+ Targeted Companies →
              </button>
            </div>
          </DataTerminal>
        </div>

        {/* Global Opportunities & Quick Links */}
        <div className="lg:col-span-4 space-y-8">
          <DataTerminal title="STRATEGIC OPPORTUNITIES" subtitle="Funding & Fellowships">
            <div className="p-6 space-y-6">
              {[
                { label: 'Internship Matrix', desc: 'India, International & Research Positions', action: onOpenInternships },
                { label: 'Govt Initiatives', desc: 'ISM, MeitY & Research Funding', action: onOpenGovt },
                { label: 'Masters / MS Path', desc: 'EU Blue Card & US H-1B Trajectories', action: () => {} }
              ].map((link, i) => (
                <button 
                  key={i}
                  onClick={link.action}
                  className="w-full group text-left p-4 border border-ghost-trace hover:border-plasma-cyan/50 transition-all bg-matte-obsidian/30"
                >
                  <div className="text-xs font-mono text-text-main group-hover:text-plasma-cyan transition-colors uppercase tracking-widest">
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
                <div key={i} className="p-5 hover:bg-white/5 transition-all">
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
            <div className="p-4 bg-matte-obsidian/50 text-center">
              <button className="text-[9px] font-mono text-text-sub uppercase tracking-widest hover:text-white transition-colors">
                View Full Competition Calendar
              </button>
            </div>
          </DataTerminal>
        </div>
      </div>
    </section>
  );
};
