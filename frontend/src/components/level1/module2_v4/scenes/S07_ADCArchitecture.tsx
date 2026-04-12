import React from 'react';
import { Cpu, Zap, Layers, RefreshCw } from 'lucide-react';

/**
 * S07_ADCArchitecture: Silicon Reality
 * 1. Physical incarnations of the Digital Bridge.
 * 2. SAR, Flash, and Delta-Sigma trade-offs.
 */
/**
 * S07_ADCArchitecture: Silicon Reality
 */
export const S07_ADCArchitecture: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/50' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <header className="space-y-6">
        <h2 className={`text-6xl font-black italic tracking-tighter ${textColor}`}>
          Physical <span className={accentColor}>Silicon</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <p className={`text-xl leading-relaxed font-medium ${subTextColor}`}>
              Theory meets hardware. Depending on whether you need raw speed or infinite precision, engineers have designed three main "Silicon Bridges".
            </p>
            <div className={`p-6 rounded-3xl border flex flex-col gap-3 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-50 border-orange-100 shadow-sm'}`}>
                <span className={`text-[10px] font-mono font-black uppercase tracking-[0.3em] font-black ${accentColor}`}>The Hardware Trap</span>
                <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                   You can have **Resolution**, **Speed**, or **Cheap Power**. Pick any two.
                </p>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group space-y-4">
            <div className={`h-full p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col gap-8 ${isDarkMode ? 'bg-black/40 border-white/5 hover:border-orange-500/30 shadow-black' : 'bg-white border-gray-100 shadow-sm hover:border-orange-200'}`}>
                <div className="flex justify-between items-start">
                    <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
                        <Zap className="text-red-500" size={24} />
                    </div>
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#ef444466]">Speed: Peta-Samples</span>
                </div>
                <div className="space-y-4 flex-1">
                    <h3 className={`text-2xl font-black italic tracking-tighter ${textColor}`}>Flash ADC</h3>
                    <p className={`text-[11px] leading-relaxed font-medium ${subTextColor}`}>
                        The **Speed Demon**. It uses a massive ladder of comparators to see the signal instantly.
                    </p>
                    <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-gray-50'}`}>
                        <span className={`text-[9px] font-mono uppercase tracking-widest font-black block mb-2 ${accentColor}`}>Technical</span>
                        <p className={`text-[10px] leading-relaxed italic ${subTextColor}`}>
                            Uses $2^n - 1$ comparators in parallel. Latency is O(1)—the fastest possible.
                        </p>
                    </div>
                </div>
                <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                    <span className={`text-[9px] font-mono uppercase tracking-widest font-black ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Best For</span>
                    <span className={`text-[11px] font-black italic ${textColor}`}>Oscilloscopes, RF Comms</span>
                </div>
            </div>
        </div>

        <div className="group space-y-4">
            <div className={`h-full p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col gap-8 relative overflow-hidden ${isDarkMode ? 'bg-orange-500/5 border-orange-500/20 shadow-orange-950/20' : 'bg-orange-50 border-orange-200'}`}>
                <div className="absolute top-0 right-0 p-4">
                    <div className={`text-[40px] font-black italic opacity-5 leading-none ${accentColor}`}>SAR</div>
                </div>
                <div className="flex justify-between items-start">
                    <div className={`p-4 rounded-2xl border bg-orange-500 text-black shadow-lg shadow-orange-500/20`}>
                        <Layers size={24} />
                    </div>
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-orange-500/60">Efficiency Master</span>
                </div>
                <div className="space-y-4 flex-1">
                    <h3 className={`text-2xl font-black italic tracking-tighter ${textColor}`}>SAR ADC</h3>
                    <p className={`text-[11px] leading-relaxed font-medium ${subTextColor}`}>
                        The **Binary Scout**. It closes in on the signal like a logical search algorithm.
                    </p>
                    <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-white shadow-sm'}`}>
                        <span className={`text-[9px] font-mono uppercase tracking-widest font-black block mb-2 ${accentColor}`}>Analogy</span>
                        <p className={`text-[10px] leading-relaxed italic ${subTextColor}`}>
                            Like guessing a number between 1-100 by asking "Higher? Lower?".
                        </p>
                    </div>
                </div>
                <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                    <span className={`text-[9px] font-mono uppercase tracking-widest font-black ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Best For</span>
                    <span className={`text-[11px] font-black italic ${textColor}`}>Embedded MCU (Arduino), Sensors</span>
                </div>
            </div>
        </div>

        <div className="group space-y-4">
            <div className={`h-full p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col gap-8 ${isDarkMode ? 'bg-black/40 border-white/5 hover:border-orange-500/30 shadow-black' : 'bg-white border-gray-100 shadow-sm hover:border-orange-200'}`}>
                <div className="flex justify-between items-start">
                    <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-100'}`}>
                        <RefreshCw className={accentColor} size={24} />
                    </div>
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-orange-500/60">Audio Fidelity</span>
                </div>
                <div className="space-y-4 flex-1">
                    <h3 className={`text-2xl font-black italic tracking-tighter ${textColor}`}>Delta-Sigma</h3>
                    <p className={`text-[11px] leading-relaxed font-medium ${subTextColor}`}>
                        The **Purist**. It samples at extreme speeds to achieve 24-bit+ resolution.
                    </p>
                    <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-gray-50'}`}>
                        <span className={`text-[9px] font-mono uppercase tracking-widest font-black block mb-2 ${accentColor}`}>The Magic</span>
                        <p className={`text-[10px] leading-relaxed italic ${subTextColor}`}>
                            Uses noise-shaping to push error frequencies out of human hearing.
                        </p>
                    </div>
                </div>
                <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                    <span className={`text-[9px] font-mono uppercase tracking-widest font-black ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Best For</span>
                    <span className={`text-[11px] font-black italic ${textColor}`}>Music Recording, High-End Audio</span>
                </div>
            </div>
        </div>
      </div>

      <div className={`p-10 rounded-[2.5rem] border overflow-hidden shadow-2xl ${isDarkMode ? 'bg-black/60 border-white/5 shadow-black' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
        <h4 className={`text-xl font-black italic uppercase tracking-tighter mb-8 ${textColor}`}>ADC Selection Matrix</h4>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                        <th className={`pb-4 text-[10px] font-mono uppercase tracking-[0.2em] font-black ${subTextColor}`}>Architecture</th>
                        <th className={`pb-4 text-[10px] font-mono uppercase tracking-[0.2em] font-black ${subTextColor}`}>Speed</th>
                        <th className={`pb-4 text-[10px] font-mono uppercase tracking-[0.2em] font-black ${subTextColor}`}>Precision</th>
                        <th className={`pb-4 text-[10px] font-mono uppercase tracking-[0.2em] font-black ${subTextColor}`}>Cost/Power</th>
                    </tr>
                </thead>
                <tbody className={`text-[11px] font-medium ${textColor}`}>
                    <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                        <td className="py-4 font-black italic uppercase">Flash</td>
                        <td className="py-4 text-red-500 font-black">ULTRA FAST</td>
                        <td className="py-4 opacity-40">Low (8-bit)</td>
                        <td className="py-4 text-red-400">Very High</td>
                    </tr>
                    <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                        <td className="py-4 font-black italic uppercase">SAR</td>
                        <td className="py-4 text-orange-400 font-black">MODERATE</td>
                        <td className="py-4">Mid (12-16 bit)</td>
                        <td className="py-4 text-orange-300 font-black uppercase tracking-tighter">Gold Standard</td>
                    </tr>
                    <tr>
                        <td className="py-4 font-black italic uppercase">Delta-Sigma</td>
                        <td className="py-4 opacity-40">Slow</td>
                        <td className="py-4 text-orange-500 font-black italic">ULTRA HIGH</td>
                        <td className="py-4 opacity-60">Efficient</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      <div className={`p-10 rounded-[2.5rem] border flex flex-col md:flex-row items-center gap-10 shadow-2xl ${isDarkMode ? 'bg-black/60 border-white/5 shadow-black' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
        <div className={`p-6 rounded-[2rem] border ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-100 border-orange-200'}`}>
            <Cpu size={48} className={accentColor} />
        </div>
        <div className="flex-1 space-y-4 text-left">
            <h4 className={`text-xl font-black italic uppercase tracking-tighter ${textColor}`}>Silicon Selection</h4>
            <p className="text-xs leading-relaxed font-medium">
               Hardware design is always a trade-off. A Flash ADC might be perfect for your oscilloscope, 
               but it would drain the battery of your smartwatch in minutes. Engineers choose the bridge 
               based on the "Signal requirements" of the application.
            </p>
        </div>
      </div>
    </div>
  );
};
