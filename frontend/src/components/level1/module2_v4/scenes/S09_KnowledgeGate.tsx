import React from 'react';
import { InteractiveQuiz } from '../components/UltimateComponents';
import { TryItYourself } from '../../../ui/TryItYourself';

export const S09_KnowledgeGate: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto mb-32 text-left">
      <header className="space-y-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                Level 02.09 // Verification Hub
            </div>
            <h1 className={`text-6xl font-black italic tracking-tighter leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Mission <span className={isDarkMode ? 'text-orange-500' : 'text-orange-600'}>Clearance</span>
            </h1>
            <p className={`text-xl font-medium opacity-60 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Verify your synchronization with the core logic.
            </p>
      </header>

      <TryItYourself />
      <div className="w-full">
        <InteractiveQuiz isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};
