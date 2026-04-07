import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S12_Conclusion: React.FC = () => {
  useEffect(() => {
    canvasState.magneticStrength = 0.25;
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
        primary="The Loop is Complete." 
        secondary="The signal has returned. Intelligence begins." 
      />
    </div>
  );
};
