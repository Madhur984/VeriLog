import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S12_Conclusion: React.FC = () => {
  const nextScene = useSignalStore(s => s.nextScene);

  useEffect(() => {
    canvasState.magneticStrength = 0.25;
    
    // Auto-transition to Master Lab after 4s
    const timer = setTimeout(() => {
      nextScene();
    }, 4500);

    return () => {
      clearTimeout(timer);
      canvasState.magneticStrength = 0;
    };
  }, [nextScene]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <InlineText 
        primary="The Loop is Complete." 
        secondary="The signal has returned. Intelligence begins." 
      />
    </div>
  );
};
