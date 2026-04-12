import React from 'react';
import { motion } from 'framer-motion';
import { ConceptCard } from '../components/ConceptCard';
import { Cpu, Zap, Layers, RefreshCw } from 'lucide-react';

/**
 * S07_ADCArchitecture: Silicon Reality
 * 1. Physical incarnations of the Digital Bridge.
 * 2. SAR, Flash, and Delta-Sigma trade-offs.
 */
export const S07_ADCArchitecture: React.FC = () => {
  return (
    <div className="flex flex-col gap-16 max-w-5xl mx-auto">
      <header className="space-y-6 text-center max-w-3xl mx-auto">
        <h2 className="text-6xl font-black italic tracking-tighter text-white">
          Physical <span className="text-cyan-500">Silicon</span>
        </h2>
        <p className="text-xl text-white/50 leading-relaxed font-medium">
          Theory meets hardware. Depending on your needs — speed vs precision — 
          silicon engineers have built different types of bridges.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
            <ConceptCard 
                icon={<Zap />}
                title="Flash ADC"
                layman="The Speed Demon. Sees everything at once."
                technical="Direct conversion using a large bank of comparators and a resistor ladder. N bits require 2^N resistors and comparators."
                example="Oscilloscopes and high-speed data acquisition where speed is the only priority."
                extra="O(1) conversion time, but exponentially power-hungry."
                color="#ef4444"
            />
            <ConceptCard 
                icon={<Layers />}
                title="SAR ADC"
                layman="The Logical Scout. Narrows it down step by step."
                technical="Successive Approximation Register. Uses a binary search algorithm to narrow down the input voltage bit by bit."
                example="Standard microcontrollers (Arduino, ESP32) and general purpose sensors."
                extra="Excellent balance of resolution (8-18 bits) and medium speed."
                color="#f97316"
            />
        </div>

        <div className="space-y-6">
            <ConceptCard 
                icon={<RefreshCw />}
                title="Delta-Sigma"
                layman="The Precision Sculptor. Samples fast to hear deep."
                technical="Oversampling and noise shaping. Uses high-speed 1-bit sampling followed by heavy digital filtering to recover high resolution."
                example="High-end audio equipment, music production, and precision laboratory scales."
                extra="Ultra-high resolution (24-32 bits) but limited speed."
                color="#06b6d4"
            />
            
            <div className="p-10 rounded-[2.5rem] bg-cyan-500/5 border border-cyan-500/10 flex flex-col justify-center items-center text-center space-y-4 shadow-xl">
                <Cpu size={48} className="text-cyan-500/40 mb-2" />
                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-cyan-500">The Power of Noise Shaping</h4>
                <p className="text-xs text-white/30 leading-relaxed font-medium italic">
                    "Modern Delta-Sigma ADCs can resolve changes as small as a single microvolt by simply out-sampling the noise."
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
