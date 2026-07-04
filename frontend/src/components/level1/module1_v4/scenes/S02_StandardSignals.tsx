import React from 'react';
import { StepWave, RampWave, ImpulseWave, LocalMouseArea } from '../components/Module1Components';
import { TryItYourself } from '../../../ui/TryItYourself';

export const S02_StandardSignals: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)';

  return (
    <div className="space-y-24">
      <section>
        <div className="flex flex-col gap-6 mb-16">
          <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Standard Test Signals</h2>
          <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Engineers use pure mathematical signals to benchmark how systems react. Move your mouse over the displays to interact with the signal properties.
          </p>
        </div>

        <div className="space-y-16">
          {/* Unit Step */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono text-[10px] font-black tracking-widest uppercase">u(t)</div>
                <h3 className="text-2xl font-black">The Unit Step</h3>
              </div>
              <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Think of a light switch being flipped. It's zero, then suddenly it's one. This is used to test how a system reacts to a sudden, permanent change.
              </p>
              <div className={`p-4 rounded-xl border text-[10px] font-mono ${isDarkMode ? 'bg-black/40 border-emerald-900/30 text-emerald-500' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                Equation: u(t) = 1 for t ≥ 0, else 0
              </div>
            </div>
            <div className="rounded-2xl p-8 border h-48 flex items-center justify-center relative overflow-hidden bg-slate-900 dark:bg-black/40" style={{ borderColor }}>
              <TryItYourself corner />
              <LocalMouseArea render={(x, y) => <StepWave color="#10b981" mouseX={x} mouseY={y} />} />
            </div>
          </div>

          {/* Unit Ramp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div className="rounded-2xl p-8 border h-48 flex items-center justify-center relative overflow-hidden bg-slate-900 dark:bg-black/40 order-2 md:order-1" style={{ borderColor }}>
              <TryItYourself corner />
              <LocalMouseArea render={(x, y) => <RampWave color="#fb7185" mouseX={x} mouseY={y} />} />
            </div>
            <div className="space-y-4 order-1 md:order-2">
              <div className="flex items-center gap-3">
                <div className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 font-mono text-[10px] font-black tracking-widest uppercase">r(t)</div>
                <h3 className="text-2xl font-black">The Unit Ramp</h3>
              </div>
              <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Linear acceleration. The signal increases steadily with time. Ramps test a system's ability to track a moving target without error.
              </p>
              <div className={`p-4 rounded-xl border text-[10px] font-mono ${isDarkMode ? 'bg-black/40 border-rose-900/30 text-rose-500' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                Equation: r(t) = t for t ≥ 0, else 0
              </div>
            </div>
          </div>

          {/* Unit Impulse */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 font-mono text-[10px] font-black tracking-widest uppercase">δ(t)</div>
                <h3 className="text-2xl font-black">The Unit Impulse</h3>
              </div>
              <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                A momentary blast of energy. Infinite height, zero duration, area of one. This reveals the "Impusle Response" - the complete mathematical behavior of any system.
              </p>
              <div className={`p-4 rounded-xl border text-[10px] font-mono ${isDarkMode ? 'bg-black/40 border-cyan-900/30 text-cyan-500' : 'bg-cyan-50 border-cyan-100 text-cyan-700'}`}>
                Equation: δ(t) = ∞ at t=0, Area = 1
              </div>
            </div>
            <div className="rounded-2xl p-8 border h-48 flex items-center justify-center relative overflow-hidden bg-slate-900 dark:bg-black/40" style={{ borderColor }}>
               <TryItYourself corner />
               <LocalMouseArea render={(x, y) => <ImpulseWave color="#06b6d4" mouseX={x} mouseY={y} />} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
