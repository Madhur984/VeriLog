import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S01_Identity: React.FC = () => {
  const updateInteraction = useSignalStore((s) => s.updateInteraction);
  const checkProceed = useSignalStore((s) => s.checkProceed);
  const setSignalMode = useSignalStore((s) => s.setSignalMode);

  useEffect(() => {
    setSignalMode('analog');
    canvasState.magneticStrength = 0.4; // BOOSTED SENSITIVITY from 0.18
    
    const onMove = (e: MouseEvent) => {
      canvasState.cursorNormX = e.clientX / window.innerWidth;
      canvasState.cursorX = e.clientX;
      canvasState.cursorY = e.clientY;
      updateInteraction(0.08); // BOOSTED SENSITIVITY from 0.016
      checkProceed();
    };
    
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      canvasState.magneticStrength = 0;
      canvasState.cursorNormX = -1;
    };
  }, [updateInteraction, checkProceed, setSignalMode]);


  return (
    <InlineText 
      primary="Move to interact." 
      secondary="A signal is a change." 
    />
  );
};


