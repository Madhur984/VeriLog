import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LogisimWorkbenchProps {
    onCircuitLoaded?: (success: boolean) => void;
    circuitData?: string;
}

export const LogisimWorkbench: React.FC<LogisimWorkbenchProps> = ({ onCircuitLoaded, circuitData }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleIframeMessage = (_event: MessageEvent) => {
            // Optional: Listen to messages from Logisim
            // if (event.data?.type === 'CIRCUIT_CHANGED') { ... }
        };

        window.addEventListener('message', handleIframeMessage);
        return () => window.removeEventListener('message', handleIframeMessage);
    }, []);

    const handleIframeLoad = () => {
        setIsLoading(false);
        if (onCircuitLoaded) {
            onCircuitLoaded(true);
        }

        // Optional postMessage approach to inject circuit data once loaded
        if (circuitData && iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'LOAD_CIRCUIT',
                data: circuitData
            }, '*');
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {isLoading && (
                <div style={{ 
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    background: '#0B0D14', zIndex: 10, color: '#94A3B8'
                }}>
                    <Loader2 className="animate-spin" size={32} style={{ marginRight: 12 }} />
                    <span>Loading Logisim Workbench...</span>
                </div>
            )}
            
            <iframe
                ref={iframeRef}
                src="/logisim/index.html"
                onLoad={handleIframeLoad}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: isLoading ? 'none' : 'block' // hide while loading
                }}
                title="Logisim Simulator Editor"
                allow="clipboard-write; clipboard-read"
            />
        </div>
    );
};
