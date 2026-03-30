/**
 * useTransitionController.tsx  (TSX — contains JSX in TransitionProvider)
 *
 * Listens to React Router location changes.
 * Drives TransitionOverlay visibility via a shared TransitionContext.
 *
 * Architecture:
 *   - 2 total React renders per transition (boolean on + boolean off)
 *   - Message passed via ref (zero re-renders for message change)
 *   - Overlay CSS handles all timing — no RAF, no setTimeout chains
 *   - Route-to-message map is fully extensible per level/module
 */

import { useEffect, useRef, createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import React from 'react';
import { useLocation } from 'react-router-dom';

// ─── Route-to-Message Map ─────────────────────────────────────────────────────

export interface TransitionMessage {
    primary: string;
    level: 1 | 2 | 3;
}

const ROUTE_MAP: Record<string, TransitionMessage> = {
    '/level/1': { primary: 'INITIALIZING LAB ENVIRONMENT', level: 1 },
    '/module/1': { primary: 'INITIALIZING LAB ENVIRONMENT', level: 1 },
    '/circuit-lab': { primary: 'INITIALIZING LAB ENVIRONMENT', level: 1 },
    '/assessment': { primary: 'VALIDATING SIGNAL STRUCTURE', level: 1 },
    '/portal': { primary: 'STRUCTURAL UNDERSTANDING CONFIRMED', level: 1 },
    '/home': { primary: 'RETURNING TO ENGINEERING HUB', level: 1 },
    '/training': { primary: 'ACCESSING TRAINING MATRIX', level: 1 },
    '/level/2': { primary: 'ACCESSING CONTROL LAYER', level: 2 },
    '/level/3': { primary: 'INITIALIZING LOGIC SYNTHESIS', level: 3 },
};

const DEFAULT_MESSAGE: TransitionMessage = {
    primary: 'RECONFIGURING SYSTEM STATE',
    level: 1,
};

function getMessageForRoute(path: string): TransitionMessage {
    return ROUTE_MAP[path] ?? DEFAULT_MESSAGE;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface TransitionCtx {
    isTransitioning: boolean;
    messageRef: React.MutableRefObject<TransitionMessage>;
}

const TransitionContext = createContext<TransitionCtx>({
    isTransitioning: false,
    messageRef: { current: DEFAULT_MESSAGE },
});

export function useTransitionContext(): TransitionCtx {
    return useContext(TransitionContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface TransitionProviderProps {
    children: ReactNode;
}

/**
 * Must be rendered inside <BrowserRouter> to access useLocation().
 * Wraps the entire route tree — mounted once, never unmounts.
 */
export function TransitionProvider({ children }: TransitionProviderProps) {
    const location = useLocation();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const messageRef = useRef<TransitionMessage>(DEFAULT_MESSAGE);
    const prevPath = useRef<string>(location.pathname);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Skip transition on initial mount
        if (isFirstRender.current) {
            isFirstRender.current = false;
            prevPath.current = location.pathname;
            return;
        }

        // Skip if navigating to the same route
        if (prevPath.current === location.pathname) return;
        prevPath.current = location.pathname;

        // Update message via ref — zero re-renders
        messageRef.current = getMessageForRoute(location.pathname);

        // Clear any pending timer (handles rapid navigation)
        if (timerRef.current !== null) clearTimeout(timerRef.current);

        // Render 1: Show overlay
        setIsTransitioning(true);

        // Render 2: Hide overlay after full cascade (700ms)
        timerRef.current = setTimeout(() => setIsTransitioning(false), 700);

        return () => {
            if (timerRef.current !== null) clearTimeout(timerRef.current);
        };
    }, [location.pathname]);

    return (
        <TransitionContext.Provider value={{ isTransitioning, messageRef }}>
            {children}
        </TransitionContext.Provider>
    );
}

// ─── Convenience Hook ─────────────────────────────────────────────────────────

export function useTransitionController(): TransitionCtx {
    return useTransitionContext();
}
