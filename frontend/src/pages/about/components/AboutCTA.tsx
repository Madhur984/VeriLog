import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Github } from 'lucide-react';

export const AboutCTA: React.FC = () => {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center py-24 px-6 sm:px-12 bg-[#0D0F12] border-t border-white/[0.04]">
      {/* Subtle Horizontal Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/[0.01] via-transparent to-cyan-400/[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10 w-full">
        {/* Header Content */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter uppercase leading-[0.95] text-white">
            This is still early.<br />
            <span className="text-slate-400">We're building as we go.</span>
          </h2>
          <p className="text-slate-400 font-sans text-xs md:text-sm leading-relaxed max-w-xl mx-auto pt-4">
            AXE-OR is built by one ECE student, for all ECE students. It is not perfect. 
            It is growing. Every piece of feedback makes the next module better. 
            Every student who learns here makes the case that this gap is real and worth closing.
          </p>
        </div>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 - Students */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#07080A] border border-white/[0.08] rounded-xl p-8 flex flex-col justify-between hover:border-cyan-400/30 transition-all group"
          >
            <div className="space-y-4">
              <div className="p-3 bg-cyan-400/5 border border-cyan-400/20 text-cyan-400 rounded-lg w-fit group-hover:bg-cyan-400/10 transition-colors">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-white uppercase font-sans">
                Start Learning
              </h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-sans">
                No signup. No payment. Start the first scrollytelling foundation module right now.
              </p>
            </div>
            <div className="pt-8">
              <Link
                to="/portal"
                className="w-full text-center py-3 bg-cyan-400 text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:bg-white transition-all inline-block"
              >
                OPEN FIRST MODULE →
              </Link>
            </div>
          </motion.div>

          {/* Card 2 - Professionals */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#07080A] border border-white/[0.08] rounded-xl p-8 flex flex-col justify-between hover:border-amber-400/30 transition-all group"
          >
            <div className="space-y-4">
              <div className="p-3 bg-amber-400/5 border border-amber-400/20 text-amber-400 rounded-lg w-fit group-hover:bg-amber-400/10 transition-colors">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-white uppercase font-sans">
                Mentor a Student
              </h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-sans">
                30 minutes a month. A senior's perspective changes everything for a confused junior.
              </p>
            </div>
            <div className="pt-8">
              <a
                href="mailto:mentor@axe-or.org?subject=AXE-OR Mentor Waitlist"
                className="w-full text-center py-3 border border-amber-400 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:bg-amber-400/10 transition-all inline-block"
              >
                JOIN MENTOR WAITLIST →
              </a>
            </div>
          </motion.div>

          {/* Card 3 - Contributors */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#07080A] border border-white/[0.08] rounded-xl p-8 flex flex-col justify-between hover:border-white/20 transition-all group"
          >
            <div className="space-y-4">
              <div className="p-3 bg-white/5 border border-white/10 text-white rounded-lg w-fit group-hover:bg-white/10 transition-colors">
                <Github size={24} />
              </div>
              <h3 className="text-lg font-bold text-white uppercase font-sans">
                Help Build This
              </h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-sans">
                Open source. Every single contribution — code, content, or industry data — is credited.
              </p>
            </div>
            <div className="pt-8">
              <a
                href="https://github.com/kriten370/VeriLog_k1"
                target="_blank"
                rel="noreferrer"
                className="w-full text-center py-3 border border-white/20 text-slate-300 font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:bg-white/5 transition-all inline-block"
              >
                VIEW ON GITHUB →
              </a>
            </div>
          </motion.div>
        </div>

        {/* Final Line */}
        <div className="text-center pt-8 border-t border-white/[0.04] mt-12">
          <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
            Made with intent, not investment.
          </span>
        </div>
      </div>
    </section>
  );
};
