import React from 'react';

interface SimulatorProps {
    projectId?: string;
    embed?: boolean;
    className?: string;
}

/**
 * A stable, isolated wrapper for the CircuitVerse Simulator using an iframe.
 * This approach prevents global namespace pollution and ensures the simulator
 * doesn't crash due to React's lifecycle.
 */
export const CircuitVerseIframe: React.FC<SimulatorProps> = ({ 
    projectId, 
    embed = true,
    className = "w-full h-full"
}) => {
    // Construct URL based on project ID and embed flag
    const baseUrl = '/circuitverse/index.html';
    const hash = embed ? `#/embed/${projectId || ''}` : `#/simulator/${projectId || ''}`;
    const iframeUrl = `${baseUrl}${hash}`;

    return (
        <div className={`overflow-hidden bg-zinc-900 ${className}`}>
            <iframe
                src={iframeUrl}
                title="CircuitVerse Simulator"
                className="w-full h-full border-none"
                allow="fullscreen; clipboard-read; clipboard-write"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
        </div>
    );
};
