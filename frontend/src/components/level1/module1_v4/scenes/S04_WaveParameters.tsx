import React from 'react';
import { motion } from 'framer-motion';
import { SineWaveSmall, KineticText, InsightPanel } from '../components/Module1Components';

export const S04_WaveParameters: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)';

  return (
    <div className="space-y-24">
      <section>
        <h2 className="text-3xl font-black mb-12 flex items-center gap-4">
          <KineticText text="WAVE_LITERALS" className={isDarkMode ? 'text-cyan-500' : 'text-slate-900'} />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              name: 'Amplitude', color: '#22d3ee', emoji: '📏',
              layman: 'How strong is it?',
              tech: 'Peak displacement from zero.',
              example: 'Volume Control (Loud vs Quiet).',
              mode: 'amplitude'
            },
            {
              name: 'Frequency', color: '#a78bfa', emoji: '⏱️',
              layman: 'How fast is it?',
              tech: 'Cycles per second (Hertz).',
              example: 'Musical Pitch (High vs Low).',
              mode: 'frequency'
            },
            {
              name: 'Phase', color: '#fbbf24', emoji: '⬅️',
              layman: 'Where did it start?',
              tech: 'Starting position offset.',
              example: 'Signal synchronization.',
              mode: 'phase'
            },
          ].map(param => (
            <div
              key={param.name}
              className="rounded-3xl p-7 border flex flex-col gap-8 transition-colors"
              style={{ background: isDarkMode ? '#0A0C10' : '#ffffff', borderColor }}
            >
              <div className="text-4xl">{param.emoji}</div>
              <div>
                <h3 className="text-2xl font-black mb-1" style={{ color: param.color }}>{param.name}</h3>
                <p className={`text-sm mb-4 font-medium opacity-60 ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}>{param.layman}</p>
                <div className="h-px w-full bg-slate-500/10 mb-4" />
                <p className={`text-[10px] font-mono uppercase tracking-widest opacity-40`}>{param.tech}</p>
              </div>
              <div className="mt-auto bg-black/20 rounded-2xl p-4">
                <SineWaveSmall 
                  color={param.color} 
                  speed={param.name === 'Frequency' ? 0.08 : param.name === 'Phase' ? 0.03 : 0.05} 
                  mode={param.mode as any}
                  isDark={isDarkMode}
                />
              </div>
            </div>
          ))}
        </div>

        <InsightPanel 
          isDark={isDarkMode}
          title="The Natural Oscillator"
          content="The Sine wave isn't just math; it represents pure circular motion. In electronics, oscillators use this fundamental physics to generate steady timing pulses and carrier waves for communication."
          career="RF Engineer // Analog Designer"
        />
      </section>

      <section className="relative">
        <div className={`rounded-[3rem] p-12 text-center border overflow-hidden ${isDarkMode ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="text-[10px] font-mono font-black uppercase tracking-[0.6em] mb-12 opacity-30">The Universal Formula</div>
          
          <div className="inline-block p-10 rounded-3xl bg-black/40 border-2 border-cyan-500/20 mb-12">
            <p className="text-4xl font-mono tracking-widest text-cyan-500 md:text-6xl flex items-center justify-center gap-2">
              x(t) = A cos(ωt + θ)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {[
              { id: 'x', label: 'Position', desc: 'The height of the wave at this exact moment.' },
              { id: 'A', label: 'Amplitude', desc: 'The overall size and power of the signal.' },
              { id: 'ω', label: 'Omega', desc: 'The angular frequency (how fast it cycles).' },
              { id: 't', label: 'Time', desc: 'Life moving forward. Without time, there is no signal.' },
              { id: 'θ', label: 'Phase', desc: 'The starting offset at t=0.' },
            ].map(item => (
              <div key={item.id} className="p-5 rounded-2xl bg-black/20 border border-white/5 group hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded bg-cyan-500/20 flex items-center justify-center font-mono text-cyan-500 font-bold">{item.id}</span>
                  <span className="text-sm font-bold opacity-80 uppercase tracking-widest">{item.label}</span>
                </div>
                <p className="text-xs opacity-50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
