import React from 'react';
import { motion } from 'framer-motion';
import { AnalogWave, DigitalWave, KineticText } from '../components/Module1Components';

export const S01_Introduction: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)';

  return (
    <div className="space-y-24">
      {/* --- HERO --- */}
      <section className="relative">
        <div className="flex flex-col gap-2 mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-cyan-500 font-black">Module 01 // Signals &amp; Waves</span>
          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight">
            <KineticText text="Signals" className={isDarkMode ? 'text-cyan-500' : 'text-cyan-600'} />
            <br />
            <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>&amp; Waves</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
          <div className="px-5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500">
            Where every chip begins
          </div>
          <p className={`text-xl font-medium leading-relaxed max-w-xl italic ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            "The universe speaks in waves. Engineers speak in bits. This is the bridge between them."
          </p>
        </div>

        {/* Animated live demo */}
        <div className="rounded-3xl p-8 border mt-16 shadow-xl" style={{ background: isDarkMode ? '#0A0C10' : '#ffffff', borderColor }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span className={`text-[10px] font-mono uppercase tracking-widest font-black ${isDarkMode ? 'text-cyan-500' : 'text-cyan-600'}`}>Live Waveform Dual-Stream</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-widest opacity-40">Analog Stream (Continuous)</p>
              <div className="rounded-2xl bg-slate-900 dark:bg-black/40 overflow-hidden">
                <AnalogWave color="#22d3ee" />
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-widest opacity-40">Digital Stream (Discrete)</p>
              <div className="rounded-2xl bg-slate-900 dark:bg-black/40 overflow-hidden">
                <DigitalWave color="#a78bfa" complexity={1} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DEFINITION --- */}
      <section>
        <div className="relative">
          <h2 className={`text-2xl font-black mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>The Core Concept</h2>
          <div className="space-y-6 text-lg leading-relaxed opacity-80">
            <p>
              Imagine shouting through a tube. Your voice vibrates the air. In a computer, that vibration is replaced by <strong className="text-cyan-500">Volts</strong>. 
            </p>
            <div className={`p-8 rounded-2xl border-l-4 font-bold text-xl ${isDarkMode ? 'bg-cyan-950/20 border-cyan-500 text-cyan-100' : 'bg-cyan-50 border-cyan-500 text-cyan-900'}`}>
               "A signal is any physical quantity that varies to convey information."
            </div>
            <p>
              High voltage might mean <span className="text-cyan-500 font-black">1</span>, and Low voltage might mean <span className="text-slate-500 font-black">0</span>.
            </p>
          </div>
        </div>

        {/* Examples */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '🎙️', label: 'Human Voice', sub: 'Air pressure' },
            { emoji: '📡', label: 'WiFi Signal', sub: 'EM Wave' },
            { emoji: '💡', label: 'Optical Fiber', sub: 'Light pulses' },
            { emoji: '🌡️', label: 'Sensors', sub: 'Voltage' },
          ].map(ex => (
            <div key={ex.label} className="rounded-2xl p-6 border text-center transition-all bg-black/5 hover:bg-black/10" style={{ borderColor }}>
              <div className="text-3xl mb-4">{ex.emoji}</div>
              <p className="text-sm font-black uppercase tracking-widest">{ex.label}</p>
              <p className="text-[10px] mt-1 opacity-40 font-mono tracking-wider">{ex.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
