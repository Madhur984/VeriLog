import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, ChevronRight, Briefcase, GraduationCap, Info, Trophy, Rocket, Globe } from 'lucide-react';
import { Domain } from '../data/domains';
import { MARKET_GIANTS } from '../data/marketGiants';
import { useColorScheme } from '../hooks/useColorScheme';
import { cn } from '../utils/cn';

interface DomainDetailModalProps {
  domain: Domain | null;
  onClose: () => void;
  onOpenInTopology?: (domainId: string) => void;
}

export const DomainDetailModal: React.FC<DomainDetailModalProps> = ({ domain, onClose, onOpenInTopology }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'companies' | 'quiz'>('overview');
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';

  if (!domain) return null;

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: Info },
    { id: 'roadmap', label: 'ROADMAP', icon: GraduationCap },
    { id: 'companies', label: 'COMPANIES', icon: Briefcase },
    { id: 'quiz', label: 'MASTERY QUIZ', icon: Trophy },
  ] as const;

  return (
    <motion.div
      key="domain-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className={cn("fixed inset-0 z-[1500] flex items-end justify-center sm:items-center p-0 sm:p-6", isLight ? "bg-bg-void/40" : "bg-black/60")}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn("relative w-full max-w-6xl h-[90vh] sm:h-[85vh] border-t sm:border sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-colors duration-300", isLight ? "bg-bg-elev border-border-soft" : "bg-[#020408] border-white/10")}
      >
        {/* Accent Bar */}
        <div className={cn(
          "h-1 w-full shrink-0",
          domain.demand === 'High' ? (isLight ? 'bg-cyan-600' : 'bg-cyan-400') : (isLight ? 'bg-amber-600' : 'bg-amber-400')
        )} />

        {/* Header */}
        <div className={cn("p-6 sm:p-8 flex items-start justify-between border-b shrink-0", isLight ? "border-border-soft" : "border-white/[0.05]")}>
          <div className="space-y-1">
            <h2 className={cn("text-3xl sm:text-4xl font-extrabold tracking-tight uppercase", isLight ? "text-text-main" : "text-white")}>
              {domain.name}
            </h2>
            <p className={cn("font-medium italic", isLight ? "text-text-dim" : "text-slate-400")}>
              {domain.tagline}
            </p>
          </div>
          <button 
            onClick={onClose}
            className={cn("p-2 rounded-full transition-colors", isLight ? "hover:bg-bg-base text-text-dim hover:text-text-main" : "hover:bg-white/5 text-slate-50 hover:text-white")}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={cn("flex px-6 sm:px-8 border-b shrink-0 overflow-x-auto no-scrollbar", isLight ? "border-border-soft bg-bg-base/40" : "border-b border-white/[0.05] bg-white/[0.01]")}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative py-4 px-6 flex items-center gap-2 font-mono text-[10px] tracking-widest whitespace-nowrap transition-colors",
                  isActive 
                    ? (isLight ? "text-cyan-600" : "text-cyan-400") 
                    : (isLight ? "text-text-dim hover:text-text-main" : "text-slate-500 hover:text-white")
                )}
              >
                <Icon size={14} />
                {tab.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className={cn("absolute bottom-0 left-0 right-0 h-0.5", isLight ? "bg-cyan-600" : "bg-cyan-400")} 
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="grid grid-cols-1 lg:grid-cols-10 gap-10"
              >
                {/* Left Side: Summary & Skills */}
                <div className="lg:col-span-6 space-y-10">
                  <section className="space-y-4">
                    <h4 className={cn("text-sm font-mono uppercase tracking-widest", isLight ? "text-cyan-600" : "text-cyan-400")}>Executive Summary</h4>
                    <p className={cn("text-lg leading-relaxed", isLight ? "text-text-sub" : "text-slate-300")}>
                      {domain.description} This specialization is critical for modern electronics engineering, involving complex design patterns and industrial-standard protocols.
                    </p>
                  </section>

                  <section className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className={cn("text-sm font-mono uppercase tracking-widest", isLight ? "text-cyan-600" : "text-cyan-400")}>Why Now?</h4>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-mono border", isLight ? "bg-amber-600/10 text-amber-700 border-amber-600/20" : "bg-amber-400/10 text-amber-400 border-amber-400/20")}>INDUSTRY UPDATE: MAY 2026</span>
                    </div>
                    <div className={cn("p-6 rounded-xl border", isLight ? "bg-amber-500/[0.02] border-amber-500/15" : "bg-amber-400/[0.02] border-amber-400/10")}>
                       <p className={cn("italic", isLight ? "text-text-sub" : "text-slate-300")}>"{domain.indiaContext}"</p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className={cn("text-sm font-mono uppercase tracking-widest", isLight ? "text-cyan-600" : "text-cyan-400")}>Core Capabilities Matrix</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {domain.skills.map((skill, idx) => (
                        <div key={idx} className={cn("p-4 rounded-xl border flex items-center justify-between group transition-colors", isLight ? "bg-bg-base border-border-soft hover:border-cyan-600/20" : "bg-white/[0.02] border-white/5 hover:border-cyan-400/20")}>
                          <span className={cn("font-medium text-sm", isLight ? "text-text-main" : "text-white")}>{skill}</span>
                          <button className={cn("text-[9px] font-mono transition-colors", isLight ? "text-text-dim group-hover:text-cyan-600" : "text-slate-500 group-hover:text-cyan-400")}>NEED IT</button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Side: Stats & Tiers */}
                <div className="lg:col-span-4 space-y-8">
                  <div className={cn("p-6 rounded-2xl border space-y-8", isLight ? "bg-bg-base border-border-soft" : "bg-white/[0.03] border-white/10")}>
                     <div className="space-y-4">
                        <h4 className={cn("text-[10px] font-mono uppercase tracking-widest", isLight ? "text-text-dim" : "text-slate-500")}>Compensation Architecture</h4>
                        <div className="space-y-4">
                          {[
                            { label: 'FRESHER', val: `₹${domain.salary.fresher}LPA+`, w: '60%' },
                            { label: 'MID-LEVEL', val: `₹${domain.salary.mid}LPA+`, w: '80%' },
                            { label: 'SENIOR', val: `₹${domain.salary.senior}LPA+`, w: '100%' }
                          ].map((row, idx) => (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex justify-between text-[10px] font-mono">
                                <span className={isLight ? "text-text-sub" : "text-slate-400"}>{row.label}</span>
                                <span className={isLight ? "text-text-main font-bold" : "text-white"}>{row.val}</span>
                              </div>
                              <div className={cn("h-1.5 w-full rounded-full overflow-hidden", isLight ? "bg-bg-dim" : "bg-white/5")}>
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: row.w }}
                                  className={cn("h-full", isLight ? "bg-cyan-600" : "bg-cyan-400")} 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2">
                           <span className={cn("text-[10px] font-mono", isLight ? "text-amber-600" : "text-amber-500")}>+{domain.yoyGrowth}% YoY GROWTH IN DEMAND</span>
                        </div>
                     </div>

                     <div className={cn("pt-6 border-t space-y-4", isLight ? "border-border-soft" : "border-white/5")}>
                        <h4 className={cn("text-[10px] font-mono uppercase tracking-widest", isLight ? "text-text-dim" : "text-slate-500")}>Global Mobility Score</h4>
                        <div className="flex items-center gap-4">
                           <div className="relative w-24 h-24 shrink-0">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className={isLight ? "text-bg-dim" : "text-white/5"} />
                                <motion.circle 
                                  cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                  strokeDasharray={251} strokeDashoffset={251 - (251 * 0.85)} 
                                  className={isLight ? "text-cyan-600" : "text-cyan-400"} 
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={cn("font-bold text-lg", isLight ? "text-text-main" : "text-white")}>8.5</span>
                                <span className={cn("text-[8px] font-mono", isLight ? "text-text-dim" : "text-slate-500")}>EXCELLENT</span>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <p className={cn("text-xs", isLight ? "text-text-sub" : "text-slate-300")}>USA: $140k - $220k</p>
                              <p className={cn("text-xs", isLight ? "text-text-sub" : "text-slate-300")}>GER: €65k - €90k</p>
                              <p className={cn("text-xs", isLight ? "text-text-sub" : "text-slate-300")}>SGP: SGD 80k - 130k</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => onOpenInTopology && onOpenInTopology(domain.id)}
                      className={cn("w-full py-4 font-bold uppercase text-[10px] tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2", isLight ? "bg-cyan-600 text-white hover:bg-cyan-700" : "bg-cyan-400 text-black hover:bg-white")}
                    >
                      <Rocket size={14} /> Open in Skill Topology
                    </button>
                    <button className={cn("w-full py-4 font-bold uppercase text-[10px] tracking-widest rounded-xl border transition-colors", isLight ? "bg-bg-base text-text-main border-border-soft hover:bg-hover-bg" : "bg-white/5 text-white border-white/10 hover:bg-white/10")}>
                      SET AS COMPASS TARGET
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'roadmap' && (
              <motion.div 
                key="roadmap"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <div className={cn("flex items-center justify-between border-b pb-4", isLight ? "border-border-soft" : "border-white/5")}>
                   <div>
                      <h4 className={cn("font-bold text-xl uppercase", isLight ? "text-text-main" : "text-white")}>Execution Chronology</h4>
                      <p className={cn("text-sm mt-1", isLight ? "text-text-dim" : "text-slate-500")}>Systematic skill acquisition pipeline for {domain.name}</p>
                   </div>
                   <div className="text-right">
                      <span className={cn("font-mono text-lg font-bold", isLight ? "text-cyan-600" : "text-cyan-400")}>2/5</span>
                      <p className={cn("text-[9px] font-mono uppercase tracking-widest", isLight ? "text-text-dim" : "text-slate-500")}>PHASES COMPLETE</p>
                   </div>
                </div>

                <div className="space-y-6">
                  {domain.roadmap.map((step, idx) => (
                    <div key={idx} className="relative pl-8 pb-8 group">
                      {/* Timeline Line */}
                      {idx !== domain.roadmap.length - 1 && (
                        <div className={cn("absolute left-[11px] top-7 bottom-0 w-px", isLight ? "bg-border-soft" : "bg-white/10")} />
                      )}
                      
                      {/* Dot */}
                      <div className={cn(
                        "absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-colors",
                        idx < 2 
                          ? (isLight ? "bg-cyan-600 border-cyan-600 text-white" : "bg-cyan-400 border-cyan-400 text-black") 
                          : (isLight ? "bg-bg-elev border-border-soft text-text-dim group-hover:border-cyan-600/40" : "bg-black border-white/20 text-slate-600 group-hover:border-cyan-400/40")
                      )}>
                        {idx < 2 ? <CheckCircle2 size={14} /> : <span className="font-mono text-[10px]">{idx + 1}</span>}
                      </div>

                      <div className={cn("p-6 rounded-2xl border transition-colors", isLight ? "bg-bg-base border-border-soft group-hover:border-text-dim/30" : "bg-white/[0.02] border-white/5 group-hover:border-white/10")}>
                        <h5 className={cn("font-mono text-[10px] uppercase tracking-widest mb-3", isLight ? "text-cyan-600" : "text-cyan-400")}>{step.phase}</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                          {step.tasks.map((task, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-3">
                              <div className={cn("mt-1 w-1.5 h-1.5 rounded-full shrink-0", isLight ? "bg-bg-dim" : "bg-slate-700")} />
                              <span className={cn("text-sm", isLight ? "text-text-sub" : "text-slate-300")}>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'companies' && (
              <motion.div 
                key="companies"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                <div className={cn("flex items-center justify-between border-b pb-4", isLight ? "border-border-soft" : "border-white/5")}>
                   <h4 className={cn("font-bold text-xl uppercase", isLight ? "text-text-main" : "text-white")}>Target Recruitment Entities</h4>
                   <span className={cn("font-mono text-xs uppercase tracking-widest", isLight ? "text-text-dim" : "text-slate-500")}>{MARKET_GIANTS.filter(c => c.domains.includes(domain.id)).length} ENTITIES DETECTED</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {MARKET_GIANTS.filter(c => c.domains.includes(domain.id)).map((company, idx) => (
                     <div key={idx} className={cn("group p-6 rounded-2xl border transition-all flex flex-col justify-between h-full", isLight ? "bg-bg-base border-border-soft hover:border-cyan-600/20" : "bg-[#0D0F12] border-white/[0.08] hover:border-cyan-400/20")}>
                        <div className="space-y-4">
                           <div className="flex justify-between items-start">
                              <h5 className={cn("font-bold text-lg", isLight ? "text-text-main" : "text-white")}>{company.name}</h5>
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[8px] font-mono border uppercase tracking-tighter",
                                company.tier === 'ELITE' 
                                  ? (isLight ? 'border-cyan-600/30 text-cyan-700' : 'border-cyan-400/30 text-cyan-400') 
                                  : (isLight ? 'border-amber-600/30 text-amber-700' : 'border-amber-400/30 text-amber-400')
                              )}>{company.tier}</span>
                           </div>
                           <p className={cn("text-xs font-mono", isLight ? "text-text-dim" : "text-slate-500")}>{company.focus} Specialist</p>
                           <div className="space-y-2">
                              <span className={cn("text-[9px] font-mono uppercase tracking-widest", isLight ? "text-text-dim" : "text-slate-500")}>Top Target Role</span>
                              <p className={cn("text-sm font-medium", isLight ? "text-text-main" : "text-slate-300")}>{domain.name} Intern / Engineer</p>
                           </div>
                           <div className={cn("p-3 rounded-lg border", isLight ? "bg-bg-elev border-border-soft" : "bg-white/[0.02] border-white/5")}>
                              <span className={cn("text-[9px] font-mono uppercase block mb-1", isLight ? "text-text-dim" : "text-slate-600")}>Expectation Profile</span>
                              <p className={cn("text-[11px] leading-relaxed line-clamp-2", isLight ? "text-text-sub" : "text-slate-400")}>{company.lookingFor}</p>
                           </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                           <span className={cn("font-mono text-sm font-bold", isLight ? "text-cyan-700" : "text-cyan-400")}>₹{company.indiaLPA} LPA</span>
                           <a 
                             href={company.hiringUrl} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className={cn("p-2 rounded-lg transition-all", isLight ? "bg-cyan-600/10 text-cyan-700 hover:bg-cyan-600 hover:text-white" : "bg-cyan-400/5 text-cyan-400 hover:bg-cyan-400 hover:text-black")}
                           >
                              <ExternalLink size={14} />
                           </a>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'quiz' && (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="max-w-2xl mx-auto py-12 text-center space-y-8"
              >
                <div className={cn("w-20 h-20 rounded-full border flex items-center justify-center mx-auto", isLight ? "bg-cyan-600/10 border-cyan-600/30 text-cyan-700" : "bg-cyan-400/10 border-cyan-400/30 text-cyan-400")}>
                   <Trophy size={40} />
                </div>
                <div className="space-y-2">
                   <h4 className={cn("text-2xl font-bold uppercase tracking-tight", isLight ? "text-text-main" : "text-white")}>Domain Mastery Calibration</h4>
                   <p className={isLight ? "text-text-sub" : "text-slate-400"}>Verify your core technical competency in {domain.name}. Complete the mastery quiz to unlock the Silicon Cabinet certification badge.</p>
                </div>
                <div className={cn("p-6 rounded-2xl border space-y-4", isLight ? "bg-bg-base border-border-soft" : "bg-white/[0.03] border-white/5")}>
                   <div className={cn("flex justify-between items-center text-xs font-mono", isLight ? "text-text-dim" : "text-slate-500")}>
                      <span>5 QUESTIONS</span>
                      <span>10 MINUTES</span>
                      <span>REQUIRED: 5/5</span>
                   </div>
                   <button className={cn("w-full py-4 font-bold uppercase text-xs tracking-widest rounded-xl transition-colors", isLight ? "bg-cyan-600 text-white hover:bg-cyan-700" : "bg-white text-black hover:bg-cyan-400")}>
                      START CALIBRATION SEQUENCE
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
