import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S01_Identity: React.FC = () => {
  const setSignalMode = useSignalStore((s) => s.setSignalMode);

  useEffect(() => {
    setSignalMode('analog');
    canvasState.magneticStrength = 0.4; // BOOSTED SENSITIVITY from 0.18
    
    return () => {
      canvasState.magneticStrength = 0;
    };
  }, [setSignalMode]);


  return (
    <InlineText 
      primary="Move to interact." 
      secondary="A signal is a change." 
    />
  );
};
