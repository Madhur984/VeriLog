import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { AudioEngine } from '../engine/audioEngine';

const audio = new AudioEngine();

interface Props {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

export const FloatingSlider: React.FC<Props> = ({
  label, value, min = 0, max = 1, step = 0.01, unit, onChange,
}) => {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    onChange(v);
    audio.slide((v - min) / (max - min));
  };

  return (
    <div className="flex flex-col v3-gap-2 group/slider">
      <div className="flex justify-between items-end">
        <label
          htmlFor={id}
          className="v3-small tracking-[0.25em] text-white/40 group-hover/slider:text-white/60 transition-colors"
        >
          {label}
        </label>
        <span className="v3-small text-[#00E5FF]">
          {value.toFixed(2)}{unit ? ` ${unit}` : ''}
        </span>
      </div>

      {/* Track */}
      <div className="relative h-px bg-white/10 w-full group-hover/slider:bg-white/20 transition-colors">
        {/* Fill */}
        <motion.div
          className="absolute left-0 top-0 h-full bg-[#00E5FF]"
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 28 }}
        />
        {/* Handle */}
        <motion.div
          className="absolute top-1/2 w-2 h-2 rounded-full bg-white border border-[#00E5FF]"
          style={{ left: `calc(${pct}% - 4px)`, top: '50%', transform: 'translateY(-50%)' }}
          animate={{ left: `calc(${pct}% - 4px)` }}
          transition={{ type: 'spring', stiffness: 200, damping: 28 }}
        />
      </div>

      {/* Invisible native input on top */}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onMouseDown={() => audio.tick()}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
        style={{ margin: 0 }}
      />
    </div>
  );
};
