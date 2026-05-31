import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Github } from 'lucide-react';
import { MagneticButton } from '../../../components/MagneticButton';

export const AboutCTA: React.FC = () => {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center py-24 px-6 sm:px-12 bg-bg-elev border-t border-border-soft">
      {/* Subtle Horizontal Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-signal-core/[0.01] via-transparent to-signal-core/[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10 w-full">
        {/* Header Content */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter uppercase leading-[0.95] text-text-main">
            This is still early.<br />
            <span className="text-signal-core">What engineers do - we build.</span>
          </h2>
          <p className="text-text-sub font-sans text-xs md:text-sm leading-relaxed max-w-xl mx-auto pt-4">
            BitforBytes is built by four students - one idea, one execution,
            and two people who showed up and gave everything they had.
            It is not perfect. It is growing. Every student who learns
            here makes the case that this gap is real and worth closing.
            Every line of feedback builds the next module.
            We are doing what engineers do. We are building.
          </p>
        </div>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 - Students */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-void border border-border-soft rounded-xl p-8 flex flex-col justify-between hover:border-signal-core/30 transition-all group"
          >
            <div className="space-y-4">
              <div className="p-3 bg-signal-core/5 border border-signal-core/20 text-signal-core rounded-lg w-fit group-hover:bg-signal-core/10 transition-colors">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-text-main uppercase font-sans">
                Start Learning
              </h3>
              <p className="text-text-sub text-xs md:text-sm leading-relaxed font-sans">
                No signup. No payment. Start the first scrollytelling foundation module right now.
              </p>
            </div>
            <div className="pt-8">
              <MagneticButton className="w-full">
                <Link
                  to="/portal"
                  className="w-full text-center py-3 bg-signal-core text-white font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:bg-opacity-90 transition-all inline-block"
                >
                  OPEN FIRST MODULE →
                </Link>
              </MagneticButton>
            </div>
          </motion.div>

          {/* Card 2 - Professionals */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-bg-void border border-border-soft rounded-xl p-8 flex flex-col justify-between hover:border-accent-orange/30 transition-all group"
          >
            <div className="space-y-4">
              <div className="p-3 bg-amber-400/5 border border-amber-400/20 text-amber-400 rounded-lg w-fit group-hover:bg-amber-400/10 transition-colors">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-text-main uppercase font-sans">
                Mentor a Student
              </h3>
              <p className="text-text-sub text-xs md:text-sm leading-relaxed font-sans">
                30 minutes a month. A senior's perspective changes everything for a confused junior.
              </p>
            </div>
            <div className="pt-8">
              <MagneticButton className="w-full">
                <a
                  href="mailto:mentor@bitforbytes.org?subject=BitforBytes Mentor Waitlist"
                  className="w-full text-center py-3 border border-amber-400 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:bg-amber-400/10 transition-all inline-block"
                >
                  JOIN MENTOR WAITLIST →
                </a>
              </MagneticButton>
            </div>
          </motion.div>

          {/* Card 3 - Contributors */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-bg-void border border-border-soft rounded-xl p-8 flex flex-col justify-between hover:border-text-dim transition-all group"
          >
            <div className="space-y-4">
              <div className="p-3 bg-bg-base/60 border border-border-soft text-text-main rounded-lg w-fit group-hover:bg-bg-base transition-colors">
                <Github size={24} />
              </div>
              <h3 className="text-lg font-bold text-text-main uppercase font-sans">
                Help Build This
              </h3>
              <p className="text-text-sub text-xs md:text-sm leading-relaxed font-sans">
                Open source. Every single contribution - code, content, or industry data - is credited.
              </p>
            </div>
            <div className="pt-8">
              <MagneticButton className="w-full">
                <a
                  href="https://github.com/kriten370/VeriLog_k1"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-3 border border-border-soft text-text-sub hover:text-text-main font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:bg-bg-base transition-all inline-block"
                >
                  VIEW ON GITHUB →
                </a>
              </MagneticButton>
            </div>
          </motion.div>
        </div>

        {/* Final Line */}
        <div className="text-center pt-8 border-t border-border-soft mt-12">
          <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest">
            Made with intent, not investment. Four students. One gap. No plan B.
          </span>
        </div>
      </div>
    </section>
  );
};
