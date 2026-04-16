import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Square, Zap, Info, ArrowRight } from 'lucide-react';
import { TechnicalAudit } from '../components/TechnicalAudit';
import { InteractiveWaveform, dailyExamples, comparisonData } from '../components/UltimateComponents';

export const S01_AnalogVsDigital: React.FC<{ time: number; isDarkMode: boolean }> = ({ time, isDarkMode }) => {
  const [waveType, setWaveType] = useState<'analog' | 'digital'>('analog');
  const [activeExample, setActiveExample] = useState<string | null>(null);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';

  return (
    <div className="flex flex-col gap-16 max-w-6xl mx-auto mb-32">
      <header className="space-y-4 text-left">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                Level 02.01 // The Great Divide
            </div>
            <motion.div className="space-y-4">
                <h1 className={`text-7xl font-black italic tracking-tighter leading-tight ${textColor}`}>
                  Nature <span className="opacity-20">vs</span> <span className={accentColor}>Numbers</span>
                </h1>
                <p className={`text-2xl leading-relaxed font-bold tracking-tight ${textColor}`}>
                    The world is smooth. The machine is stepped.
                </p>
            </motion.div>
      </header>

      {/* 🔬 ULTIMATE WAVEFORM LAB */}
      <div className={`relative p-8 rounded-[3rem] border shadow-2xl overflow-hidden transition-all duration-700 ${isDarkMode ? 'bg-black/80 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse bg-orange-500`} />
            <span className={`font-mono text-[10px] uppercase tracking-widest font-black opacity-30 ${textColor}`}>Active Signal Monitor v4.0</span>
          </div>
          
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
            <button
              onClick={() => setWaveType('analog')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                waveType === 'analog' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Waves size={14} /> Analog
            </button>
            <button
              onClick={() => setWaveType('digital')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                waveType === 'digital' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Square size={14} /> Digital
            </button>
          </div>
        </div>

        <InteractiveWaveform type={waveType} frequency={1.5} amplitude={80} isDarkMode={isDarkMode} />

        <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className={`p-6 rounded-3xl border transition-all duration-500 ${waveType === 'analog' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-transparent border-white/5 opacity-30'}`}>
                <h4 className="text-sm font-black uppercase text-orange-500 mb-2">Analog: Reality</h4>
                <p className={`text-xs font-medium leading-relaxed ${subTextColor}`}>
                    Smooth, continuous values. It represents infinite precision between any two points.
                </p>
            </div>
            <div className={`p-6 rounded-3xl border transition-all duration-500 ${waveType === 'digital' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-transparent border-white/5 opacity-30'}`}>
                <h4 className="text-sm font-black uppercase text-orange-500 mb-2">Digital: Processing</h4>
                <p className={`text-xs font-medium leading-relaxed ${subTextColor}`}>
                    Discrete, stepped values. The world is rounded to the nearest integer for machine processing.
                </p>
            </div>
        </div>
      </div>

      {/* 📱 DAILY LIFE EXPLORATION */}
      <section className="space-y-10">
        <div className="flex flex-col gap-2">
            <h3 className={`text-3xl font-black italic tracking-tight border-l-4 border-orange-500 pl-6 ${textColor}`}>Where do they hide?</h3>
            <p className={`text-sm font-medium opacity-60 pl-6 ${textColor}`}>Explore the tangible manifestations of signals in our environment.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full">
            {dailyExamples.map((item) => (
            <motion.div
                key={item.id}
                onClick={() => setActiveExample(activeExample === item.id ? null : item.id)}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`cursor-pointer p-8 rounded-[2.5rem] border transition-all duration-500 ${
                activeExample === item.id 
                    ? 'bg-[#121215] border-orange-500 shadow-2xl' 
                    : isDarkMode ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-gray-50 border-gray-100'
                }`}
            >
                <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${activeExample === item.id ? 'bg-orange-500 text-white' : 'bg-white/5 text-orange-500'}`}>
                    {item.icon}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className={`font-black uppercase text-[10px] tracking-[0.2em] ${activeExample === item.id ? 'text-orange-500' : subTextColor}`}>{item.title}</h3>
                    <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="opacity-40">Analog</span>
                        <ArrowRight size={10} className="text-orange-500" />
                        <span className="text-orange-500">Digital</span>
                    </div>
                </div>

                <AnimatePresence>
                    {activeExample === item.id && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`pt-6 border-t border-white/5 text-xs leading-relaxed font-medium ${subTextColor}`}
                    >
                        {item.description}
                    </motion.div>
                    )}
                </AnimatePresence>
                </div>
            </motion.div>
            ))}
        </div>
      </section>

      {/* 📊 COMPARISON TABLE */}
      <section className={`p-10 rounded-[3rem] border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className={`text-2xl font-black italic tracking-tight mb-8 ${textColor}`}>Technical Comparison</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/10">
                        <th className={`pb-6 text-[10px] font-black uppercase tracking-widest ${subTextColor}`}>Feature</th>
                        <th className={`pb-6 text-[10px] font-black uppercase tracking-widest text-orange-500`}>Analog</th>
                        <th className={`pb-6 text-[10px] font-black uppercase tracking-widest text-orange-500`}>Digital</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {comparisonData.map((row, idx) => (
                        <tr key={idx} className="group hover:bg-white/5 transition-all">
                            <td className={`py-4 text-xs font-black uppercase tracking-tighter ${textColor}`}>{row.feature}</td>
                            <td className={`py-4 text-xs font-medium opacity-60 ${textColor}`}>{row.analog}</td>
                            <td className={`py-4 text-xs font-medium ${accentColor}`}>{row.digital}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </section>

      <TechnicalAudit 
          isDarkMode={isDarkMode}
          showFullView={true}
          specs={{
              concept: "Nature vs. Numbers: To make a signal digital, we must approximate it. The absolute priority of this module is understanding the 'Staircase' vs 'Smooth' conflict.",
              physical: "Signal Domain Partition: Reality is an infinite ramp. Computers use finite state logic. The bridge between these two exists at the transistor level.",
              formal: "0s and 1s vs Voltages: While analog uses raw voltage levels to carry information, digital uses logic thresholds. A signal is only '1' if it crosses a specific barrier.",
              insight: "Noise Immunity: The greatest advantage of digital is its ability to ignore small amounts of noise. An analog wave will distort; a digital bit will simply be high or low.",
              advanced: [
                  {
                      title: "Continuous Time Dynamics",
                      content: "In nature, between any two points in time, there is an infinite amount of other points. This is why analog signals can theoretically carry infinite information density."
                  },
                  {
                      title: "Signal-to-Noise Ratio (SNR)",
                      content: "The quality of an analog signal is measured by SNR. In digital, we achieve better SNR by simply adding more bits to the conversion process."
                  }
              ]
          }}
      />
    </div>
  );
};
