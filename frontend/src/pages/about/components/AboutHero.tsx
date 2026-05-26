import React from 'react';
import { motion } from 'framer-motion';

export const AboutHero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden bg-observatory-bg">
      {/* Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none" />

      {/* PCB Dot Grid Overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-[0.015] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 flex flex-col items-center">
        {/* Top ECE Badge */}
        <div className="mb-8 px-4 py-2 border border-slate-500/10 bg-slate-900/30 rounded-full">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            BUILT BY AN ECE STUDENT // FOR ECE STUDENTS
          </span>
        </div>

        {/* Headline with Staggered Lines */}
        <h1 className="text-5xl md:text-[80px] font-extrabold tracking-tighter leading-[0.95] mb-12 select-none">
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="block text-white"
          >
            We know why
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="block text-white"
          >
            you're here.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="block text-cyan-400"
          >
            You didn't plan to be.
          </motion.span>
        </h1>

        {/* Subtext Paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6 max-w-2xl text-center"
        >
          <p className="text-slate-400 font-sans text-base md:text-lg leading-relaxed">
            Most ECE students in India are here because CS cutoffs were too high,
            or a branch change didn't go as planned. Very few chose it knowing
            what it actually means.
          </p>
          <p className="text-slate-400 font-sans text-base md:text-lg leading-relaxed">
            And those who did choose it — most still don't know what VLSI,
            Verilog, or RTL design means by their third year.
            That's not your fault. That's a gap we're here to close.
          </p>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-1.5 h-6 bg-slate-700/50 rounded-full relative flex justify-center"
        >
          <span className="w-1 h-2 bg-cyan-400 rounded-full mt-1 animate-bounce" />
        </motion.div>
        <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
          SCROLL TO READ OUR STORY
        </span>
      </div>
    </section>
  );
};
