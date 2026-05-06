
import React from 'react';
import { motion } from 'framer-motion';
import { BadgeDefinition } from '../data/badgeDefinitions';
import { generateBadgeSVG, downloadBadge } from '../utils/BadgeEngine';
import { Lock, Download } from 'lucide-react';

interface SiliconCabinetProps {
  unlockedBadgeIds: string[];
  allBadges: BadgeDefinition[];
}

export const SiliconCabinet: React.FC<SiliconCabinetProps> = ({ unlockedBadgeIds, allBadges }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {allBadges.map((badge) => {
        const isUnlocked = unlockedBadgeIds.includes(badge.id);
        const svgContent = generateBadgeSVG(badge, 'USER_ID_MOCK');

        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`relative p-6 rounded-3xl border transition-all group overflow-hidden ${
              isUnlocked 
                ? 'bg-observatory-surface border-white/[0.08] hover:border-cyan-400/50' 
                : 'bg-black/20 border-white/[0.02] grayscale opacity-40'
            }`}
          >
            {!isUnlocked && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <Lock size={24} className="text-slate-600" />
              </div>
            )}

            <div className="aspect-square w-full mb-6 relative">
              <div 
                dangerouslySetInnerHTML={{ __html: svgContent }} 
                className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all"
              />
            </div>

            <div className="space-y-1 text-center">
              <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">{badge.name}</h4>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{badge.tier} TIER</p>
            </div>

            {isUnlocked && (
              <button 
                onClick={() => downloadBadge(svgContent, badge.id)}
                className="absolute top-4 right-4 p-2 bg-white/5 rounded-lg text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
              >
                <Download size={14} />
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
