import { HapticType, SoundType } from '../../../hooks/useGlobalSensory';

export interface ScreenProps {
  onNext: () => void;
  triggerHaptic: (type: HapticType) => void;
  playSound: (type: SoundType) => void;
  isIdle?: boolean;
  onInteractionComplete?: (data?: any) => void;
  isLocked?: boolean;
  currentHint?: any;
  trackMistake?: () => void;
  updateSignal?: (updates: any) => void;
  updateSignalB?: (updates: any) => void;
  updateGlobalState?: (updates: any) => void;
  memory?: {
    userSignal?: any;
    signalB?: any;
    activeMission?: boolean;
    performanceScore?: number;
    totalMistakes?: number;
    comparisonMode?: boolean;
    summingMode?: boolean;
    fftMode?: boolean;
  };
}
