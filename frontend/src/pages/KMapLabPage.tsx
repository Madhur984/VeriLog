import React from 'react';

export const KMapLabPage: React.FC = () => {
    return (
        <div className="h-screen w-full bg-[#050505] text-slate-100 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/50 backdrop-blur-md">
                <div>
                   <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">K-Map Optimizer Lab</h1>
                   <p className="text-xs text-slate-500 font-mono mt-1">Interactive Karnaugh Map Environment</p>
                </div>
            </div>
            <div className="flex-1 w-full bg-[#0B0D14]">
                {/* Embedded Next.js App for K-Map from localhost:3000 */}
                <iframe 
                    src="http://localhost:3001" 
                    className="w-full h-full border-none" 
                    title="K-Map Lab"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                />
            </div>
        </div>
    );
};
