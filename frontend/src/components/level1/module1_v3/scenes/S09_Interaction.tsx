import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';
import { canvasState } from '../engine/canvasState';

export const S09_Interaction: React.FC = () => {
  const setSignalMode = useSignalStore((s) => s.setSignalMode);
  const setPhaseOffset = useSignalStore((s) => s.setPhaseOffset);
  const phaseAligned = useSignalStore((s) => s.phaseAligned);

  useEffect(() => {
    setSignalMode('triangular');
    canvasState.secondaryEnabled = true;
    canvasState.secondaryPhase = Math.PI * 0.8; // Target offset
    canvasState.secondaryOpacity = 0.4;
    canvasState.magneticStrength = 0.05;

    let isDragging = false;
    let lastX = 0;

    const onDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
    };

    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastX;
      lastX = e.clientX;
      
      const current = useSignalStore.getState().phase_offset;
      setPhaseOffset(current + deltaX * 0.01);
    };

    const onUp = () => {
      isDragging = false;
    };
    
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvasState.secondaryEnabled = false;
      canvasState.magneticStrength = 0;
    };
  }, [setSignalMode, setPhaseOffset]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <InlineText 
        primary="Align signals." 
        secondary={phaseAligned ? "SUPERPOSITION OPTIMAL" : "Drag horizontally to shift phase"} 
      />
      {phaseAligned && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="micro-text text-v3-cyan mt-4 tracking-widest uppercase"
        >
          Verification Successful
        </motion.div>
      )}
    </div>
  );
};
