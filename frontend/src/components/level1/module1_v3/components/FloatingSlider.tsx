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
  const id  = useId();
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col group relative w-full mb-5">
      {/* Label + live value */}
      <div className="flex justify-between items-end px-1 mb-2">
        <label
          htmlFor={id}
          className="micro-text group-hover:opacity-80 transition-opacity"
        >
          {label}
        </label>
        <span
          className="micro-text tabular-nums opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: 'var(--accent-orange)' }}
        >
          {value.toFixed(2)}{unit || ''}
        </span>
      </div>

      {/* Custom track */}
      <div
        className="relative w-full"
        style={{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '1px' }}
      >
        {/* Orange fill */}
        <motion.div
          style={{ background: 'var(--accent-orange)', height: '100%', borderRadius: '1px' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Orange handle dot */}
        <motion.div
          style={{
            position:  'absolute',
            top:       '50%',
            width:     '8px',
            height:    '8px',
            borderRadius: '50%',
            background: 'var(--accent-orange)',
            boxShadow:  'var(--glow-orange)',
            transform:  'translateY(-50%)',
          }}
          animate={{ left: `calc(${pct}% - 4px)` }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Invisible native input for interaction */}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute cursor-ew-resize"
          style={{
            inset:   0,
            opacity: 0,
            width:   '100%',
            height:  '20px',
            top:     '-9px',
            margin:  0,
            padding: 0,
          }}
        />
      </div>
    </div>
  );
};
