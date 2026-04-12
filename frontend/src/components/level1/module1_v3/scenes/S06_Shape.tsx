import React, { useEffect, useState } from 'react';
import { useSignalStore, SignalMode } from '../store/signalStore';
import { InlineText } from '../components/InlineText';

const MODES: { id: SignalMode; label: string }[] = [
  { id: 'analog', label: 'ANALOG (~) ' },
  { id: 'step', label: 'STEP (﹂)' },
  { id: 'impulse', label: 'IMPULSE (↑)' },
  { id: 'ramp', label: 'RAMP (／)' }
];

export const S06_Shape: React.FC = () => {
  const signalMode = useSignalStore((s) => s.signalMode);
  const setSignalMode = useSignalStore((s) => s.setSignalMode);
  const [tried, setTried] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSignalMode('analog');
  }, [setSignalMode]);

  const handleSelect = (mode: SignalMode) => {
    setSignalMode(mode);
    const newTried = new Set(tried);
    newTried.add(mode);
    setTried(newTried);
    if (newTried.size >= 3) {
      useSignalStore.setState({ canProceed: true });
    }
  };

  const SHAPE_INFO: Record<string, string> = {
    analog: "The pure mathematician. Infinite precision, smooth gradients. The foundation of all natural sound and light.",
    step: "The computer's breath. Binary logic—on or off. Instantaneous transitions that define digital memory.",
    impulse: "The mathematical ghost. Infinite height, zero width. Used to test how systems react to sudden shocks.",
    ramp: "The steady climber. Linear growth over time. Essential for scanning techniques and generating timing references."
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-12">
      <div className="w-full max-w-2xl mx-auto space-y-8 flex flex-col items-center pb-24">
        <InlineText 
          primary="Elementary Forms." 
          secondary="The building blocks of complex signals." 
        />

        {/* NEW: Shape Description Card */}
        <div className="pointer-events-auto h-24 flex items-center justify-center text-center px-12">
            <p className="text-xs font-mono text-v3-cyan/80 italic leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">
                {SHAPE_INFO[signalMode] || SHAPE_INFO.analog}
            </p>
        </div>

        <div className="pointer-events-auto flex gap-2 bg-black/40 backdrop-blur-md p-2 rounded-sm border border-white/5">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelect(m.id)}
              className={`micro-text px-4 py-2 border rounded-sm transition-all ${
                signalMode === m.id 
                  ? 'border-v3-cyan text-v3-cyan bg-v3-cyan/5 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                  : 'border-white/10 text-white/40 hover:text-white/70'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="pointer-events-auto py-4">
             <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">
                Select 3 forms to proceed
             </p>
        </div>
      </div>
    </div>
  );
};
