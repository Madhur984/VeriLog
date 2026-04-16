import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  size?: number | string;
}

export const GateAND: React.FC<IconProps> = ({ size = 48, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M 16 14 L 32 14 A 18 18 0 0 1 32 50 L 16 50 Z" />
    <line x1="0" y1="22" x2="16" y2="22" />
    <line x1="0" y1="42" x2="16" y2="42" />
    <line x1="50" y1="32" x2="64" y2="32" />
  </svg>
);

export const GateOR: React.FC<IconProps> = ({ size = 48, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M 14 14 Q 30 14 48 32 Q 30 50 14 50 Q 24 32 14 14" />
    <line x1="0" y1="22" x2="17" y2="22" />
    <line x1="0" y1="42" x2="17" y2="42" />
    <line x1="48" y1="32" x2="64" y2="32" />
  </svg>
);

export const GateNOT: React.FC<IconProps> = ({ size = 48, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M 18 16 L 42 32 L 18 48 Z" />
    <circle cx="48" cy="32" r="5" />
    <line x1="0" y1="32" x2="18" y2="32" />
    <line x1="53" y1="32" x2="64" y2="32" />
  </svg>
);

export const GateNAND: React.FC<IconProps> = ({ size = 48, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M 16 14 L 28 14 A 18 18 0 0 1 28 50 L 16 50 Z" />
    <circle cx="51" cy="32" r="5" />
    <line x1="0" y1="22" x2="16" y2="22" />
    <line x1="0" y1="42" x2="16" y2="42" />
    <line x1="56" y1="32" x2="64" y2="32" />
  </svg>
);

export const GateNOR: React.FC<IconProps> = ({ size = 48, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M 14 14 Q 28 14 43 32 Q 28 50 14 50 Q 24 32 14 14" />
    <circle cx="48" cy="32" r="5" />
    <line x1="0" y1="22" x2="17" y2="22" />
    <line x1="0" y1="42" x2="17" y2="42" />
    <line x1="53" y1="32" x2="64" y2="32" />
  </svg>
);

export const GateXOR: React.FC<IconProps> = ({ size = 48, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M 17 14 Q 33 14 51 32 Q 33 50 17 50 Q 27 32 17 14" />
    <path d="M 11 14 Q 21 32 11 50" />
    <line x1="0" y1="22" x2="15" y2="22" />
    <line x1="0" y1="42" x2="15" y2="42" />
    <line x1="51" y1="32" x2="64" y2="32" />
  </svg>
);

export const GateXNOR: React.FC<IconProps> = ({ size = 48, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M 17 14 Q 31 14 45 32 Q 31 50 17 50 Q 27 32 17 14" />
    <path d="M 11 14 Q 21 32 11 50" />
    <circle cx="50" cy="32" r="5" />
    <line x1="0" y1="22" x2="15" y2="22" />
    <line x1="0" y1="42" x2="15" y2="42" />
    <line x1="55" y1="32" x2="64" y2="32" />
  </svg>
);

export const GateBUFFER: React.FC<IconProps> = ({ size = 48, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M 18 16 L 48 32 L 18 48 Z" />
    <line x1="0" y1="32" x2="18" y2="32" />
    <line x1="48" y1="32" x2="64" y2="32" />
  </svg>
);


export const getGateIcon = (gateId: string, size: number = 48, color: string = 'currentColor') => {
  switch (gateId) {
    case 'AND': return <GateAND size={size} color={color} />;
    case 'OR': return <GateOR size={size} color={color} />;
    case 'NOT': return <GateNOT size={size} color={color} />;
    case 'NAND': return <GateNAND size={size} color={color} />;
    case 'NOR': return <GateNOR size={size} color={color} />;
    case 'XOR': return <GateXOR size={size} color={color} />;
    case 'XNOR': return <GateXNOR size={size} color={color} />;
    case 'BUFFER': return <GateBUFFER size={size} color={color} />;
    default: return <div style={{width: size, height: size}} className="border rounded bg-slate-200" />;
  }
};
