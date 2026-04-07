import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S02_Signal: React.FC = () => {
  const updateInteraction = useSignalStore((s) => s.updateInteraction);
  const checkProceed = useSignalStore((s) => s.checkProceed);
  const setSignalMode = useSignalStore((s) => s.setSignalMode);

  useEffect(() => {
    setSignalMode('digital');
    canvasState.magneticStrength = 0.1;

    const onMove = (e: MouseEvent) => {
      canvasState.cursorNormX = e.clientX / window.innerWidth;
      updateInteraction(0.016);
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
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <InlineText 
        primary="Variation exists." 
        secondary="Signals classify change as discrete or continuous." 
      />
    </div>
  );
};
