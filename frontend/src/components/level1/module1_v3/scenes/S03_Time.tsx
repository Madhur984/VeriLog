import React, { useEffect, useRef } from 'react';
import { useSignalStore } from '../store/signalStore';
import { canvasState } from '../engine/canvasState';
import { InlineText } from '../components/InlineText';

export const S03_Time: React.FC = () => {
  const { checkProceed } = useSignalStore();
  const isDragging = useRef(false);
  const startX = useRef(0);
  const baseOffset = useRef(0);
  const dragCount = useRef(0);

  useEffect(() => {
    useSignalStore.getState().setSignalMode('periodic');
    canvasState.timeOffset = 0;

    const onDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.clientX;
      baseOffset.current = canvasState.timeOffset;
    };

    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = (e.clientX - startX.current) * 0.025;
      canvasState.timeOffset = baseOffset.current - delta;
      dragCount.current++;
      if (dragCount.current > 30) {
        checkProceed();
      }
    };

    const onUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvasState.timeOffset = 0;
    };
  }, [checkProceed]);

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
