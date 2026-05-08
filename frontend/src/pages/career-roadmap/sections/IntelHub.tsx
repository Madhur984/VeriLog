import React from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../../../components/SectionWrapper';
import { GraduationCap, Briefcase, Rocket, Globe } from 'lucide-react';

export const IntelHub: React.FC = () => {
  const initiatives = [
    {
      title: 'CHIPS INDIA 2026',
      org: 'Ministry of Electronics',
      type: 'GOVT POLICY',
      desc: '₹76,000 Cr incentive scheme for semiconductor manufacturing & design.',
      color: 'cyan'
    },
    {
      title: 'VLSI DESIGN FELLOWSHIP',
      org: 'MeitY / IIT Hyderabad',
      type: 'EDUCATION',
      desc: 'Intensive PG fellowship with industrial internship at Top-10 IDMs.',
      color: 'amber'
    },
    {
      title: 'QUALCOMM 5G INTERNSHIPS',
      org: 'Qualcomm India',
      type: 'INDUSTRY',
      desc: 'Summer 2027 intake for Systems and RF Modem design teams.',
      color: 'copper'
    }
  ];

  return (
    <SectionWrapper id="intel" className="bg-observatory-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">Intel Hub</h2>
            <p className="text-slate-400 font-mono text-xs uppercase tracking-widest max-w-xl">
              Government schemes, fellowships, and internship opportunities.
            </p>
          </div>
          <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-slate-400 uppercase tracking-widest hover:text-white hover:border-white/20 transition-all">
            Open Global Directory
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {initiatives.map((item, i) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -8 }}
              className="p-8 bg-observatory-bg border border-white/5 rounded-2xl space-y-6 group cursor-pointer hover:border-cyan-400/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-slate-500 uppercase tracking-widest group-hover:text-cyan-400 transition-colors">
                  {item.type}
                </div>
                <Globe size={16} className="text-slate-700 group-hover:text-cyan-400 transition-colors" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{item.org}</p>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed min-h-[60px]">
                {item.desc}
              </p>

              <div className="pt-4 border-t border-white/5 flex items-center justify-end">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  View Detail →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
