/**
 * InsightBox.tsx
 * 
 * Standardized Theory System for Module 1.
 * Layer 1: Short concept (Always visible).
 * Layer 2: Expanded explanation (Optional).
 * Layer 3: Engineering view (Advanced).
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InsightBoxProps {
    title: string;
    insight: string;
    whyItMatters: string;
    engineering?: string;
    unlocked?: boolean;
}

export const InsightBox: React.FC<InsightBoxProps> = ({
    title,
    insight,
    whyItMatters,
    engineering,
    unlocked = false,
}) => {
    const [expanded, setExpanded] = useState(false);
    const [showEng, setShowEng] = useState(false);

    if (!unlocked) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col border-l-2 border-[#00FF41] bg-[#00FF41]/5 p-6 gap-4"
        >
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-[#00FF41] uppercase tracking-[0.3em]">
                    Discovery Locked: {title}
                </span>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setExpanded(!expanded)}
                        className="text-[9px] font-mono text-white/40 uppercase tracking-widest hover:text-white transition-colors"
                    >
                        {expanded ? '[-] Collapse' : '[+] Details'}
                    </button>
                    {engineering && (
                        <button 
                            onClick={() => setShowEng(!showEng)}
                            className="text-[9px] font-mono text-white/40 uppercase tracking-widest hover:text-white transition-colors"
                        >
                            {showEng ? '[-] Math' : '[+] Engineering'}
                        </button>
                    )}
                </div>
            </div>

            {/* Layer 1: Short Concept (Always Visible) */}
            <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-white/40 uppercase">💡 Insight</span>
                <p className="text-sm font-mono text-white leading-relaxed">
                    "{insight}"
                </p>
            </div>

            <AnimatePresence>
                {/* Layer 2: Expanded Explanation & Why It Matters */}
                {expanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-col gap-4 overflow-hidden pt-4 border-t border-white/5"
                    >
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-mono text-white/40 uppercase">🌍 Why it Matters</span>
                            <p className="text-xs font-mono text-white/60 leading-relaxed italic">
                                "{whyItMatters}"
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Layer 3: Engineering View */}
                {showEng && engineering && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-col gap-2 overflow-hidden pt-4 border-t border-white/5"
                    >
                        <span className="text-[10px] font-mono text-[#FF8C00] uppercase tracking-widest">⚛️ Engineering View</span>
                        <div className="p-4 bg-black/40 border border-[#FF8C00]/20 font-mono text-[11px] text-[#FF8C00] leading-relaxed">
                            {engineering}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
