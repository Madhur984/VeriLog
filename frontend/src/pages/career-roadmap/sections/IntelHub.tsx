import React from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../../../components/SectionWrapper';
import { Globe } from 'lucide-react';

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
            <h2 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight uppercase">Intel Hub</h2>
            <p className="text-text-sub font-mono text-xs uppercase tracking-widest max-w-xl">
              Government schemes, fellowships, and internship opportunities.
            </p>
          </div>
          <button className="px-8 py-3 bg-bg-elev/40 border border-border-soft rounded-full text-[10px] font-mono text-text-sub uppercase tracking-widest hover:text-text-main hover:border-border-soft/80 transition-all">
            Open Global Directory
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {initiatives.map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -8 }}
              className="p-8 bg-observatory-bg border border-border-soft rounded-2xl space-y-6 group cursor-pointer hover:border-signal-core/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="px-2 py-0.5 bg-bg-elev/40 border border-border-soft rounded text-[9px] font-mono text-text-dim uppercase tracking-widest group-hover:text-signal-core transition-colors">
                  {item.type}
                </div>
                <Globe size={16} className="text-text-dim group-hover:text-signal-core transition-colors" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-text-main uppercase tracking-tight group-hover:text-signal-core transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest">{item.org}</p>
              </div>

              <p className="text-sm text-text-sub leading-relaxed min-h-[60px]">
                {item.desc}
              </p>

              <div className="pt-4 border-t border-border-soft flex items-center justify-end">
                <span className="text-[10px] font-mono text-signal-core uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">
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
