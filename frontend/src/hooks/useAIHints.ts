import { useState, useEffect, useCallback } from 'react';

export interface HintAction {
  type: 'hint' | 'highlight' | 'pulse';
  target?: string;
  message: string;
}

export const useAIHints = (activeSectionId: string, isIdle: boolean) => {
  const [currentHint, setCurrentHint] = useState<HintAction | null>(null);
  const [mistakeCount, setMistakeCount] = useState<Record<string, number>>({});

  const trackMistake = useCallback((sectionId: string) => {
    setMistakeCount(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] || 0) + 1
    }));
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isIdle) {
      timer = setTimeout(() => {
        // Contextual hints based on section
        const hints: Record<string, HintAction> = {
          'signal_feel': { type: 'pulse', target: '.signal-target', message: 'Touch the signal to feel the data' },
          'signal_loop': { type: 'highlight', target: '.circuit-switch', message: 'Try closing the loop' },
          'embedded_lab': { type: 'hint', message: 'The current needs a continuous path to flow' },
          'signal_assignment': { type: 'hint', message: 'Think about real-world scenarios' },
        };

        if (hints[activeSectionId]) {
          setCurrentHint(hints[activeSectionId]);
        }
      }, 2500);
    } else {
      setCurrentHint(null);
    }

    return () => clearTimeout(timer);
  }, [isIdle, activeSectionId]);

  return {
    currentHint,
    trackMistake,
    mistakeCount
  };
};
