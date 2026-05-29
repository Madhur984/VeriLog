import React from 'react';
import { KMapLab } from './kmap-lab';

export const KMapLabPage: React.FC = () => {
    return (
        <div className="min-h-[100svh] w-full bg-[#050505] text-slate-100 flex flex-col overflow-y-auto lg:overflow-hidden lg:h-screen">
            <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:py-4 border-b border-white/5 bg-black/50 backdrop-blur-md shrink-0">
                <div>
                    <h1 className="text-base lg:text-xl font-bold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
                        K-Map Optimizer Lab
                    </h1>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Interactive Karnaugh Map Environment
                    </p>
                </div>
            </div>
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
                <KMapLab />
            </div>
        </div>
    );
};
