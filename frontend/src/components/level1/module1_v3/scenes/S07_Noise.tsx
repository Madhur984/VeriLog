import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S07_Noise: React.FC = () => {
  const setSignalMode = useSignalStore((s) => s.setSignalMode);

  useEffect(() => {
    setSignalMode('analog');
    canvasState.secondaryEnabled = true;
    canvasState.secondaryOpacity = 0.2;
    canvasState.secondaryFrequencyMult = 4.0;
    
    return () => {
      canvasState.secondaryEnabled = false;
    };
  }, [setSignalMode]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <InlineText 
        primary="Introduce distortion." 
        secondary="η ↑ → noise ↑" 
      />
    </div>
  );
};
