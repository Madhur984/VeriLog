import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Award, MessageSquare } from 'lucide-react';
import { DataTerminal } from './DataTerminal';
import { useColorScheme } from '../../../hooks/useColorScheme';

const ALL_PEERS = [
  { id: 1, name: 'BFB_USER_99', archetype: 'Architect', domain: 'VLSI', progress: 85, location: 'Bengaluru' },
  { id: 2, name: 'BFB_USER_42', archetype: 'Signal Analyst', domain: 'RF', progress: 62, location: 'Austin' },
  { id: 3, name: 'BFB_USER_101', archetype: 'Firmware Eng', domain: 'Embedded', progress: 94, location: 'Munich' },
  { id: 4, name: 'BFB_USER_07', archetype: 'Logic Ninja', domain: 'Digital', progress: 77, location: 'Hsinchu' },
  { id: 5, name: 'BFB_USER_233', archetype: 'Timing Wizard', domain: 'STA', progress: 91, location: 'Hyderabad' },
  { id: 6, name: 'BFB_USER_18', archetype: 'Power Lead', domain: 'Power', progress: 56, location: 'Chennai' },
  { id: 7, name: 'BFB_USER_512', archetype: 'DV Engineer', domain: 'Verification', progress: 88, location: 'San Jose' },
  { id: 8, name: 'BFB_USER_74', archetype: 'Analog Guru', domain: 'Analog', progress: 73, location: 'Dallas' },
  { id: 9, name: 'BFB_USER_305', archetype: 'Layout Expert', domain: 'PD', progress: 69, location: 'Noida' },
  { id: 10, name: 'BFB_USER_61', archetype: 'FPGA Dev', domain: 'FPGA', progress: 82, location: 'Pune' },
  { id: 11, name: 'BFB_USER_148', archetype: 'SoC Integrator', domain: 'SoC', progress: 95, location: 'Cupertino' },
  { id: 12, name: 'BFB_USER_29', archetype: 'RF Designer', domain: 'RF/mmWave', progress: 71, location: 'San Diego' },
];

export const SiliconNetwork: React.FC = () => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const [visiblePeers, setVisiblePeers] = useState(ALL_PEERS.slice(0, 4));
  const [onlineCount, setOnlineCount] = useState(4209);

  useEffect(() => {
    let peerIndex = 4;
    const interval = setInterval(() => {
      setVisiblePeers(prev => {
        const next = [...prev];
        const replaceIdx = Math.floor(Math.random() * 4);
        next[replaceIdx] = ALL_PEERS[peerIndex % ALL_PEERS.length];
        peerIndex++;
        return next;
      });
      setOnlineCount(prev => prev + Math.floor(Math.random() * 7) - 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DataTerminal title="SILICON NETWORK" subtitle="Verified Peer Intelligence & Mentorship Connections">
      <div className="p-8 space-y-8 bg-bg-void h-full">
        <div className={`flex items-center gap-4 mb-6 ${isLight ? 'text-signal-core' : 'text-cyan-400'}`}>
          <Users size={18} />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">Active Peer Synchronization</span>
          <div className={`h-px flex-1 ${isLight ? 'bg-signal-core/20' : 'bg-cyan-400/20'}`} />
          <span className="font-mono text-[10px] text-text-dim animate-pulse">{onlineCount.toLocaleString()} USERS ONLINE</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {visiblePeers.map((peer) => (
            <motion.div 
              key={peer.id}
              whileHover={{ x: 5 }}
              className={`group p-4 border transition-all flex items-center justify-between ${
                isLight 
                  ? 'bg-bg-base border-border-soft hover:border-signal-core/30' 
                  : 'bg-white/[0.02] border-white/5 hover:border-cyan-400/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                  isLight ? 'bg-signal-core/5 border border-signal-core/20' : 'bg-cyan-400/5 border border-cyan-400/20'
                }`}>
                  <span className={`font-mono text-xs ${isLight ? 'text-signal-core' : 'text-cyan-400'}`}>{peer.name.split('_')[2]}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-text-main font-mono uppercase">{peer.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-mono text-text-dim uppercase">{peer.archetype}</span>
                    <span className={`w-1 h-1 rounded-full ${isLight ? 'bg-ghost-trace' : 'bg-slate-700'}`} />
                    <span className="text-[9px] font-mono text-text-dim uppercase">{peer.location}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-[10px] font-mono font-bold ${isLight ? 'text-signal-core' : 'text-cyan-400'}`}>{peer.progress}%</div>
                <div className={`w-16 h-1 mt-1 rounded-full overflow-hidden ${isLight ? 'bg-ghost-trace' : 'bg-white/5'}`}>
                  <div className={`h-full ${isLight ? 'bg-signal-core' : 'bg-cyan-400'}`} style={{ width: `${peer.progress}%` }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={`pt-6 border-t flex flex-wrap gap-4 ${isLight ? 'border-border-soft' : 'border-white/5'}`}>
          <button className={`px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all flex items-center gap-2 ${
            isLight ? 'bg-bg-base border-border-soft text-text-dim hover:text-text-main' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}>
            <Globe size={12} /> Global Feed
          </button>
          <button className={`px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all flex items-center gap-2 ${
            isLight ? 'bg-bg-base border-border-soft text-text-dim hover:text-text-main' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}>
            <MessageSquare size={12} /> Domain Channels
          </button>
          <button className={`px-4 py-2 border text-[10px] font-mono uppercase tracking-widest transition-all flex items-center gap-2 ${
            isLight ? 'bg-signal-core/10 border-signal-core/30 text-signal-core hover:bg-signal-core hover:text-white' : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400 hover:text-black'
          }`}>
            <Award size={12} /> Mentorship Sync
          </button>
        </div>
      </div>
    </DataTerminal>
  );
};
