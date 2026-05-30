import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, ChevronRight, FileText, Link as LinkIcon, BookOpen } from 'lucide-react';
import { TIMELINE_DATA } from '../data/timeline';
import { cn } from '../utils/cn';
import { useColorScheme } from '../hooks/useColorScheme';

export const ExecutionTimeline: React.FC = () => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  return (
    <section id="execution-timeline" className="py-24 px-6 sm:px-12 bg-bg-void">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
            <span className={`font-mono text-[10px] uppercase tracking-[0.4em] ${isLight ? 'text-signal-core' : 'text-cyan-400'}`}>Chronology of Mastery</span>
            <h2 className="text-5xl font-extrabold text-text-main tracking-tighter uppercase">Execution Timeline</h2>
            <p className="text-text-dim max-w-2xl mx-auto text-sm">
             A 6-phase strategic roadmap from undergraduate foundation to senior industry leadership. 
             Calibrate your progress against industrial standards.
           </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
           {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-[100px] left-0 w-full h-px bg-border-soft -z-10" />

           {TIMELINE_DATA.map((card, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
                className="group flex flex-col h-full bg-bg-elev border border-border-soft rounded-2xl overflow-hidden hover:border-signal-core/30 transition-all"
             >
                {/* Phase Indicator */}
                <div className="p-6 pb-0 flex items-center justify-between">
                   <div className="flex flex-col">
                       <span className={`font-mono text-[10px] uppercase tracking-widest ${isLight ? 'text-signal-core' : 'text-cyan-400'}`}>{card.year}</span>
                       <h3 className="text-text-main font-bold text-lg uppercase tracking-tight">{card.phase}</h3>
                   </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isLight ? 'bg-slate-100 text-text-dim group-hover:text-signal-core' : 'bg-white/5 text-slate-500 group-hover:text-cyan-400'}`}>
                      <Calendar size={18} />
                   </div>
                </div>

                {/* Quote */}
                <div className="px-6 py-4">
                    <p className={`text-text-sub text-xs italic border-l pl-3 py-1 ${isLight ? 'border-signal-core/30' : 'border-cyan-400/30'}`}>
                     {card.quote}
                   </p>
                </div>

                {/* Milestones */}
                <div className="px-6 space-y-3 flex-1">
                    <span className="text-[9px] font-mono text-text-dim uppercase tracking-widest block">Critical Milestones</span>
                   <ul className="space-y-2">
                      {card.milestones.map((m, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-2 group/item">
                            <CheckCircle2 size={12} className={`mt-0.5 transition-colors ${isLight ? 'text-slate-300 group-hover/item:text-signal-core' : 'text-slate-700 group-hover/item:text-cyan-400'}`} />
                            <span className="text-[11px] text-text-sub leading-tight group-hover/item:text-text-main">{m}</span>
                        </li>
                      ))}
                   </ul>
                </div>

                {/* Artifacts & Exams */}
                 <div className="p-6 mt-6 bg-bg-base/50 border-t border-border-soft space-y-4">
                   <div className="space-y-2">
                      <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest flex items-center gap-1">
                         <FileText size={10} /> Artifact Output
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                         {card.artifacts.map((a, aIdx) => (
                            <span key={aIdx} className="px-2 py-0.5 bg-bg-base border border-border-soft rounded text-[9px] text-text-dim font-mono">
                              {a}
                           </span>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-2">
                      <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest flex items-center gap-1">
                         <BookOpen size={10} /> Resources
                      </span>
                      <div className="space-y-1">
                         {card.resources.map((r, rIdx) => (
                           <a 
                             key={rIdx} 
                             href={r.url}                              
                             className={`flex items-center justify-between group/link p-1.5 rounded transition-colors ${isLight ? 'hover:bg-signal-core/5' : 'hover:bg-cyan-400/5'}`}
                            >
                               <span className={`text-[10px] text-text-sub ${isLight ? 'group-hover/link:text-signal-core' : 'group-hover/link:text-cyan-400'}`}>{r.name}</span>
                               <LinkIcon size={10} className={`text-text-dim ${isLight ? 'group-hover/link:text-signal-core' : 'group-hover/link:text-cyan-400'}`} />
                           </a>
                         ))}
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Global Progress CTA */}
         <div className={`p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${isLight ? 'bg-signal-core/5 border-signal-core/20' : 'bg-cyan-400/5 border-cyan-400/20'}`}>
           <div className="space-y-1 text-center md:text-left">
               <h4 className="text-text-main font-bold uppercase tracking-tight">Sync Your Progress</h4>
               <p className="text-text-dim text-xs">Link your GitHub and LinkedIn to automatically check off milestones.</p>
           </div>
            <button className={`px-8 py-3 font-bold uppercase text-[10px] tracking-widest rounded-lg transition-all ${isLight ? 'bg-signal-core text-white hover:bg-signal-bright shadow-[0_0_20px_rgba(3,105,161,0.15)]' : 'bg-cyan-400 text-black hover:bg-white shadow-[0_0_20px_rgba(34,211,238,0.2)]'}`}>
              INITIALIZE SYNC PROTOCOL
           </button>
        </div>
      </div>
    </section>
  );
};
