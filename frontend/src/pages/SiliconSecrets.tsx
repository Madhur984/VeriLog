import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useColorScheme } from '../hooks/useColorScheme';

interface Egg {
  id: string;
  name: string;
  hint: string;
  desc: string;
  icon: string;
}

const ALL_EGGS: Egg[] = [
  { id: 'konami', name: 'Oscilloscope Mode', hint: 'The legendary gaming code from the 80s.', desc: 'Enables retro monochrome green CRT scanlines across the application.', icon: '📡' },
  { id: 'vim', name: 'Vim Core Escape', hint: 'Save and quit the editor simulation.', desc: 'Slides down a RISC-V assembly core dump terminal.', icon: '💾' },
  { id: 'lottery', name: 'Silicon Lottery', hint: 'ASIC speed binning is all about speed.', desc: 'Spam interactive switches/inputs rapidly to glitch the UI.', icon: '🎰' },
  { id: 'fifo', name: 'FIFO Overflow', hint: 'Push too much data through the channel at once.', desc: 'Scroll the mouse wheel at extreme speeds to spill out data.', icon: '⚠️' },
  { id: 'smoke', name: 'Magic Smoke', hint: 'Letting the current flow way too long.', desc: 'Long press any interactive CTA button to release the smoke.', icon: '🔥' },
  { id: 'schematic', name: 'Schematic printout', hint: 'Dig deep into browser developer logs.', desc: 'Discovered the ASCII NAND gate circuit schematic inside DevTools.', icon: '📐' },
  { id: 'pull_up', name: 'Pull-up Resistor', hint: 'Float the console voltage high.', desc: 'Called BFB pull-up resistor calibration command in DevTools.', icon: '⚡' },
  { id: 'pull_down', name: 'Pull-down Resistor', hint: 'Float the console voltage low.', desc: 'Called BFB pull-down resistor calibration command in DevTools.', icon: '🔌' },
  { id: 'diagnostics', name: 'Logic Specialist', hint: 'Verify ECE core knowledge in console.', desc: 'Completed the three ECE diagnostics riddles in the developer tools.', icon: '🎉' },
];

export const SiliconSecrets = () => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const [discovered, setDiscovered] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('bfb_discovered_eggs') || '[]');
      setDiscovered(stored);
    } catch (e) {
      // ignore
    }
  }, []);

  const totalDiscovered = discovered.filter(id => ALL_EGGS.some(egg => egg.id === id)).length;

  return (
    <div
      className="min-h-screen py-16 px-6 relative overflow-hidden"
      style={{
        background: isLight ? 'var(--bg-void)' : '#080c14',
        color: 'var(--text-main)',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Decorative Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to bottom, var(--text-main) 1px, transparent 1px), linear-gradient(to right, var(--text-main) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase border"
            style={{
              background: 'rgba(34,211,238,0.06)',
              borderColor: 'rgba(34,211,238,0.22)',
              color: isLight ? '#0369A1' : '#7DD3FC',
            }}
          >
            ASIC Testing Subsystem
          </motion.span>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-extrabold tracking-tight"
          >
            Silicon Secrets Board
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm max-w-md mx-auto"
            style={{ color: 'var(--text-dim)' }}
          >
            Explore the platform and interact with UI elements to discover ECE-themed secrets. Can you find all {ALL_EGGS.length}?
          </motion.p>

          {/* Progress Bar */}
          <div className="mt-8 max-w-sm mx-auto p-4 rounded-2xl border" style={{ background: 'var(--bg-base)', borderColor: 'var(--border-soft)' }}>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-500">ASIC Yield</span>
              <span className="font-bold text-[#22D3EE]">{totalDiscovered} / {ALL_EGGS.length} found</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-slate-800">
              <div
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${(totalDiscovered / ALL_EGGS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Secrets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ALL_EGGS.map((egg) => {
            const isUnlocked = discovered.includes(egg.id);
            return (
              <div
                key={egg.id}
                className="p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden"
                style={{
                  background: 'var(--bg-elev)',
                  borderColor: isUnlocked ? (isLight ? '#0891B2' : '#22D3EE') : 'var(--border-soft)',
                  boxShadow: isUnlocked ? '0 8px 24px rgba(34, 211, 238, 0.08)' : 'none',
                }}
              >
                {/* PCB copper circuit line animation */}
                {isUnlocked && (
                  <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, #22D3EE 10%, transparent 80%)',
                    }}
                  />
                )}

                <div className="flex gap-4 items-start">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-lg shrink-0"
                    style={{
                      background: isUnlocked
                        ? 'rgba(34,211,238,0.1)'
                        : 'rgba(148,163,184,0.06)',
                      filter: isUnlocked ? 'grayscale(0)' : 'grayscale(1)',
                      border: isUnlocked ? '1px solid rgba(34,211,238,0.2)' : '1px dashed rgba(148,163,184,0.2)',
                    }}
                  >
                    {isUnlocked ? egg.icon : '🔒'}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      {egg.name}
                      {isUnlocked ? (
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                          Discovered
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                          Locked
                        </span>
                      )}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                      {isUnlocked ? egg.desc : `Hint: ${egg.hint}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
