import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GatePreview } from '../../components/GatePreview';
import { LANDING_ROUTES } from './landingRoutes';

export const WhatIsSection = () => {
  return (
    <section id="what-is-section" className="w-full bg-[#0B0F19] border-b border-slate-900" aria-label="Interactive digital design analysis">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Academic Gap Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-6 space-y-6"
          >
            <span className="text-xs font-mono text-[#22D3EE] uppercase tracking-widest block">
              // ANALYTICAL LOGIC PLAYGROUND
            </span>
            <h2 
              className="font-bold text-slate-100 tracking-tight leading-[1.1] uppercase"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Bridge the gap between math derivations and actual silicon.
            </h2>
            <div className="space-y-4 text-sm md:text-base text-slate-400 leading-relaxed max-w-[65ch]">
              <p>
                Traditional engineering curricula often leave students stuck in abstract whiteboard derivations, disconnected from the physical tools and systems used in the semiconductor industry. Real chip design demands tool fluency, hands-on RTL prototyping, and rigorous clock domain validation.
              </p>
              <p>
                BitForBytes closes this engineering gap by providing a visual, browser-based runtime workspace. Every module translates theoretical circuit math into simulated, interactive reality: toggle inputs, observe logic propagation times, and test structural synthesis rules in real time.
              </p>
              <p className="text-[12px] italic text-slate-500">
                Custom-built by ECE architects to establish practical engineering foundations.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Minimalist Gate Preview Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="md:col-span-6"
          >
            <div className="rounded-xl border border-slate-800 bg-[#090e1a] overflow-hidden p-1 shadow-xl">
              <GatePreview />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
