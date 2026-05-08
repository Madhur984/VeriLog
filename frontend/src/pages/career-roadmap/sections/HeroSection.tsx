import React from 'react';
import { motion } from 'framer-motion';
import { useMouseParallax } from '../../../hooks/useMouseParallax';
import { useMagneticButton } from '../../../hooks/useMagneticButton';
import { CareerWeather } from '../../../components/CareerWeather';
import { MissionClock } from '../../../components/MissionClock';
import { BiometricCalibration } from '../../../components/BiometricCalibration';

interface HeroSectionProps {
  onCalibrate?: (points: number) => void;
  onExplore?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCalibrate, onExplore }) => {
  const { x, y } = useMouseParallax();
  const primaryCTA = useMagneticButton(0.3);

  const stats = [
    { label: 'Domains', value: 13 },
    { label: '₹8–50 LPA', value: 0, isCurrency: true },
    { label: 'Companies', value: 10 },
    { label: 'Questions', value: 30 },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-24 overflow-hidden bg-observatory-bg">
      {/* Silicon Parallax Layers */}
      <motion.div 
        style={{ x: x * 4, y: y * 4 }}
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
      >
        <div className="absolute inset-0 bg-dot-grid" />
      </motion.div>
      
      <motion.div 
        style={{ x: x * 8, y: y * 8 }}
        className="absolute inset-0 opacity-[0.01] pointer-events-none"
      >
        <div className="absolute inset-0 bg-ghost-traces" />
      </motion.div>

      {/* Gentle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-[110px] font-bold tracking-tighter leading-[0.85] mb-8"
        >
          <span className="text-white">SILICON</span><br />
          <span className="text-cyan-400">OBSERVATORY</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          The industrial-grade intelligence platform for the modern ECE engineer.
          Calibrate your trajectory. Master the silicon stack.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 relative z-20"
        >
          <button
            ref={primaryCTA.ref as any}
            onMouseMove={primaryCTA.onMouseMove}
            onMouseLeave={primaryCTA.onMouseLeave}
            onClick={() => onCalibrate?.(50)}
            className="px-10 py-5 bg-cyan-400 text-observatory-bg font-mono text-xs font-bold uppercase tracking-widest rounded-full shadow-observatory-glow hover:brightness-110 transition-all cursor-pointer pointer-events-auto"
          >
            Begin Calibration
          </button>
          <button 
            onClick={onExplore}
            className="px-10 py-5 border border-white/10 text-slate-400 font-mono text-xs uppercase tracking-widest rounded-full hover:border-cyan-400/30 hover:text-white transition-all cursor-pointer pointer-events-auto"
          >
            Explore Domains
          </button>
        </motion.div>

        {/* Stats Row */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-12">
          {stats.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.isCurrency ? '₹8–50 LPA' : stat.value}
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden md:block w-px h-8 bg-white/10" />
              )}
            </React.Fragment>
          ))}
        </div>

        <CareerWeather />
      </div>

      {/* Secondary Panels (Calibration + Clock) */}
      <div className="relative z-10 mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full px-6">
        <BiometricCalibration />
        <MissionClock />
      </div>
    </section>
  );
};
