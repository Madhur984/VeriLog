import React, { useEffect, useRef, useState } from 'react';

interface SimulatorProps {
    className?: string;
}

/**
 * Direct React integration of the CircuitVerse simulator.
 * Addresses null property and undefined callback errors by:
 * 1. Mocking API endpoints and global variables.
 * 2. Ensuring required DOM IDs exist before script load.
 * 3. Loading the simulator bundle only once.
 */
export const CircuitVerseSimulator: React.FC<SimulatorProps> = ({ className = "w-full h-full" }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // 1. Mock the specific API call to prevent 404
        const originalFetch = window.fetch;
        window.fetch = async (input, init) => {
            if (typeof input === 'string' && input.includes('/api/v1/me')) {
                return new Response(JSON.stringify({ error: "Not Logged In" }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return originalFetch(input, init);
        };

        // 2. Initialize required globals for CircuitVerse
        (window as any).userSignedIn = false;
        (window as any).isUserLoggedIn = false;
        (window as any).globalScope = undefined;
        (window as any).restrictedElements = [];
        (window as any).embed = true;
        (window as any).DPR = window.devicePixelRatio || 1;
        (window as any).lightMode = false;

        // 3. Ensure required DOM mounting points exist
        // CircuitVerse expects these specific IDs in some modules
        const requiredIds = ['simulationArea', 'backgroundArea', 'miniMapArea'];
        requiredIds.forEach(id => {
            if (!document.getElementById(id)) {
                const el = document.createElement('div');
                el.id = id;
                // These are usually canvases, but div containers work if the JS creates the canvas inside
                containerRef.current?.appendChild(el);
            }
        });

        // 4. Load the bundle with a slight delay to ensure DOM is ready
        const scriptId = 'cv-simulator-main-bundle';
        if (!document.getElementById(scriptId)) {
            console.log("DOM ready, delaying simulator-v0.js injection...");
            setTimeout(() => {
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = '/circuitverse/simulator-v0.js';
                script.type = 'module';
                script.async = true;
                script.onload = () => {
                    console.log("simulator-v0.js loaded successfully.");
                    setIsLoaded(true);
                };
                script.onerror = () => setError("Failed to load simulator bundle.");
                document.body.appendChild(script);
            }, 200); // 200ms delay as recommended to fix race conditions
        } else {
            setIsLoaded(true);
        }

        return () => {
            // Cleanup: restore fetch
            window.fetch = originalFetch;
        };
    }, []);

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-red-900/20 text-red-500 border border-red-500/50 rounded ${className}`}>
                {error}
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`relative bg-zinc-950 ${className}`}>
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 animate-pulse">
                    Mounting Simulation Environment...
                </div>
            )}
            {/* The CircuitVerse app will mount its UI into #app or create its own canvases */}
            <div id="app" className="w-full h-full"></div>
        </div>
    );
};
