import { useState, useEffect, useMemo } from 'react';
import { useGlobalSensory } from './useGlobalSensory';

export type ModuleState = 'intro' | 'explore' | 'interact' | 'understand' | 'apply' | 'complete';

interface ModuleLogicProps {
  screens: string[];
  initialState?: ModuleState;
}

export const useModuleLogic = ({ screens, initialState = 'intro' }: ModuleLogicProps) => {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [state, setState] = useState<ModuleState>(initialState);
  const [progress, setProgress] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const { triggerHaptic, playSound } = useGlobalSensory();

  const activeScreenId = useMemo(() => screens[activeScreenIndex], [screens, activeScreenIndex]);

  // Idle detection: 2.5s
  useEffect(() => {
    let timer = setTimeout(() => {
      setIsIdle(true);
    }, 2500);

    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIsIdle(true), 2500);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [activeScreenIndex]);


  useEffect(() => {
    setProgress((activeScreenIndex + 1) / screens.length);
    
    // Simple state mapping based on progress (dummy logic for now, can be more complex)
    if (activeScreenIndex === 0) setState('intro');
    else if (activeScreenIndex < 3) setState('explore');
    else if (activeScreenIndex < 7) setState('interact');
    else if (activeScreenIndex < 9) setState('understand');
    else if (activeScreenIndex < screens.length - 1) setState('apply');
    else setState('complete');
  }, [activeScreenIndex, screens.length]);

  const calculateReadingTime = (text: string) => {
    const words = text.split(" ").length;
    return Math.max((words / 180) * 60000, 2500);
  };

  return {
    state,
    progress,
    activeScreenId,
    activeScreenIndex,
    setActiveScreenIndex,
    calculateReadingTime,
    triggerHaptic,
    playSound,
    isIdle
  };
};

export default useModuleLogic;
