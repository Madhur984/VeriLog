import React from 'react';

export const LandingVisuals: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary Matte Background Matrix */}
      <div className="absolute inset-0 bg-[#060813]" />

      {/* High-frequency Slate Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Concentrated Cyan Core Glow (Left Hero Side) */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/[0.03] blur-[120px] pointer-events-none" />

      {/* Logic Green Accent Glow (Right Workspace Side) */}
      <div className="absolute top-[20%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/[0.02] blur-[100px] pointer-events-none" />

      {/* Subtle Digital Wave Noise Line */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800/40 to-transparent" />
    </div>
  );
};
