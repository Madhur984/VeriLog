import React, { ReactNode } from 'react';
import { HUD } from './HUD';

interface CockpitLayoutProps {
    missionPanel: ReactNode;
    editorPanel: ReactNode;
    visualizerPanel: ReactNode;
}

export const TrainingCockpitLayout: React.FC<CockpitLayoutProps> = ({
    missionPanel,
    editorPanel,
    visualizerPanel
}) => {
    return (
        <div className="h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
            <HUD />

            <main className="flex-1 flex overflow-hidden">
                {/* Left Pane: Mission Log */}
                <section className="w-[20%] min-w-[250px] border-r border-slate-200 bg-white/80 backdrop-blur flex flex-col">
                    {missionPanel}
                </section>

                {/* Center Pane: Synthesizer (Editor) */}
                <section className="flex-1 flex flex-col min-w-[400px] relative z-10 bg-slate-50 shadow-xl">
                    {editorPanel}
                </section>

                {/* Right Pane: Oscilloscope (Visualizer) */}
                <section className="w-[30%] min-w-[350px] border-l border-slate-200 bg-slate-100/50 flex flex-col">
                    {visualizerPanel}
                </section>
            </main>
        </div>
    );
};
