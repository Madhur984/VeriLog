import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Award, MessageSquare } from 'lucide-react';
import { DataTerminal } from './DataTerminal';

const PEERS = [
  { id: 1, name: 'BFB_USER_99', archetype: 'Architect', domain: 'VLSI', progress: 85, location: 'Bengaluru' },
  { id: 2, name: 'BFB_USER_42', archetype: 'Signal Analyst', domain: 'RF', progress: 62, location: 'Austin' },
  { id: 3, name: 'BFB_USER_101', archetype: 'Firmware Eng', domain: 'Embedded', progress: 94, location: 'Munich' },
  { id: 4, name: 'BFB_USER_07', archetype: 'Logic Ninja', domain: 'Digital', progress: 77, location: 'Hsinchu' },
];

export const SiliconNetwork: React.FC = () => {
  return (
    <DataTerminal title="SILICON NETWORK" subtitle="Verified Peer Intelligence & Mentorship Connections">
      <div className="p-8 space-y-8 bg-[#020408]">
        <div className="flex items-center gap-4 text-cyan-400 mb-6">
          <Users size={18} />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">Active Peer Synchronization</span>
          <div className="h-px flex-1 bg-cyan-400/20" />
          <span className="font-mono text-[10px] text-slate-500 animate-pulse">4,209 USERS ONLINE</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {PEERS.map((peer) => (
            <motion.div 
              key={peer.id}
              whileHover={{ x: 5 }}
              className="group p-4 bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-sm bg-cyan-400/5 border border-cyan-400/20 flex items-center justify-center">
                  <span className="text-cyan-400 font-mono text-xs">{peer.name.split('_')[2]}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white font-mono uppercase">{peer.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">{peer.archetype}</span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                    <span className="text-[9px] font-mono text-slate-500 uppercase">{peer.location}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono text-cyan-400 font-bold">{peer.progress}%</div>
                <div className="w-16 h-1 bg-white/5 mt-1 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${peer.progress}%` }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
            <Globe size={12} /> Global Feed
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
            <MessageSquare size={12} /> Domain Channels
          </button>
          <button className="px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 text-[10px] font-mono text-cyan-400 uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all flex items-center gap-2">
            <Award size={12} /> Mentorship Sync
          </button>
        </div>
      </div>
    </DataTerminal>
  );
};
