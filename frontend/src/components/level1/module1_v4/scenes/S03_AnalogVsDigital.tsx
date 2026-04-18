import React from 'react';
import { Activity, Zap, Shield, Database, Send, Radio } from 'lucide-react';
import { AnalogWave, DigitalWave, SignalTypeCard, ConceptCard, ComparisonConsole, InsightPanel } from '../components/Module1Components';

export const S03_AnalogVsDigital: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="space-y-32">
      {/* ── Main Comparison ── */}
      <section>
        <h2 className={`text-4xl font-black mb-12 tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>The Great Divide: Analog vs Digital</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <SignalTypeCard
            title="Analog Power"
            color="#22d3ee"
            badge="Infinite Precision"
            wave={<AnalogWave color="#22d3ee" />}
            isDark={isDarkMode}
            description="Continuous variation. Every tiny change is captured. It captures the warmth of a vinyl record or the exact heat of a room. But precision comes with a cost: sensitivity to noise."
          />
          <SignalTypeCard
            title="Digital Precision"
            color="#a78bfa"
            badge="Discrete Logic"
            wave={<DigitalWave color="#a78bfa" />}
            isDark={isDarkMode}
            description="Quantized fixed steps. No gray area. It's either a 0 or a 1. This allows us to ignore noise and carry information perfectly across the globe without losing a single bit."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConceptCard
            isDark={isDarkMode}
            icon={<Shield size={20} />}
            color="#34d399"
            title="Noise Immunity"
            layman="Digital doesn't care about a little static."
            technical="Digital signals have a 'Noise Margin'. As long as the noise doesn't flip a 0 to a 1, the signal remains mathematically perfect."
            example="Comparing a clear high-def Netflix stream to a static-filled old analog TV broadcast."
          />
          <ConceptCard
            isDark={isDarkMode}
            icon={<Database size={20} />}
            color="#f472b6"
            title="Lossless Storage"
            layman="Vinyl wears out, MP3s live forever."
            technical="Analog media physically degrades with every play. Digital data is stored as raw numbers that can be copied infinitely without quality loss."
            example="A photo on your phone vs a polaroid that fades in the sun."
          />
        </div>
      </section>

      {/* ── Deep Dive: The Digital Advantage ── */}
      <section className="space-y-12">
        <div className="border-l-4 border-indigo-500 pl-8 space-y-4">
            <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Why do we choose Digital?</h3>
            <p className={`text-sm max-w-2xl leading-relaxed opacity-60 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                While Nature is analog, Engineering is digital. In the world of VLSI and Verilog, we rely on the digital domain for its absolute predictability. Imagine trying to build a CPU that had to handle '4.357 volts' instead of just 'High' or 'Low'. The complexity would be impossible.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InsightPanel 
              isDark={isDarkMode}
              title="Signal Stability"
              content="Analog signals fluctuate with temperature and age. Digital signals are binary; even if the voltage drops slightly, the CPU still reads it as a '1'. This is why your phone doesn't get 'blurrier' when its battery is low."
              career="System Architect"
            />
            <InsightPanel 
              isDark={isDarkMode}
              title="Data Compression"
              content="Digital signals can be mathematically compressed. We can represent a complex audio wave using a few thousand numbers, allowing us to send voices instantly across satellites."
              career="Communications Engineer"
            />
        </div>
      </section>

      {/* ── Side-by-Side Console ── */}
      <section>
        <div className="text-center mb-16 space-y-2">
          <h2 className={`text-4xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>The Logical Verdict</h2>
          <p className="text-[10px] font-mono uppercase tracking-[0.6em] opacity-30">Domain_Arbitrage_Matrix</p>
        </div>
        <ComparisonConsole isDark={isDarkMode} />
      </section>
    </div>
  );
};
