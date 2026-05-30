import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { USER_TYPES } from '../data/aboutData';
import { SectionWrapper } from '../../../components/SectionWrapper';

export const WhoThisIsFor: React.FC = () => {
  return (
    <SectionWrapper id="who-this-is-for" className="bg-bg-void">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-4">
          <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest block">
            FOR YOU, IF
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-main tracking-tight uppercase leading-[1.1]">
            You'll know this is for you.
          </h2>
        </div>

        {/* User Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {USER_TYPES.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              style={{ borderLeftColor: card.color }}
              className="bg-bg-elev border border-border-soft border-l-4 rounded-xl p-8 flex flex-col justify-between hover:border-text-dim transition-colors min-h-[300px]"
            >
              <div className="space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-wider block" style={{ color: card.color }}>
                  {card.label}
                </span>
                <h3 className="text-lg font-bold text-text-main leading-snug font-sans">
                  {card.opening}
                </h3>
                <p className="text-text-sub text-xs md:text-sm leading-relaxed font-sans">
                  {card.detail}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border-soft">
                <Link
                  to={card.ctaLink}
                  style={{ color: card.color }}
                  className="font-mono text-xs font-bold uppercase tracking-wider hover:underline inline-flex items-center gap-1.5"
                >
                  {card.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
