import React from 'react';
import { motion } from 'framer-motion';
import { COMMITMENTS } from '../data/aboutData';
import { SectionWrapper } from '../../../components/SectionWrapper';
import { Unlock, School, Flag } from 'lucide-react';

const IconMap: Record<string, React.ComponentType<any>> = {
  Unlock,
  School,
  Flag,
};

export const TheMission: React.FC = () => {
  return (
    <SectionWrapper id="the-mission" className="bg-bg-void/30 border-t border-border-soft">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Label */}
        <div className="text-center">
          <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest block">
            OUR MISSION
          </span>
        </div>

        {/* Mission Statement */}
        <div className="flex justify-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-text-main text-center font-sans tracking-tight max-w-3xl leading-[1.3] uppercase">
            Every ECE student in India deserves to know what their degree can actually do - <span className="text-signal-core">for free</span>, in plain language, <span className="text-accent-orange">starting today.</span>
          </h2>
        </div>

        {/* Commitments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          {COMMITMENTS.map((item, idx) => {
            const Icon = IconMap[item.iconName] || Unlock;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                style={{ borderBottomColor: item.color }}
                className="bg-bg-elev border border-border-soft rounded-xl p-8 flex flex-col justify-between hover:border-text-dim transition-colors border-b-2"
              >
                <div>
                  <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest block mb-4">
                    {item.number}
                  </span>
                  <div className="p-3 bg-bg-base/40 border border-border-soft rounded-lg w-fit" style={{ color: item.color }}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-text-main uppercase mt-6 font-sans">
                    {item.title}
                  </h3>
                  <p className="text-text-sub text-xs md:text-sm mt-3 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* National Statement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
          style={{
            background: 'var(--cyan-muted)',
            border: '1px solid var(--ghost-border-active)',
            padding: '20px 32px',
            borderRadius: '12px',
          }}
        >
          <p
            className="font-sans font-medium"
            style={{
              color: 'var(--text-main)',
              fontSize: '16px',
              lineHeight: 1.6,
            }}
          >
            What engineers do best - we build. This is our contribution
            to India's semiconductor decade.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};
