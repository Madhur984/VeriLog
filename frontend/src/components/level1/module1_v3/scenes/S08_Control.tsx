import React, { useEffect } from 'react';
import { useSignalStore } from '../store/signalStore';
import { InlineText } from '../components/InlineText';

export const S08_Control: React.FC = () => {
  const setSignalMode = useSignalStore((s) => s.setSignalMode);

  useEffect(() => {
    setSignalMode('deterministic');
    const timer = setTimeout(() => {
      useSignalStore.setState({ canProceed: true });
    }, 4000);
    return () => clearTimeout(timer);
  }, [setSignalMode]);

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-end pb-32">
      <InlineText 
        primary="Signal Processing." 
        secondary="The pipeline transforms raw entropy into structured logic." 
      />
      <div className="micro-text mb-20 animate-pulse opacity-40">Analyzing DSP pipeline...</div>
    </div>
  );
};
