import React, { createContext, useContext } from 'react';
import { useDragEngine, type DropResult, type SnapNode } from '../hooks/useDragEngine';
// import { DropResult, SnapNode } from '../engine/types';

type DragEngineHook = ReturnType<typeof useDragEngine>;

const DragEngineContext = createContext<DragEngineHook | null>(null);

export const DragEngineProvider: React.FC<{
    children: React.ReactNode;
    snapNodes: SnapNode[];
    onDrop: (result: DropResult) => void;
}> = ({ children, snapNodes, onDrop }) => {
    const engine = useDragEngine(snapNodes, onDrop);

    return (
        <DragEngineContext.Provider value={engine}>
            {children}
        </DragEngineContext.Provider>
    );
};

export const useDragEngineContext = () => {
    const context = useContext(DragEngineContext);
    if (!context) {
        throw new Error('useDragEngineContext must be used within a DragEngineProvider');
    }
    return context;
};
