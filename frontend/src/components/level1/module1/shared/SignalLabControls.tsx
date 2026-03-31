import React from 'react';
import { Play, Pause, Rewind, FastForward, Sliders, Music, Zap, Volume2 } from 'lucide-react';
import { VeriSlider } from '../../../shared/VeriSlider';
import { VeriButton } from '../../../shared/VeriButton';

interface LabControlsProps {
  onPreset: (type: string) => void;
  onTimeChange: (val: number) => void;
  onFreeze: (frozen: boolean) => void;
  isFrozen: boolean;
  time: number;
  className?: string;
}

export const SignalLabControls: React.FC<LabControlsProps> = ({
  onPreset,
  onTimeChange,
  onFreeze,
  isFrozen,
  time,
  className = ""
}) => {
  const presets = [
    { id: 'pure', label: 'Pure Tone', icon: Zap, color: 'text-[var(--accent-primary)]' },
    { id: 'aliased', label: 'Aliased', icon: Sliders, color: 'text-[var(--error)]' },
    { id: 'noisy', label: 'Noisy', icon: Music, color: 'text-slate-400' },
    { id: 'retro', label: '8-bit Retro', icon: Volume2, color: 'text-[var(--accent-secondary)]' }
  ];

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Presets Grid */}
      <div className="grid grid-cols-2 gap-2">
        {presets.map((p) => (
          <VeriButton
            key={p.id}
            size="sm"
            variant="secondary"
            onClick={() => onPreset(p.id)}
            className="flex items-center gap-2 !p-2 border-slate-200"
          >
            <p.icon size={10} className={`${p.color} transition-transform group-hover:scale-110`} />
            <span className="text-[8px] font-mono uppercase tracking-widest text-slate-600">{p.label}</span>
          </VeriButton>
        ))}
      </div>

      {/* Time Controls */}
      <div className="glass-card p-3 space-y-3 !bg-slate-50/50 border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">Time Domain</span>
          <VeriButton 
            size="sm"
            variant={isFrozen ? 'primary' : 'ghost'}
            onClick={() => onFreeze(!isFrozen)}
            className="!p-1 text-slate-600"
          >
            {isFrozen ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
          </VeriButton>
        </div>

        <div className="flex items-center gap-3">
          <VeriButton size="sm" variant="ghost" onClick={() => onTimeChange(Math.max(0, time - 0.1))} className="!p-1 text-slate-400">
            <Rewind size={12} />
          </VeriButton>
          
          <VeriSlider 
            min={0} max={10} step={0.01}
            value={time}
            onChange={onTimeChange}
            variant="signal"
            className="flex-1"
          />

          <VeriButton size="sm" variant="ghost" onClick={() => onTimeChange(Math.min(10, time + 0.1))} className="!p-1 text-slate-400">
            <FastForward size={12} />
          </VeriButton>
        </div>
        <div className="flex justify-between text-[7px] font-mono uppercase text-slate-400 font-bold">
            <span>0.00ms</span>
            <span className="text-slate-900">T:{time.toFixed(2)}s</span>
            <span>10.00ms</span>
        </div>
      </div>
    </div>
  );
};
