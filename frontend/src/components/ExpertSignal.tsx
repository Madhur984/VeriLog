import React from 'react';
import { motion } from 'framer-motion';
import { useColorScheme } from '../hooks/useColorScheme';
import { Quote, MessageSquare, Briefcase, GraduationCap } from 'lucide-react';
import { EXPERT_QUOTES } from '../data/expertQuotes';

export const ExpertSignal: React.FC = () => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  return (
    <section id="expert-signal" className="py-24 px-6 sm:px-12 bg-bg-void border-t border-border-soft">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="flex items-center gap-6">
           <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <MessageSquare size={24} />
           </div>
           <div>
              <h2 className="text-4xl font-extrabold text-text-main tracking-tighter uppercase">Expert Signal</h2>
              <p className="text-text-dim font-mono text-sm tracking-widest uppercase">Field Intel: Lessons from the Silicon Trenches</p>
           </div>
        </div>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {EXPERT_QUOTES.map((item, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.15 }}
               className="relative p-8 rounded-3xl bg-bg-elev border border-border-soft flex flex-col justify-between group hover:border-amber-500/30 transition-all"
             >
                {/* Large Quote Icon Background */}
                <Quote size={80} className={`absolute top-4 right-4 -z-0 ${isLight ? 'text-slate-900/[0.03]' : 'text-white/[0.02]'}`} />

                <div className="space-y-6 relative z-10">
                   <p className="text-text-sub text-sm leading-relaxed italic">
                      "{item.quote}"
                   </p>
                   
                   <div className="space-y-4 pt-6 border-t border-border-soft">
                      <div>
                        <h4 className="text-text-main font-bold text-base tracking-tight">{item.name}</h4>
                        <div className="flex items-center gap-2 text-amber-500 font-mono text-[10px] uppercase tracking-widest mt-1">
                           <Briefcase size={12} /> {item.role} @ {item.company}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-text-dim font-mono text-[9px] uppercase">
                         <div className="flex items-center gap-1.5">
                            <GraduationCap size={12} /> {item.iitBatch}
                         </div>
                         <div className={`w-1 h-1 rounded-full ${isLight ? 'bg-slate-300' : 'bg-slate-800'}`} />
                         <span>{item.yearsExp} YRS EXP</span>
                      </div>
                   </div>
                </div>

                {/* Domain Tag */}
                <div className="mt-8 flex justify-end">
                   <span className="px-2 py-0.5 rounded bg-bg-base border border-border-soft text-[8px] font-mono text-text-dim uppercase tracking-widest">
                      DOMAIN: {item.domain}
                   </span>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Community Stats Callout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-border-soft">
           {[
             { label: 'ACTIVE ASPIRANTS', val: '12.4k', sub: '+1.2k THIS MONTH' },
             { label: 'TOP DOMAIN', val: 'VLSI', sub: '42% CALIBRATION RATE' },
             { label: 'AVG SALARY TARGET', val: '₹14.2L', sub: 'FRESHEST DATA' },
             { label: 'SYSTEM UPTIME', val: '99.9%', sub: 'MARKET TELEMETRY' }
           ].map((stat, idx) => (
             <div key={idx} className="text-center space-y-1">
                <span className="block text-3xl font-extrabold text-text-main tracking-tighter">{stat.val}</span>
                <span className="block text-[9px] font-mono text-text-dim uppercase tracking-[0.2em]">{stat.label}</span>
                <span className={`block text-[8px] font-mono ${isLight ? 'text-signal-core' : 'text-cyan-400'} opacity-50`}>{stat.sub}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};
