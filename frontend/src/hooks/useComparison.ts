// src/hooks/useComparison.ts
import { useState } from 'react';

export const useComparison = () => {
  const [comparingIds, setComparingIds] = useState<string[]>([]);
  const [isBenchOpen, setIsBenchOpen] = useState(false);

  const toggleDomain = (id: string) => {
    if (comparingIds.includes(id)) {
      setComparingIds(prev => prev.filter(cid => cid !== id));
    } else if (comparingIds.length < 2) {
      setComparingIds(prev => [...prev, id]);
    }
  };

  const clearAll = () => {
    setComparingIds([]);
    setIsBenchOpen(false);
  };

  return {
    comparingIds,
    toggleDomain,
    clearAll,
    isBenchOpen,
    setIsBenchOpen
  };
};
