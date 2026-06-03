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
    { label: '₹8-50 LPA', value: 0, isCurrency: true },
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-signal-core/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-xs font-mono text-signal-core tracking-[0.3em] uppercase mb-4 sm:mb-6"
        >
          // CAREER.INTELLIGENCE.V1
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-[110px] font-bold tracking-tighter leading-[0.85] mb-6 sm:mb-8"
        >
          <span className="text-text-main">SILICON</span><br />
          <span className="text-signal-core">OBSERVATORY</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-text-sub max-w-2xl mx-auto leading-relaxed"
        >
          The industrial-grade intelligence platform for the modern ECE engineer.
          Calibrate your trajectory. Master the silicon stack.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-6 relative z-20 px-4 sm:px-0 mt-10 sm:mt-14 mb-16 sm:mb-20"
        >
          <button
            ref={primaryCTA.ref as any}
            onMouseMove={primaryCTA.onMouseMove}
            onMouseLeave={primaryCTA.onMouseLeave}
            onClick={() => onCalibrate?.(50)}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-signal-core text-bg-void font-mono text-xs font-bold uppercase tracking-widest rounded-full shadow-observatory-glow hover:brightness-110 transition-all cursor-pointer pointer-events-auto"
          >
            Begin Calibration
          </button>
          <button 
            onClick={onExplore}
            className="w-full sm:w-auto px-8 sm:px-6 py-4 sm:py-5 text-text-sub hover:text-text-main font-mono text-xs uppercase tracking-widest transition-all cursor-pointer pointer-events-auto flex items-center justify-center gap-2 group"
          >
            Explore Domains <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </button>
        </motion.div>

        {/* Stats Row */}
        <div className="mt-12 sm:mt-20 flex flex-wrap justify-center items-center gap-6 sm:gap-12">
          {stats.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div className="text-center">
                <div className="text-3xl font-bold text-text-main mb-1">
                  {stat.isCurrency ? '₹8-50 LPA' : stat.value}
                </div>
                <div className="text-[10px] font-mono text-text-dim uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden md:block w-px h-8 bg-border-soft" />
              )}
            </React.Fragment>
          ))}
        </div>

        <CareerWeather />
      </div>

      {/* Secondary Panels (Calibration + Clock) */}
      <div className="relative z-10 mt-12 sm:mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto w-full px-4 sm:px-6">
        <BiometricCalibration />
        <MissionClock />
      </div>
    </section>
  );
};
