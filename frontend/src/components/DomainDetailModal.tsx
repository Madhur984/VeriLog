import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, ChevronRight, Briefcase, GraduationCap, Info, Trophy, Rocket, Globe } from 'lucide-react';
import { Domain } from '../data/domains';
import { MARKET_GIANTS } from '../data/marketGiants';
import { cn } from '../utils/cn';

interface DomainDetailModalProps {
  domain: Domain | null;
  onClose: () => void;
}

export const DomainDetailModal: React.FC<DomainDetailModalProps> = ({ domain, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'companies' | 'quiz'>('overview');

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
      className="fixed inset-0 z-[1500] flex items-end justify-center sm:items-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-6xl h-[90vh] sm:h-[85vh] bg-[#020408] border-t sm:border border-white/10 sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Accent Bar */}
        <div className={cn(
          "h-1 w-full shrink-0",
          domain.demand === 'High' ? 'bg-cyan-400' : 'bg-amber-400'
        )} />

        {/* Header */}
        <div className="p-6 sm:p-8 flex items-start justify-between border-b border-white/[0.05] shrink-0">
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              {domain.name}
            </h2>
            <p className="text-slate-400 font-medium italic">
              {domain.tagline}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 sm:px-8 border-b border-white/[0.05] bg-white/[0.01] shrink-0 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative py-4 px-6 flex items-center gap-2 font-mono text-[10px] tracking-widest whitespace-nowrap transition-colors",
                  isActive ? "text-cyan-400" : "text-slate-500 hover:text-white"
                )}
              >
                <Icon size={14} />
                {tab.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" 
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
                    <h4 className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Executive Summary</h4>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      {domain.description} This specialization is critical for modern electronics engineering, involving complex design patterns and industrial-standard protocols.
                    </p>
                  </section>

                  <section className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Why Now?</h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-[10px] font-mono border border-amber-400/20">INDUSTRY UPDATE: MAY 2026</span>
                    </div>
                    <div className="p-6 rounded-xl bg-amber-400/[0.02] border border-amber-400/10">
                       <p className="text-slate-300 italic">"{domain.indiaContext}"</p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Core Capabilities Matrix</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {domain.skills.map((skill, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-cyan-400/20 transition-colors">
                          <span className="text-white font-medium text-sm">{skill}</span>
                          <button className="text-[9px] font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">NEED IT</button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Side: Stats & Tiers */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-8">
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Compensation Architecture</h4>
                        <div className="space-y-4">
                          {[
                            { label: 'FRESHER', val: `₹${domain.salary.fresher}LPA+`, w: '60%' },
                            { label: 'MID-LEVEL', val: `₹${domain.salary.mid}LPA+`, w: '80%' },
                            { label: 'SENIOR', val: `₹${domain.salary.senior}LPA+`, w: '100%' }
                          ].map((row, idx) => (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex justify-between text-[10px] font-mono">
                                <span className="text-slate-400">{row.label}</span>
                                <span className="text-white">{row.val}</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: row.w }}
                                  className="h-full bg-cyan-400" 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2">
                           <span className="text-amber-500 text-[10px] font-mono">+{domain.yoyGrowth}% YoY GROWTH IN DEMAND</span>
                        </div>
                     </div>

                     <div className="pt-6 border-t border-white/5 space-y-4">
                        <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Global Mobility Score</h4>
                        <div className="flex items-center gap-4">
                           <div className="relative w-24 h-24 shrink-0">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                                <motion.circle 
                                  cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                  strokeDasharray={251} strokeDashoffset={251 - (251 * 0.85)} 
                                  className="text-cyan-400" 
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-white font-bold text-lg">8.5</span>
                                <span className="text-slate-500 text-[8px] font-mono">EXCELLENT</span>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <p className="text-xs text-slate-300">USA: $140k - $220k</p>
                              <p className="text-xs text-slate-300">GER: €65k - €90k</p>
                              <p className="text-xs text-slate-300">SGP: SGD 80k - 130k</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full py-4 bg-cyan-400 text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                      <Rocket size={14} /> Open in Skill Topology
                    </button>
                    <button className="w-full py-4 bg-white/5 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
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
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <div>
                      <h4 className="text-white font-bold text-xl uppercase">Execution Chronology</h4>
                      <p className="text-slate-500 text-sm mt-1">Systematic skill acquisition pipeline for {domain.name}</p>
                   </div>
                   <div className="text-right">
                      <span className="text-cyan-400 font-mono text-lg font-bold">2/5</span>
                      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">PHASES COMPLETE</p>
                   </div>
                </div>

                <div className="space-y-6">
                  {domain.roadmap.map((step, idx) => (
                    <div key={idx} className="relative pl-8 pb-8 group">
                      {/* Timeline Line */}
                      {idx !== domain.roadmap.length - 1 && (
                        <div className="absolute left-[11px] top-7 bottom-0 w-px bg-white/10" />
                      )}
                      
                      {/* Dot */}
                      <div className={cn(
                        "absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-colors",
                        idx < 2 ? "bg-cyan-400 border-cyan-400 text-black" : "bg-black border-white/20 text-slate-600 group-hover:border-cyan-400/40"
                      )}>
                        {idx < 2 ? <CheckCircle2 size={14} /> : <span className="font-mono text-[10px]">{idx + 1}</span>}
                      </div>

                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-colors">
                        <h5 className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest mb-3">{step.phase}</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                          {step.tasks.map((task, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-3">
                              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
                              <span className="text-slate-300 text-sm">{task}</span>
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
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <h4 className="text-white font-bold text-xl uppercase">Target Recruitment Entities</h4>
                   <span className="text-slate-500 font-mono text-xs uppercase tracking-widest">{MARKET_GIANTS.filter(c => c.domains.includes(domain.id)).length} ENTITIES DETECTED</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {MARKET_GIANTS.filter(c => c.domains.includes(domain.id)).map((company, idx) => (
                     <div key={idx} className="group p-6 rounded-2xl bg-[#0D0F12] border border-white/[0.08] hover:border-cyan-400/20 transition-all flex flex-col justify-between h-full">
                        <div className="space-y-4">
                           <div className="flex justify-between items-start">
                              <h5 className="text-white font-bold text-lg">{company.name}</h5>
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[8px] font-mono border uppercase tracking-tighter",
                                company.tier === 'ELITE' ? 'border-cyan-400/30 text-cyan-400' : 'border-amber-400/30 text-amber-400'
                              )}>{company.tier}</span>
                           </div>
                           <p className="text-slate-500 text-xs font-mono">{company.focus} Specialist</p>
                           <div className="space-y-2">
                              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Top Target Role</span>
                              <p className="text-slate-300 text-sm font-medium">{domain.name} Intern / Engineer</p>
                           </div>
                           <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                              <span className="text-[9px] font-mono text-slate-600 uppercase block mb-1">Expectation Profile</span>
                              <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{company.lookingFor}</p>
                           </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                           <span className="text-cyan-400 font-mono text-sm font-bold">₹{company.indiaLPA} LPA</span>
                           <a 
                             href={company.hiringUrl} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="p-2 rounded-lg bg-cyan-400/5 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all"
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
                <div className="w-20 h-20 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mx-auto text-cyan-400">
                   <Trophy size={40} />
                </div>
                <div className="space-y-2">
                   <h4 className="text-2xl font-bold text-white uppercase tracking-tight">Domain Mastery Calibration</h4>
                   <p className="text-slate-400">Verify your core technical competency in {domain.name}. Complete the mastery quiz to unlock the Silicon Cabinet certification badge.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
                   <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                      <span>5 QUESTIONS</span>
                      <span>10 MINUTES</span>
                      <span>REQUIRED: 5/5</span>
                   </div>
                   <button className="w-full py-4 bg-white text-black font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-cyan-400 transition-colors">
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
