import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S10_RealWorld: React.FC = () => {
  useEffect(() => {
    canvasState.magneticStrength = 0.15;
    const handleMove = (e: MouseEvent) => {
      canvasState.cursorNormX = e.clientX / window.innerWidth;
    };
    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      canvasState.magneticStrength = 0;
      canvasState.cursorNormX = -1;
    };
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <InlineText 
        primary="Signals are Reality." 
        secondary="The language of existence is a function of variation." 
      />
    </div>
  );
};
