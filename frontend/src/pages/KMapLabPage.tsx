import React from 'react';
import { KMapLab } from './kmap-lab';

export const KMapLabPage: React.FC = () => {
    return (
        <div className="min-h-[100svh] w-full bg-bg-void text-text-main flex flex-col overflow-y-auto lg:overflow-hidden lg:h-screen">
            <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:py-4 border-b border-border-soft bg-bg-elev shrink-0">
                <div>
                    <h1 className="text-base lg:text-xl font-bold text-sky-400">
                        K-Map Optimizer Lab
                    </h1>
                    <p className="text-xs text-text-dim font-mono mt-0.5">
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
