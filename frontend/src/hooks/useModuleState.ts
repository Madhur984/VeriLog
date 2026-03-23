import { useState, useCallback } from 'react';

export type ModuleStage = 'init' | 'explore' | 'interact' | 'understand' | 'apply' | 'complete';

export interface ModuleState {
  stage: ModuleStage;
  progress: number;
  completedScreens: string[];
  interactions: Record<string, any>;
  labCompleted: boolean;
  assignmentPassed: boolean;
}

export const useModuleState = (screenIds: string[]) => {
  const [state, setState] = useState<ModuleState>({
    stage: 'init',
    progress: 0,
    completedScreens: [],
    interactions: {},
    labCompleted: false,
    assignmentPassed: false
  });

  const updateInteraction = useCallback((screenId: string, data: any) => {
    setState(prev => {
      const newInteractions = { ...prev.interactions, [screenId]: data };
      const newCompleted = prev.completedScreens.includes(screenId) 
        ? prev.completedScreens 
        : [...prev.completedScreens, screenId];
      
      const progress = newCompleted.length / screenIds.length;
      
      // Determine stage
      let stage = prev.stage;
      if (progress >= 1) stage = 'complete';
      else if (newCompleted.includes('signal_assignment')) stage = 'apply';
      else if (newCompleted.includes('embedded_lab')) stage = 'understand';
      else if (newCompleted.length > 3) stage = 'interact';
      else if (newCompleted.length > 0) stage = 'explore';

      return {
        ...prev,
        stage,
        progress,
        completedScreens: newCompleted,
        interactions: newInteractions,
        labCompleted: newCompleted.includes('embedded_lab'),
        assignmentPassed: newCompleted.includes('signal_assignment')
      };
    });
  }, [screenIds.length]);

  const isScreenLocked = useCallback((index: number) => {
    // Logic: First screen is never locked. 
    // Subsequent screens are locked until the previous one is completed.
    if (index === 0) return false;
    const prevScreenId = screenIds[index - 1];
    return !state.completedScreens.includes(prevScreenId);
  }, [screenIds, state.completedScreens]);

  return {
    ...state,
    updateInteraction,
    isScreenLocked
  };
};
