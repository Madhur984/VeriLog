import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, Info } from 'lucide-react';
import { TechnicalAudit } from '../components/TechnicalAudit';
import { ADCSimulator } from '../components/UltimateComponents';

export const S04_Quantization: React.FC<{ time: number; isDarkMode: boolean }> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-gray-500';
  const accentColor = isDarkMode ? 'text-orange-500' : 'text-orange-600';

  return (
    <div className="flex flex-col gap-16 max-w-6xl mx-auto mb-32 text-left">
      <header className="space-y-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
            Level 02.04 // The Rung Paradox
        </div>
        <h2 className={`text-7xl font-black italic tracking-tighter ${textColor}`}>
          Vertical <span className={accentColor}>Resolution</span>
        </h2>
        <p className={`text-xl leading-relaxed font-medium max-w-2xl ${subTextColor}`}>
            A computer is a ladder; quantization is the act of rounding reality to the nearest available rung.
        </p>
      </header>

      {/* ⚡ ADC SIMULATOR BRIDGE */}
      <div className="w-full">
        <ADCSimulator isDarkMode={isDarkMode} />
      </div>

      <footer className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 text-left">
            <div className="space-y-6">
                <h3 className={`text-2xl font-black italic tracking-tight border-l-4 border-orange-500 pl-6 ${textColor}`}>The 6dB Golden Rule</h3>
                <p className={`text-base font-medium leading-relaxed opacity-60 ${textColor}`}>
                    Every single bit you add doubles the number of available rungs. Each extra bit improves the signal‑to‑noise ratio (SNR) by about 6 dB. This is the **6.02 dB per bit rule**.
                </p>
           </div>
           <div className={`p-10 rounded-[2.5rem] border border-dashed flex flex-col justify-center gap-4 ${isDarkMode ? 'bg-orange-500/5 border-orange-500/10 shadow-inner' : 'bg-orange-50 border-gray-100'}`}>
                 <div className="flex items-center gap-3">
                    <Activity size={14} className="text-orange-500" />
                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}>Aha! Moment</h4>
                 </div>
                 <p className={`text-sm italic leading-relaxed font-bold ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>
                    "A ruler with only centimetre marks is coarse. A ruler with millimetre marks is precise. Both are digital approximations of a smooth length."
                 </p>
           </div>
      </footer>

      <TechnicalAudit 
          isDarkMode={isDarkMode}
          showFullView={true}
          specs={{
              concept: "Quantization Bridge: The process of mapping a continuous voltage value to a discrete integer. This is where the infinite nature of analog is lost.",
              physical: "Input Sensitivity: The smallest change in voltage an ADC can detect is Vin / 2^N. At 12 bits, this is often in the millivolt range.",
              formal: "Dynamic Range: Defined by bit depth. 16 bits provides 96dB of range, while 24 bits provides 144dB—wider than the hearing range of a human.",
              insight: "Signal Condition: Before quantization, signals must be amplified to fill the entire ADC range. If the signal is too small, resolution is wasted.",
              advanced: [
                  {
                      title: "Integrity Checks",
                      content: "High-precision ADCs often use 'Successive Approximation' (SAR) logic to verify each bit individually, starting from the Most Significant Bit (MSB)."
                  },
                  {
                      title: "Noise Floor Power",
                      content: "Even with infinite bits, thermal noise in resistors creates a physical limit to conversion accuracy. This is known as Johnson-Nyquist noise."
                  }
              ]
          }}
      />
    </div>
  );
};
