import { useState, useEffect, useCallback } from 'react';

interface SignalParams {
  amplitude: number;
  frequency: number;
  phase?: number;
  noise?: number;
  bitDepth?: number;
  samplingRate?: number;
}

interface ChallengeProps {
  userSignal: SignalParams;
  targetSignal: SignalParams | null;
  tolerance?: number;
}

export const useChallengeEngine = ({ userSignal, targetSignal, tolerance = 0.05 }: ChallengeProps) => {
  const [score, setScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorDistance, setErrorDistance] = useState(1);

  const calculateError = useCallback(() => {
    if (!targetSignal) return 1;

    const diffAmp = Math.abs(userSignal.amplitude - targetSignal.amplitude);
    const diffFreq = Math.abs(userSignal.frequency - targetSignal.frequency) / 10;
    const diffNoise = Math.abs((userSignal.noise || 0) - (targetSignal.noise || 0));
    
    // Normalized distance
    const dist = (diffAmp * 0.4) + (diffFreq * 0.4) + (diffNoise * 0.2);
    return dist;
  }, [userSignal, targetSignal]);

  useEffect(() => {
    if (!targetSignal) {
      setScore(0);
      setIsSuccess(false);
      return;
    }

    const dist = calculateError();
    setErrorDistance(dist);
    
    // Convert to percentage (1 - dist)
    const newScore = Math.max(0, Math.floor((1 - dist) * 100));
    setScore(newScore);

    if (dist < tolerance) {
      if (!isSuccess) setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
  }, [userSignal, targetSignal, calculateError, tolerance, isSuccess]);

  return {
    score,
    isSuccess,
    errorDistance,
    isMatching: score > 90
  };
};
