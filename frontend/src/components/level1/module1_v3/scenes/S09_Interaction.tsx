import React, { useState, useEffect } from 'react';
import { useSignalStore, SignalMode } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

const MODES: { id: SignalMode; label: string }[] = [
  { id: 'triangular', label: 'TRIANGLE (▲)' },
  { id: 'rectangular', label: 'BINARY (■)' }
];

export const S09_Interaction: React.FC = () => {
  const signalMode = useSignalStore((s) => s.signalMode);
  const setSignalMode = useSignalStore((s) => s.setSignalMode);
  const [tried, setTried] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSignalMode('triangular');
    canvasState.secondaryEnabled = true;
    canvasState.secondaryPhase = 0;
    canvasState.magneticStrength = 0.1;
    
    const onMove = (e: MouseEvent) => {
      canvasState.cursorNormX = e.clientX / window.innerWidth;
    };
    
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      canvasState.secondaryEnabled = false;
      canvasState.magneticStrength = 0;
      canvasState.cursorNormX = -1;
    };
  }, [setSignalMode]);

  const handleSelect = (mode: SignalMode) => {
    setSignalMode(mode);
    const newTried = new Set(tried);
    newTried.add(mode);
    setTried(newTried);
    if (newTried.size >= 2) {
      useSignalStore.setState({ canProceed: true });
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <InlineText 
        primary="Waveform Interaction." 
        secondary="Superposition creates interference and complexity." 
      />

      <div className="pointer-events-auto flex gap-2 mb-20 bg-black/40 backdrop-blur-md p-2 rounded-sm border border-white/5">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSelect(m.id)}
            className={`micro-text px-4 py-2 border rounded-sm transition-all ${
              signalMode === m.id 
                ? 'border-v3-cyan text-v3-cyan bg-v3-cyan/5' 
                : 'border-white/10 text-white/40 hover:text-white/70'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
};
