import React from 'react';
import { HUD } from './HUD';

interface CockpitLayoutProps {
    children: React.ReactNode;
}

export const CockpitLayout = ({ children }: CockpitLayoutProps) => {
    return (
        <div className="min-h-screen bg-void text-text-main font-sans selection:bg-terminal-green selection:text-void flex flex-col overflow-hidden">
            {/* HUD Top Bar */}
            <HUD
                moduleName="Module 1"
                lessonName="Logic Gates"
                streak={5}
                xp={1250}
            />

            {/* Main Content Area (Rest of screen) */}
            <main className="flex-1 flex overflow-hidden p-2 gap-2">
                {children}
            </main>
        </div>
    );
};
