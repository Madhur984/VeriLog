/**
 * usePanelLayout.ts - Persistent resizable panel layout manager
 *
 * Manages panel sizes, visibility, and order. Persists to localStorage.
 * Supports horizontal and vertical split arrangements.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface PanelConfig {
    id: string;
    label: string;
    icon: string;
    minWidth: number;
    minHeight: number;
    defaultSize: number; // percentage 0-100
    visible: boolean;
}

export interface LayoutState {
    panels: PanelConfig[];
    splitSizes: number[]; // percentage for each panel
    orientation: 'horizontal' | 'vertical';
}

const STORAGE_KEY = 'digilogic-workbench-layout';

const DEFAULT_PANELS: PanelConfig[] = [
    { id: 'palette', label: 'Components', icon: '📦', minWidth: 180, minHeight: 200, defaultSize: 15, visible: true },
    { id: 'canvas', label: 'Circuit Canvas', icon: '⚡', minWidth: 400, minHeight: 300, defaultSize: 50, visible: true },
    { id: 'oscilloscope', label: 'Oscilloscope', icon: '📊', minWidth: 250, minHeight: 200, defaultSize: 20, visible: true },
    { id: 'console', label: 'Console', icon: '💬', minWidth: 200, minHeight: 120, defaultSize: 15, visible: true },
];

function loadLayout(): LayoutState {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return {
        panels: DEFAULT_PANELS,
        splitSizes: DEFAULT_PANELS.map(p => p.defaultSize),
        orientation: 'horizontal',
    };
}

function saveLayout(layout: LayoutState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch { /* ignore */ }
}

export function usePanelLayout() {
    const [layout, setLayout] = useState<LayoutState>(loadLayout);
    const saveTimer = useRef<ReturnType<typeof setTimeout>>();

    // Debounced persist
    useEffect(() => {
        saveTimer.current = setTimeout(() => saveLayout(layout), 300);
        return () => clearTimeout(saveTimer.current);
    }, [layout]);

    const setSplitSizes = useCallback((sizes: number[]) => {
        setLayout(prev => ({ ...prev, splitSizes: sizes }));
    }, []);

    const togglePanel = useCallback((panelId: string) => {
        setLayout(prev => {
            const panels = prev.panels.map(p =>
                p.id === panelId ? { ...p, visible: !p.visible } : p
            );
            const visible = panels.filter(p => p.visible);
            const equalSize = 100 / visible.length;
            const splitSizes = panels.map(p => p.visible ? equalSize : 0);
            return { ...prev, panels, splitSizes };
        });
    }, []);

    const setOrientation = useCallback((orientation: 'horizontal' | 'vertical') => {
        setLayout(prev => ({ ...prev, orientation }));
    }, []);

    const resetLayout = useCallback(() => {
        const defaultLayout: LayoutState = {
            panels: DEFAULT_PANELS,
            splitSizes: DEFAULT_PANELS.map(p => p.defaultSize),
            orientation: 'horizontal',
        };
        setLayout(defaultLayout);
        saveLayout(defaultLayout);
    }, []);

    const visiblePanels = layout.panels.filter(p => p.visible);
    const visibleSizes = layout.splitSizes.filter((_, i) => layout.panels[i]?.visible);

    return {
        layout,
        visiblePanels,
        visibleSizes,
        setSplitSizes,
        togglePanel,
        setOrientation,
        resetLayout,
    };
}
