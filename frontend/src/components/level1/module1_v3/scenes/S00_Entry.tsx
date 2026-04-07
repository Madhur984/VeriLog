import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';

export const S00_Entry: React.FC = () => {
  const updateInteraction = useSignalStore((s) => s.updateInteraction);
  const checkProceed = useSignalStore((s) => s.checkProceed);

  useEffect(() => {
    // Reveal proceed button after a short cinematic delay
    const timer = setTimeout(() => {
      updateInteraction(3); 
      checkProceed();
    }, 3000);
    return () => clearTimeout(timer);
  }, [updateInteraction, checkProceed]);

  return (
    <InlineText 
      primary="The Signal" 
      secondary="Module 1: Acquisition" 
    />
  );
};

