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
        <div className="h-screen flex flex-col bg-deep-void text-slate-200 overflow-hidden font-sans">
            <HUD />

            <main className="flex-1 flex overflow-hidden">
                {/* Left Pane: Mission Log */}
                <section className="w-[20%] min-w-[250px] border-r border-bezel-grey bg-panel-grey/50 backdrop-blur flex flex-col">
                    {missionPanel}
                </section>

                {/* Center Pane: Synthesizer (Editor) */}
                <section className="flex-1 flex flex-col min-w-[400px] relative z-10 bg-deep-void shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    {editorPanel}
                </section>

                {/* Right Pane: Oscilloscope (Visualizer) */}
                <section className="w-[30%] min-w-[350px] border-l border-bezel-grey bg-panel-grey/30 flex flex-col">
                    {visualizerPanel}
                </section>
            </main>
        </div>
    );
};
