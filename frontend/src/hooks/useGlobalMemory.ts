import { useState, useCallback, useEffect } from 'react';

export interface GlobalMemoryState {
  userSignal: {
    type: 'analog' | 'digital' | null;
    amplitude: number;
    frequency: number;
    phase: number;
    samplingRate: number;
    noise: number;
    isHarmonized: boolean;
  };
  signalB: {
    amplitude: number;
    frequency: number;
    phase: number;
    samplingRate: number;
    noise: number;
  };
  comparisonMode: boolean;
  summingMode: boolean;
  fftMode: boolean;
  // Communication System Simulator
  messageSignal: {
    amplitude: number;
    frequency: number;
    phase: number;
    type: string;
  };
  carrierSignal: {
    amplitude: number;
    frequency: number;
    phase: number;
    type: string;
  };
  modulation: {
    depth: number;
    enabled: boolean;
  };
  interference: {
    intensity: number;
    type: 'gaussian' | 'burst' | 'emi';
  };
  cognitive: {
    interactionStartTime: number;
    understandingScore: number;
    speedIndex: number;
  };
  achievements: string[];
  performanceScore: number;
  totalMistakes: number;
  lastInteraction: number;
}

const MEMORY_KEY = 'verilog_module1_memory';

export const useGlobalMemory = () => {
  const [memory, setMemory] = useState<GlobalMemoryState>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(MEMORY_KEY);
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load memory:", e);
    }
    return {
      userSignal: {
        type: null,
        amplitude: 0.5,
        frequency: 2,
        phase: 0,
        samplingRate: 20,
        noise: 0,
        isHarmonized: false
      },
      signalB: {
        amplitude: 0.5,
        frequency: 4,
        phase: 0,
        samplingRate: 20,
        noise: 0
      },
      comparisonMode: false,
      summingMode: false,
      fftMode: false,
      messageSignal: {
        amplitude: 0.4,
        frequency: 2,
        phase: 0,
        type: 'sine'
      },
      carrierSignal: {
        amplitude: 0.8,
        frequency: 20,
        phase: 0,
        type: 'sine'
      },
      modulation: {
        depth: 0.5,
        enabled: false
      },
      interference: {
        intensity: 0,
        type: 'gaussian'
      },
      cognitive: {
        interactionStartTime: Date.now(),
        understandingScore: 0,
        speedIndex: 0
      },
      achievements: [],
      performanceScore: 0,
      totalMistakes: 0,
      lastInteraction: Date.now()
    };
  });

  useEffect(() => {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  }, [memory]);

  const updateSignal = useCallback((updates: Partial<GlobalMemoryState['userSignal']>) => {
    setMemory(prev => ({
      ...prev,
      userSignal: { ...prev.userSignal, ...updates },
      lastInteraction: Date.now()
    }));
  }, []);

  const updateSignalB = useCallback((updates: Partial<GlobalMemoryState['signalB']>) => {
    setMemory(prev => ({
      ...prev,
      signalB: { ...prev.signalB, ...updates },
      lastInteraction: Date.now()
    }));
  }, []);

  const updateGlobalState = useCallback((updates: Partial<GlobalMemoryState>) => {
    setMemory(prev => ({
      ...prev,
      ...updates,
      lastInteraction: Date.now()
    }));
  }, []);

  const updateMessageSignal = useCallback((updates: Partial<GlobalMemoryState['messageSignal']>) => {
    setMemory(prev => ({
      ...prev,
      messageSignal: { ...prev.messageSignal, ...updates },
      lastInteraction: Date.now()
    }));
  }, []);

  const updateCarrierSignal = useCallback((updates: Partial<GlobalMemoryState['carrierSignal']>) => {
    setMemory(prev => ({
      ...prev,
      carrierSignal: { ...prev.carrierSignal, ...updates },
      lastInteraction: Date.now()
    }));
  }, []);

  const updateModulation = useCallback((updates: Partial<GlobalMemoryState['modulation']>) => {
    setMemory(prev => ({
      ...prev,
      modulation: { ...prev.modulation, ...updates },
      lastInteraction: Date.now()
    }));
  }, []);

  const updateInterference = useCallback((updates: Partial<GlobalMemoryState['interference']>) => {
    setMemory(prev => ({
      ...prev,
      interference: { ...prev.interference, ...updates },
      lastInteraction: Date.now()
    }));
  }, []);

  const addAchievement = useCallback((achievement: string) => {
    setMemory(prev => {
      if (prev.achievements.includes(achievement)) return prev;
      return {
        ...prev,
        achievements: [...prev.achievements, achievement],
        lastInteraction: Date.now()
      };
    });
  }, []);

  const clearMemory = useCallback(() => {
    localStorage.removeItem(MEMORY_KEY);
    setMemory({
      userSignal: {
        type: null,
        amplitude: 0.5,
        frequency: 2,
        phase: 0,
        samplingRate: 20,
        noise: 0,
        isHarmonized: false
      },
      signalB: {
        amplitude: 0.5,
        frequency: 4,
        phase: 0,
        samplingRate: 20,
        noise: 0
      },
      comparisonMode: false,
      summingMode: false,
      fftMode: false,
      messageSignal: {
        amplitude: 0.4,
        frequency: 2,
        phase: 0,
        type: 'sine'
      },
      carrierSignal: {
        amplitude: 0.8,
        frequency: 20,
        phase: 0,
        type: 'sine'
      },
      modulation: {
        depth: 0.5,
        enabled: false
      },
      interference: {
        intensity: 0,
        type: 'gaussian'
      },
      cognitive: {
        interactionStartTime: Date.now(),
        understandingScore: 0,
        speedIndex: 0
      },
      achievements: [],
      performanceScore: 0,
      totalMistakes: 0,
      lastInteraction: Date.now()
    });
  }, []);

  return {
    memory,
    updateSignal,
    updateSignalB,
    updateGlobalState,
    updateMessageSignal,
    updateCarrierSignal,
    updateModulation,
    updateInterference,
    addAchievement,
    clearMemory
  };
};
