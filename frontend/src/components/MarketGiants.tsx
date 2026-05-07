import React from 'react';
import { ExternalLink, Search, MapPin, DollarSign, Briefcase } from 'lucide-react';
import { MARKET_GIANTS } from '../data/marketGiants';
import { cn } from '../utils/cn';

export const MarketGiants: React.FC = () => {
  return (
    <section id="market-giants" className="py-24 px-6 sm:px-12 bg-[#020408]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter uppercase">
              Market Giants
            </h2>
            <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
              Recruitment Intel: The Silicon Hierarchy
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <span className="block text-white font-bold text-lg">₹60.0 LPA</span>
                <span className="text-[9px] font-mono text-slate-500 uppercase">CEILING (INDIA)</span>
             </div>
             <div className="h-10 w-px bg-white/10" />
             <div className="text-right">
                <span className="block text-cyan-400 font-bold text-lg">1,200+</span>
                <span className="text-[9px] font-mono text-slate-500 uppercase">ACTIVE ROLES</span>
             </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="relative overflow-hidden border border-white/10 rounded-2xl bg-[#0D0F12]">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                  <th className="px-6 py-5 font-mono text-[10px] text-slate-500 uppercase tracking-widest">Company & Focus</th>
                  <th className="px-6 py-5 font-mono text-[10px] text-slate-500 uppercase tracking-widest">HQ / R&D</th>
                  <th className="px-6 py-5 font-mono text-[10px] text-slate-500 uppercase tracking-widest">Entry Compensation</th>
                  <th className="px-6 py-5 font-mono text-[10px] text-slate-500 uppercase tracking-widest">Recruiter Intel</th>
                  <th className="px-6 py-5 font-mono text-[10px] text-slate-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {MARKET_GIANTS.map((company, idx) => (
                  <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-400/40 transition-colors">
                           <Briefcase size={16} className="text-slate-400 group-hover:text-cyan-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm uppercase tracking-tight">{company.name}</h4>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">{company.focus}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <MapPin size={12} className="text-slate-600" />
                        {company.location}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-sm">
                           <span className="text-[10px]">₹</span> {company.indiaLPA} <span className="text-[9px] font-mono text-slate-600">LPA</span>
                        </div>
                        <div className="text-[9px] font-mono text-slate-600">
                           GLOBAL: {company.globalUSD}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="max-w-[240px]">
                          <p className="text-slate-500 text-[11px] leading-relaxed italic group-hover:text-slate-300 transition-colors">
                            "{company.lookingFor}"
                          </p>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                      <a 
                        href={company.hiringUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-slate-400 hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all uppercase tracking-widest"
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
           <div className="h-px w-24 bg-white/5" />
           <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
              Data synchronized with AXE-OR Market Intelligence API — May 2026
           </p>
           <div className="h-px w-24 bg-white/5" />
        </div>
      </div>
    </section>
  );
};
