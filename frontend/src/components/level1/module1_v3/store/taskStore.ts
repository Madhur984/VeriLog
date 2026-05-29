import { create } from 'zustand';
import { useSignalStore } from './signalStore';
import { audioEngine } from '../engine/audioEngine';

type TaskState = {
  currentTask: number;
  taskCompleted: boolean;
  failCount: number;

  // live evaluation
  isValid: boolean;

  // actions
  setTask: (id: number) => void;
  evaluate: () => void;
  completeTask: () => void;
};

export const useTaskStore = create<TaskState>((set, get) => ({
  currentTask: 0,
  taskCompleted: false,
  failCount: 0,
  isValid: false,

  setTask: (id) => set({ currentTask: id, taskCompleted: false, isValid: false }),

  evaluate: () => {
    const { amplitude, frequency, noise } = useSignalStore.getState();
    const { currentTask, taskCompleted, isValid } = get();

    if (taskCompleted || currentTask === 0) return;

    let valid = false;

    switch (currentTask) {
      case 1: // CONTROL
        valid = amplitude > 0.4 && amplitude < 0.7 && noise < 0.05;
        break;
      case 2: // DENSITY
        valid = frequency > 2.4 && noise < 0.15;
        break;
      case 3: // NOISE
        valid = noise > 0.6 && amplitude > 0.5;
        break;
      case 4: // CLARITY
        valid = noise < 0.02 && amplitude > 0.45;
        break;
      case 5: // MASTERY
        const aOpt = amplitude > 0.55 && amplitude < 0.65;
        const fOpt = frequency > 1.4 && frequency < 1.6;
        const stability = (1 - noise) * 0.5 + (aOpt ? 0.25 : 0) + (fOpt ? 0.25 : 0);
        valid = stability > 0.92;
        break;
    }

    if (valid && !isValid) {
      set({ isValid: true });
      audioEngine.snap();
      
      // Auto-advance after 1.5s
      setTimeout(() => {
        get().completeTask();
      }, 1500);
    } else if (!valid && isValid) {
      set({ isValid: false });
    }
  },

  completeTask: () => {
    const { currentTask } = get();
    set({
      currentTask: currentTask + 1,
      isValid: false,
      taskCompleted: false // Reset for next task
    });
  }
}));

