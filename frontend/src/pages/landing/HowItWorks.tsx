import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const HowItWorks = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Step 2 Visual: Oscilloscope Animation Loop
  const [scopePhase, setScopePhase] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setScopePhase(p => (p + 1) % 60);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Step 1 Visual: Toggle switch simulation
  const [toggleState, setToggleState] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setToggleState(s => !s);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Step 3 Visual: Node network loading simulation
  const [progressVal, setProgressVal] = useState(20);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressVal(p => (p >= 100 ? 20 : p + 20));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const headlineContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.4 }
    }
  };

  const itemFade = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto w-full select-none">
      <div className="space-y-20">
        {/* Section Header */}
        <div className="space-y-6 text-center">
          <span
            className="text-[10px] font-mono tracking-widest uppercase block"
            style={{ color: '#475569' }}
          >
            THE METHOD
          </span>

          {/* Sequential Headline Reveal */}
          <motion.div
            variants={headlineContainer}
            initial="hidden"
            animate={controls}
            className="flex flex-col items-center gap-1.5 font-sans"
          >
            <motion.h3 variants={itemFade} className="text-xl md:text-2xl font-bold text-[#475569]/40 italic">
              Not passive.
            </motion.h3>
            <motion.h3 variants={itemFade} className="text-2xl md:text-3xl font-bold text-[#475569]/70 italic">
              Not passive.
            </motion.h3>
            <motion.h3 variants={itemFade} className="text-3xl md:text-4xl font-bold text-[#475569] italic">
              Not passive.
            </motion.h3>
            <motion.h2
              variants={itemFade}
              className="text-4xl md:text-5xl font-black uppercase text-white mt-4 tracking-tight"
            >
              You learn by doing.
            </motion.h2>
          </motion.div>
        </div>

        {/* Steps container */}
        <div className="relative">
          {/* Connecting line (Drawn on scroll) */}
          <div className="absolute top-[80px] left-[15%] right-[15%] h-[2px] hidden md:block pointer-events-none" style={{ zIndex: 0 }}>
            <svg className="w-full h-full" viewBox="0 0 100 2" preserveAspectRatio="none">
              <motion.line
                x1="0"
                y1="1"
                x2="100"
                y2="1"
                stroke="rgba(148,163,184,0.12)"
                strokeWidth="2"
                strokeDasharray="4, 4"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </svg>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {/* Step 1 */}
            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { delay: 1.0, duration: 0.8 } }
              }}
              className="flex flex-col items-center text-center space-y-6"
            >
              {/* Step Number */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-mono font-bold text-lg border relative"
                style={{
                  background: '#0D0F12',
                  borderColor: 'rgba(34,211,238,0.2)',
                  color: '#22D3EE',
                  boxShadow: '0 0 15px rgba(34,211,238,0.05)',
                }}
              >
                01
              </div>

              {/* Visual Demo (Switch toggle) */}
              <div className="h-20 flex items-center justify-center w-full">
                <div
                  className="w-14 h-7 rounded-full p-0.5 flex items-center transition-all duration-300"
                  style={{
                    background: toggleState ? '#22D3EE' : 'rgba(148,163,184,0.10)',
                    border: `1px solid ${toggleState ? '#22D3EE' : 'rgba(148,163,184,0.2)'}`,
                  }}
                >
                  <motion.div
                    animate={{ x: toggleState ? 28 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="w-6 h-6 rounded-full bg-white shadow-md"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold font-mono tracking-wider text-white uppercase">
                  INTERACT
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed px-2">
                  Every concept starts with an interaction. You toggle a bit. You drag a gate. You change a value. Understanding follows action.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { delay: 1.3, duration: 0.8 } }
              }}
              className="flex flex-col items-center text-center space-y-6"
            >
              {/* Step Number */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-mono font-bold text-lg border"
                style={{
                  background: '#0D0F12',
                  borderColor: 'rgba(245,158,11,0.2)',
                  color: '#F59E0B',
                  boxShadow: '0 0 15px rgba(245,158,11,0.05)',
                }}
              >
                02
              </div>

              {/* Visual Demo (Waveform oscilloscope) */}
              <div className="h-20 flex items-center justify-center w-full px-8">
                <svg width="100" height="40" viewBox="0 0 100 40" className="border border-white/5 bg-black/40 rounded">
                  {/* Grid lines */}
                  <line x1="50" y1="0" x2="50" y2="40" stroke="rgba(255,255,255,0.03)" />
                  <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.03)" />
                  {/* Sine path */}
                  <path
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    d={Array.from({ length: 40 }, (_, idx) => {
                      const x = (idx / 40) * 100;
                      const y = 20 + 10 * Math.sin((idx / 40) * 2 * Math.PI * 2 + scopePhase * 0.1);
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold font-mono tracking-wider text-white uppercase">
                  SEE
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed px-2">
                  The system responds visually in real time. Signals light up. Circuits change. Truth tables highlight. You see exactly what happens and why.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { delay: 1.6, duration: 0.8 } }
              }}
              className="flex flex-col items-center text-center space-y-6"
            >
              {/* Step Number */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-mono font-bold text-lg border"
                style={{
                  background: '#0D0F12',
                  borderColor: 'rgba(16,185,129,0.2)',
                  color: '#10B981',
                  boxShadow: '0 0 15px rgba(16,185,129,0.05)',
                }}
              >
                03
              </div>

              {/* Visual Demo (Filling progress bar + node list) */}
              <div className="h-20 flex flex-col justify-center items-center w-full px-10 gap-2">
                <div className="flex justify-between w-full text-[9px] font-mono text-slate-500 uppercase">
                  <span>METAMORPHIC NODES</span>
                  <span className="text-[#10B981]">{progressVal}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${progressVal}%`,
                      background: 'linear-gradient(to right, #10B981, #34d399)',
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold font-mono tracking-wider text-white uppercase">
                  BUILD
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed px-2">
                  By the end of each module, you've built a mental model — not memorized a formula. That model follows you into every exam, interview, and design problem.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
