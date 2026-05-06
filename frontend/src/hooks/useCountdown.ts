import { useState, useEffect } from 'react';

export const useCountdown = (targetDate: string) => {
  const [timeLeft, setTimeLeft] = useState({ dd: 0, hh: 0, mm: 0, ss: 0 });
  
  useEffect(() => {
    if (!targetDate) return;
    
    const calculate = () => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = Math.max(0, target - now);
      
      setTimeLeft({
        dd: Math.floor(diff / 86400000),
        hh: Math.floor((diff % 86400000) / 3600000),
        mm: Math.floor((diff % 3600000) / 60000),
        ss: Math.floor((diff % 60000) / 1000),
      });
    };
    
    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  
  return timeLeft;
};
