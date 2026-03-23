import React from 'react';
import { useAudioSignalMap } from '../../../../hooks/useAudioSignalMap';

interface AudioEngineProps {
  signal: {
    amplitude: number;
    frequency: number;
    noise: number;
    bitDepth?: number;
  };
  enabled: boolean;
}

export const SignalAudioEngine: React.FC<AudioEngineProps> = ({ signal, enabled }) => {
  useAudioSignalMap({ ...signal, enabled });
  return null;
};
