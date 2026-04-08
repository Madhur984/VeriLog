import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { InlineText } from '../components/InlineText';

export const S03_Time: React.FC = () => {

  useEffect(() => {
    useSignalStore.getState().setSignalMode('periodic');
    canvasState.magneticStrength = 0.5;

    return () => {
      canvasState.magneticStrength = 0;
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-32">
      <InlineText 
        primary="Time is the carrier." 
        secondary="Signals exist only in the unfolding of now." 
      />
      <div className="micro-text opacity-30 mb-20">Drag to unfold time</div>
    </div>
  );
};
