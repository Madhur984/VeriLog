// src/hooks/useCompass.ts
import { useState, useEffect } from 'react';
import { SILICON_ARCHETYPES } from '../utils/compassEngine';

export interface CompassResult {
  primary: string;
  secondary: string;
  tertiary: string;
  archetype: string;
  completedAt: string;
}

export const useCompass = () => {
  const [completed, setCompleted] = useState<boolean>(false);
  const [result, setResult] = useState<CompassResult | null>(null);

  useEffect(() => {
    const isCompleted = localStorage.getItem('bfb_compass_completed') === 'true';
    const savedResult = localStorage.getItem('bfb_compass_result');

    setCompleted(isCompleted);
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

  const saveResult = (primary: string, secondary: string, tertiary: string) => {
    const archetypeData = SILICON_ARCHETYPES[primary] || { name: 'THE ENGINEER', description: 'Problem solver at heart.' };
    
    const newResult: CompassResult = {
      primary,
      secondary,
      tertiary,
      archetype: archetypeData.name,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem('bfb_compass_result', JSON.stringify(newResult));
    localStorage.setItem('bfb_compass_completed', 'true');
    
    setResult(newResult);
    setCompleted(true);
    
    // Trigger page-wide update if needed
    window.dispatchEvent(new Event('compass_updated'));
  };

  const recalibrate = () => {
    localStorage.removeItem('bfb_compass_completed');
    localStorage.removeItem('bfb_compass_result');
    setCompleted(false);
    setResult(null);
  };

  const skipCompass = () => {
    localStorage.setItem('bfb_compass_completed', 'true');
    setCompleted(true);
  };

  return {
    completed,
    result,
    saveResult,
    recalibrate,
    skipCompass
  };
};
