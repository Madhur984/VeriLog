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
    <SectionWrapper id="the-mission" className="bg-[#0D0F12]/30 border-t border-white/[0.03]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Label */}
        <div className="text-center">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block">
            OUR MISSION
          </span>
        </div>

        {/* Mission Statement */}
        <div className="flex justify-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white text-center font-sans tracking-tight max-w-3xl leading-[1.3] uppercase">
            Every ECE student in India deserves to know what their degree can actually do — <span className="text-cyan-400">for free</span>, in plain language, <span className="text-amber-400">starting today.</span>
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
                className="bg-[#0D0F12] border border-white/[0.08] rounded-xl p-8 flex flex-col justify-between hover:border-slate-800 transition-colors border-b-2"
              >
                <div>
                  <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest block mb-4">
                    {item.number}
                  </span>
                  <div className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-lg w-fit" style={{ color: item.color }}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase mt-6 font-sans">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs md:text-sm mt-3 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
};
