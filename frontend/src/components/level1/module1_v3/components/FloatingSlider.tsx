import React, { useId } from 'react';
import { motion } from 'framer-motion';

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
  };

  return (
    <div className="flex flex-col v3-gap-1 group relative w-full mb-4">
      <div className="flex justify-between items-end px-1">
        <label
          htmlFor={id}
          className="v3-micro text-white/30 group-hover:text-white/60 transition-opacity"
        >
          {label}
        </label>
        <span className="v3-micro text-white/50 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
          {value.toFixed(2)}{unit || ''}
        </span>
      </div>

      {/* Thin Precision Track */}
      <div className="relative h-px w-full bg-white/10 group-hover:bg-white/20 transition-colors mt-1">
        {/* Fill Layer - Active Range */}
        <motion.div
          className="absolute left-0 top-0 h-full bg-[#E6F9FF]"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Precision Handle - Scalar Dot */}
        <motion.div
           className="absolute top-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"
           style={{ left: `calc(${pct}% - 3px)`, top: '50%', transform: 'translateY(-50%)' }}
           animate={{ left: `calc(${pct}% - 3px)` }}
           transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Interaction Zone - Invisible native input */}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-[12px] -top-2"
          style={{ margin: 0 }}
        />
      </div>
    </div>
  );
};
