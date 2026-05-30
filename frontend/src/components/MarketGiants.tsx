import React from 'react';
import { ExternalLink, MapPin, Briefcase } from 'lucide-react';
import { MARKET_GIANTS } from '../data/marketGiants';
import { useColorScheme } from '../hooks/useColorScheme';
import { useSkillGap } from '../pages/career-roadmap/hooks/useSkillGap';

export const MarketGiants: React.FC = () => {
  const { matches } = useSkillGap();
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  return (
    <section id="market-giants" className="py-24 px-6 sm:px-12 bg-bg-void">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
             <h2 className="text-4xl sm:text-5xl font-extrabold text-text-main tracking-tighter uppercase">
               Market Giants
             </h2>
             <p className="text-text-dim font-mono text-sm tracking-widest uppercase">
               Recruitment Intel: The Silicon Hierarchy
             </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                 <span className="block text-text-main font-bold text-lg">₹60.0 LPA</span>
                 <span className="text-[9px] font-mono text-text-dim uppercase">CEILING (INDIA)</span>
              </div>
              <div className="h-10 w-px bg-border-soft" />
              <div className="text-right">
                 <span className={`block font-bold text-lg ${isLight ? 'text-signal-core' : 'text-cyan-400'}`}>1,200+</span>
                 <span className="text-[9px] font-mono text-text-dim uppercase">ACTIVE ROLES</span>
             </div>
          </div>
        </div>

        {/* Table Container */}
         <div className="relative overflow-hidden border border-border-soft rounded-2xl bg-bg-elev">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="border-b border-border-soft bg-bg-base/50">
                   <th className="px-6 py-5 font-mono text-[10px] text-text-dim uppercase tracking-widest">Company & Focus</th>
                   <th className="px-6 py-5 font-mono text-[10px] text-text-dim uppercase tracking-widest">HQ / R&D</th>
                   <th className="px-6 py-5 font-mono text-[10px] text-text-dim uppercase tracking-widest">Entry Compensation</th>
                   <th className="px-6 py-5 font-mono text-[10px] text-text-dim uppercase tracking-widest">Recruiter Intel</th>
                   <th className="px-6 py-5 font-mono text-[10px] text-text-dim uppercase tracking-widest">Status</th>
                </tr>
              </thead>
               <tbody className="divide-y divide-border-soft">
                {MARKET_GIANTS.map((company, idx) => (
                   <tr key={idx} className={`group transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}`}>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-lg bg-bg-base border border-border-soft flex items-center justify-center group-hover:border-signal-core/40 transition-colors">
                            <Briefcase size={16} className="text-text-dim group-hover:text-signal-core" />
                         </div>
                         <div>
                           <div className="flex items-center gap-2">
                             <h4 className="text-text-main font-bold text-sm uppercase tracking-tight">{company.name}</h4>
                            {matches.find(m => m.name === company.name) && (
                              <span className="px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-400 text-[10px] font-mono border border-cyan-400/20 font-bold">
                                {matches.find(m => m.name === company.name)?.matchScore}% MATCH
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] font-mono text-text-dim uppercase">{company.focus}</span>
                             <span className="text-[9px] font-mono text-text-dim border border-border-soft px-1 rounded">
                                {matches.find(m => m.name === company.name)?.wfh || 'Unknown WFH'}
                             </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-2 text-text-sub text-xs">
                         <MapPin size={12} className="text-text-dim" />
                        {company.location}
                      </div>
                       <div className="mt-1 flex items-center gap-1 text-[9px] font-mono text-text-dim uppercase">
                          <span>Visa:</span>
                         <span className={matches.find(m => m.name === company.name)?.visa.includes('High') ? 'text-green-400' : 'text-slate-400'}>
                           {matches.find(m => m.name === company.name)?.visa || 'Unknown'}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                         <div className={`flex items-center gap-1.5 font-bold text-sm ${isLight ? 'text-signal-core' : 'text-cyan-400'}`}>
                            <span className="text-[10px]">₹</span> {company.indiaLPA} <span className="text-[9px] font-mono text-text-dim">LPA</span>
                         </div>
                         <div className="text-[9px] font-mono text-text-dim">
                            GLOBAL: {company.globalUSD}
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="max-w-[240px]">
                           <p className="text-text-dim text-[11px] leading-relaxed italic group-hover:text-text-sub transition-colors">
                             "{company.lookingFor}"
                          </p>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                      <a 
                        href={company.hiringUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                         className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${isLight ? 'bg-bg-base border border-border-soft text-text-dim hover:bg-signal-core hover:text-white hover:border-signal-core' : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-cyan-400 hover:text-black hover:border-cyan-400'}`}
                      >
                        Hiring <ExternalLink size={10} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-center gap-4 justify-center">
            <div className="h-px w-24 bg-border-soft" />
            <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest">
               Data synchronized with BitforBytes Market Intelligence API - May 2026
            </p>
            <div className="h-px w-24 bg-border-soft" />
        </div>
      </div>
    </section>
  );
};
