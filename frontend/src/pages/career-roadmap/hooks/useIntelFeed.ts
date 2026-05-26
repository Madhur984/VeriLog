import { useState, useEffect } from 'react';
import { tickerData, TickerItem } from '../data/ticker';

export function useIntelFeed() {
  const [activeItems] = useState<TickerItem[]>(tickerData);
  const [isPaused, setIsPaused] = useState(false);

  // In a real app, this could poll an API
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        // Future logic for dynamic feed updates could go here
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return {
    items: activeItems,
    isPaused,
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false)
  };
}
