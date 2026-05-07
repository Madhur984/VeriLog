import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeDefinition } from '../data/badgeDefinitions';
import { generateBadgeSVG, downloadBadge } from '../utils/BadgeEngine';
import { Lock, Download, ShieldCheck, Activity } from 'lucide-react';
import { useCursorGravity } from '../hooks/useCursorGravity';

interface SiliconCabinetProps {
  unlockedBadgeIds: string[];
  allBadges: BadgeDefinition[];
}

export const SiliconCabinet: React.FC<SiliconCabinetProps> = ({ unlockedBadgeIds, allBadges }) => {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const { mouseX, mouseY } = useCursorGravity({ magneticRadius: 100, pullStrength: 0.1 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const unlockedCount = allBadges.filter(b => unlockedBadgeIds.includes(b.id)).length;
  const progressPercentage = (unlockedCount / allBadges.length) * 100;

  return (
    <div className="space-y-8">
      {/* Telemetry & Progress Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 bg-black/40 border border-white/10 p-6 rounded-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0)_1px,transparent_1px)] bg-[size:20px_20px] opacity-10" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3 text-cyan-400">
            <ShieldCheck size={18} />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">Credential Repository</span>
          </div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest max-w-lg">
            Immutable artifact storage for validated engineering competencies. All artifacts are cryptographically signed.
          </p>
        </div>

        <div className="relative z-10 w-full md:w-72">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Acquisition Progress</span>
            <span className="text-sm font-mono text-cyan-400 font-bold">{unlockedCount} / {allBadges.length}</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allBadges.map((badge, index) => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);
          const svgContent = generateBadgeSVG(badge, 'AXE-OR-5091');
          const isHovered = hoveredBadge === badge.id;

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredBadge(badge.id)}
              onMouseLeave={() => setHoveredBadge(null)}
              className={`relative bg-[#050505] rounded-sm transition-all duration-300 group ${
                isUnlocked 
                  ? 'border border-cyan-400/30 hover:border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.05)] hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]' 
                  : 'border border-white/5 grayscale opacity-60'
              }`}
            >
              {/* Scanline Effect for Unlocked */}
              {isUnlocked && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-sm opacity-20">
                  <motion.div 
                    className="w-full h-1 bg-cyan-400 blur-sm"
                    animate={{ y: ['-10%', '110%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              )}

              {/* Slot Header */}
              <div className="flex justify-between items-center p-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                    SLOT-{index.toString().padStart(3, '0')}
                  </span>
                </div>
                {isUnlocked ? (
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 uppercase tracking-widest">
                    <Activity size={10} className="animate-pulse" />
                    <span>Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-red-500/70 uppercase tracking-widest">
                    <Lock size={10} />
                    <span>Encrypted</span>
                  </div>
                )}
              </div>

              {/* Badge Display */}
              <div className="p-8 relative">
                <div className="aspect-square w-full relative z-10 flex items-center justify-center">
                  <div 
                    dangerouslySetInnerHTML={{ __html: svgContent }} 
                    className={`w-full h-full transition-transform duration-500 ${isHovered && isUnlocked ? 'scale-105' : 'scale-100'}`}
                  />
                </div>
                
                {/* Crosshairs & Grid inside display area */}
                <div className="absolute inset-4 border border-white/5 pointer-events-none" />
                <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/20" />
                <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/20" />
                <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/20" />
                <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/20" />
              </div>

              {/* Data Footer */}
              <div className="p-4 border-t border-white/5 bg-black/40">
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider truncate" title={badge.name}>
                    {badge.name}
                  </h4>
                  <div className="flex justify-between items-end">
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                      {badge.tier} TIER
                    </p>
                    {isUnlocked && (
                      <p className="text-[9px] font-mono text-cyan-400/50 uppercase tracking-widest font-bold">
                        AQ: {new Date().getFullYear()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Overlay Action */}
              <AnimatePresence>
                {isHovered && isUnlocked && (
                    <motion.div 
                      className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px]"
                    >
                      <motion.button 
                        onClick={() => downloadBadge(svgContent, badge.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-3 group/btn relative"
                      >
                        <div className="w-12 h-12 rounded-full border border-cyan-400/50 bg-cyan-400/10 flex items-center justify-center text-cyan-400 group-hover/btn:bg-cyan-400 group-hover/btn:text-black transition-colors shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                          <Download size={20} />
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest group-hover/btn:text-white transition-colors">
                          Export Artifact
                        </span>
                      </motion.button>
                    </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
