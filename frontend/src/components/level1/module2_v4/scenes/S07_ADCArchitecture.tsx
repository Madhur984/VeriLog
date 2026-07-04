import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Layers, RefreshCw, Terminal, Activity, Database, CheckCircle2, AlertCircle } from 'lucide-react';

import { TechnicalAudit } from '../components/TechnicalAudit';
import { TryItYourself } from '../../../ui/TryItYourself';

/**
 * S07_ADCArchitecture: SILICON REALITY (ELITE VERSION)
 * Focus: Hardware trade-offs and selection matrices.
 * Features: Interactive Selection Engine, Logic Flow Visuals, Performance Gauges.
 */
export const S07_ADCArchitecture: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [selected, setSelected] = useState<'flash' | 'sar' | 'delta'>('sar');

  const architectures = {
    flash: {
      title: "Flash ADC",
      tagline: "The Speed Demon",
      desc: "Takes snapshots at the speed of light. It's extremely fast but power-hungry and works best for low resolution.",
      speed: 100, resolution: 20, power: 95,
      logic: "PARALLEL_BANK",
      industry: "Oscilloscopes / 5G / RF",
      icon: Zap,
      color: "text-red-500"
    },
    sar: {
      title: "SAR ADC",
      tagline: "The Efficiency Master",
      desc: "Successive Approximation Register. It used a binary search algorithm to narrow down the signal, balancing speed and detail.",
      speed: 40, resolution: 70, power: 15,
      logic: "BINARY_RECURSION",
      industry: "Microcontrollers / Sensors",
      icon: Layers,
      color: "text-orange-500"
    },
    delta: {
      title: "Delta-Sigma",
      tagline: "The High-Fidelity Purist",
      desc: "Oversamples at extreme speeds to trade speed for incredible detail. The gold standard for music and audio.",
      speed: 10, resolution: 100, power: 45,
      logic: "NOISE_SHAPING",
      industry: "Pro Audio / Medical",
      icon: RefreshCw,
      color: "text-cyan-500"
    }
  };

  const current = architectures[selected];
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/50' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';
  const panelBg = isDarkMode ? 'bg-black/60 border-white/10' : 'bg-white border-gray-100 shadow-xl';

  return (
    <div className="flex flex-col gap-16 max-w-6xl mx-auto mb-32 text-left">
      <header className="space-y-6">
        <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest inline-flex ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-orange-50 border-orange-200 text-orange-600 font-bold'}`}>
            Level 02.07 // Silicon Reality
        </div>
        <h2 className={`text-7xl font-black italic tracking-tighter ${textColor}`}>
          The <span className={accentColor}>Physical</span> Bridge
        </h2>
        <p className={`text-xl font-medium max-w-2xl opacity-60 ${textColor}`}>
            In history, three silicon architectures won. Choose one to explore the trade-offs between speed, precision, and energy.
        </p>
      </header>

      {/* INTERACTIVE ARCHITECTURE HUB */}
      <TryItYourself />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          {/* Selector Tabs */}
          <div className="lg:col-span-4 flex flex-col gap-4">
              {Object.entries(architectures).map(([key, arch]) => (
                  <button 
                    key={key} onClick={() => setSelected(key as any)}
                    aria-pressed={selected === key}
                    aria-label={`Select ${arch.title} architecture`}
                    className={`p-8 rounded-[2.5rem] border text-left transition-all duration-500 group relative overflow-hidden ${selected === key 
                        ? (isDarkMode ? 'bg-orange-500/10 border-orange-500 shadow-orange-500/10' : 'bg-orange-50 border-orange-500 shadow-xl') 
                        : (isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-gray-50 border-gray-100 hover:bg-white')}`}
                  >
                        <div className="flex justify-between items-start mb-6">
                            <arch.icon size={28} className={selected === key ? arch.color : 'opacity-20'} />
                            <div className={`text-[9px] font-mono tracking-widest font-black uppercase ${selected === key ? arch.color : 'opacity-20'}`}>
                                {arch.logic}
                            </div>
                        </div>
                        <h4 className={`text-2xl font-black italic tracking-tighter ${textColor}`}>{arch.title}</h4>
                        <p className={`text-xs mt-2 font-medium leading-relaxed ${selected === key ? 'opacity-60' : 'opacity-20'} ${textColor}`}>
                            {arch.tagline}
                        </p>
                        {selected === key && (
                            <motion.div layoutId="arch-indicator" className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500" />
                        )}
                  </button>
              ))}
          </div>

          {/* MAIN DIAGNOSIS PANEL */}
          <div className={`lg:col-span-8 rounded-[4rem] border p-12 relative flex flex-col overflow-hidden transition-all duration-700 ${panelBg}`}>
              <div className="absolute top-0 right-0 p-12 pointer-events-none">
                  <motion.div
                    animate={selected === 'flash' ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : 
                             selected === 'delta' ? { rotate: 360 } : 
                             { scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: selected === 'flash' ? 0.2 : 4, ease: "linear" }}
                  >
                        <Cpu size={180} className={`opacity-[0.05] ${current.color}`} />
                  </motion.div>
              </div>

              <div className="space-y-10 flex-1 relative z-10">
                  <div className="space-y-4">
                      <div className={`text-[10px] font-mono uppercase tracking-[0.3em] font-black ${current.color}`}>Technical Brief // Phase {selected === 'flash' ? 1 : selected === 'sar' ? 2 : 3}</div>
                      <h3 className={`text-5xl font-black italic tracking-tighter ${textColor}`}>{current.title}</h3>
                      <p className={`text-xl font-medium leading-relaxed pr-10 ${subTextColor}`}>
                          {current.desc}
                      </p>
                  </div>

                  {/* PERFORMANCE GAUGES */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-10 border-t border-dashed border-slate-200 dark:border-white/10">
                       {[
                           { label: "Speed / Latency", val: current.speed, icon: Zap },
                           { label: "Bit Resolution", val: current.resolution, icon: Activity },
                           { label: "Energy Efficiency", val: 100 - current.power, icon: Database }
                       ].map((g, i) => (
                           <div key={i} className="space-y-4">
                               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                   <div className="flex items-center gap-2">
                                       <g.icon size={12} />
                                       <span>{g.label}</span>
                                   </div>
                                   <span>{g.val}%</span>
                               </div>
                               <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                   <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${g.val}%` }} 
                                        className={`h-full ${current.color.replace('text', 'bg')}`} 
                                   />
                               </div>
                           </div>
                       ))}
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-center pt-8">
                       <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                            <span className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${textColor}`}>Target:</span>
                            <span className={`text-xs font-black italic ${current.color}`}>{current.industry}</span>
                       </div>
                       <div className="flex-1 overflow-hidden h-4 flex items-center relative gap-2">
                            {[...Array(10)].map((_, i) => (
                                <motion.div 
                                   key={i}
                                   className={`w-1.5 h-1.5 rounded-full ${current.color.replace('text', 'bg')}`}
                                   animate={{ 
                                       x: [0, 400],
                                       opacity: [0, 1, 0]
                                   }}
                                   transition={{ 
                                       repeat: Infinity, 
                                       duration: selected === 'flash' ? 0.3 : selected === 'sar' ? 1 : 3,
                                       delay: i * 0.2
                                   }}
                                />
                            ))}
                       </div>
                  </div>
              </div>

              <div 
                className={`mt-10 p-8 rounded-[2.5rem] border border-dashed flex items-start gap-6 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-50 border-orange-200'}`}
                aria-live="polite"
              >
                   <Terminal size={16} className={accentColor} />
                   <p className={`text-[11px] font-medium leading-relaxed italic ${subTextColor}`}>
                       {selected === 'flash' ? 'Note: Flash ADCs are extreme. They use double the circuits for every added bit. An 8-bit flash has 255 circuits; a 16-bit flash would require 65,535. Power disaster.' : 
                        selected === 'sar' ? 'Note: SAR is the "Great Balance." It requires N-cycles to find N-bits. Slow for GHz signals, but perfect for everything else.' : 
                        'Note: Delta-Sigma uses magic. It adds massive noise, then filters it out. It takes time, which is why it has higher latency than Flash.'}
                   </p>
              </div>
          </div>
      </div>
            {/* 🏥 REAL WORLD APPLICATIONS */}
      <section className="space-y-10">
        <div className="flex flex-col gap-2">
            <h3 className={`text-3xl font-black italic tracking-tight border-l-4 border-orange-500 pl-6 ${textColor}`}>The Digital Pulse</h3>
            <p className={`text-sm font-medium opacity-60 pl-6 ${textColor}`}>Where these architectures meet human reality.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full">
            {[
                { 
                    icon: <Activity size={20} />, 
                    title: "Medical Diagnostic", 
                    use: "ECG Monitoring", 
                    desc: "Precision is survival. High-resolution Delta-Sigma ADCs capture the microvolt-level electrical signals of the human heart without missing a beat." 
                },
                { 
                    icon: <Layers size={20} />, 
                    title: "Automotive Safety", 
                    use: "ABS & Airbag Sensors", 
                    desc: "Reliability is key. SAR ADCs provide the perfect balance of speed and power to detect sudden deceleration in milliseconds." 
                },
                { 
                    icon: <Zap size={20} />, 
                    title: "Broadband Comm.", 
                    use: "5G Infrastructure", 
                    desc: "Speed is everything. Flash ADCs process billions of bits per second to keep global networks synchronized in real-time." 
                }
            ].map((app, idx) => (
                <div key={idx} className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100 hover:shadow-xl transition-all'}`}>
                    <div className="flex flex-col gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-orange-500/20 text-orange-500' : 'bg-orange-600 text-white'}`}>
                            {app.icon}
                        </div>
                        <div>
                            <h4 className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}>{app.title}</h4>
                            <h3 className={`text-lg font-black italic mt-1 ${textColor}`}>{app.use}</h3>
                            <p className={`text-xs mt-4 leading-relaxed font-medium opacity-60 ${textColor}`}>
                                {app.desc}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      <TechnicalAudit 
          isDarkMode={isDarkMode}
                showFullView={true}
                specs={{
                    concept: "The Silicon Bridge: ADCs are physical implementations of the sampling theorem. Different silicon topologies (Flash, SAR, Delta-Sigma) represent different engineering philosophies regarding speed, power, and precision.",
                    physical: "The Trade-off Matrix: Hardware selection is governed by the 'Iron Triangle'. You can optimize for Speed (Flash), Power Efficiency (SAR), or Resolution (Delta-Sigma), but never all three simultaneously.",
                    formal: "Figure of Merit (FOM): Engineers use the Walden FOM to compare ADC efficiency, calculated as Power / (2^ENOB * Fs). A lower FOM indicates a more efficient architecture at its specific performance point.",
                    insight: "Architecture Choice: Selection is driven by spectral requirements. SAR/Pipeline dominates communications, while Delta-Sigma defines high-resolution instrumentation (24-bit+) due to its oversampling gain.",
                    advanced: [
                        {
                            title: "Pipeline Latency",
                            content: "High-speed communication ADCs often use a 'Pipeline' architecture, which offers high throughput like Flash but with a trade-off: several cycles of latency as data moves through the 'pipe'."
                        },
                        {
                            title: "Dynamic Nonlinearity (DNL)",
                            content: "In Flash ADCs, the accuracy of the comparator bank defines the DNL. If the internal resistor ladder varies slightly, some digital rungs will be 'taller' than others, causing subtle harmonic distortion."
                        }
                    ]
                }}
            />
    </div>
  );
};
