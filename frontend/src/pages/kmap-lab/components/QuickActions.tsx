
import React from 'react';
import { useStore } from '../store/useStore';
import { RotateCcw, Trash2, Github } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const { reset } = useStore();

  return (
    <div className="flex items-center justify-center gap-4 mt-8 py-8 border-t border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000">
      <button 
        onClick={reset}
        className="flex items-center gap-2 px-6 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-xl font-bold transition-all border border-red-500/20"
      >
        <Trash2 size={18} />
        Clear Board
      </button>

      <button className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10">
        <RotateCcw size={18} />
        Restore Previous
      </button>

      <a 
        href="https://github.com" 
        target="_blank" 
        className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-zinc-900 text-white rounded-xl font-bold transition-all border border-white/10"
      >
        <Github size={18} />
        Source
      </a>
    </div>
  );
};
