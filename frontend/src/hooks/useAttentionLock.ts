import { useState, useCallback } from 'react';

/**
 * useAttentionLock — Unified Module Attention System.
 * Rule 9: When interacting, dim other elements to 30-40%.
 */
export const useAttentionLock = (initialState = false) => {
    const [isFocused, setIsFocused] = useState(initialState);

    const lock = useCallback(() => setIsFocused(true), []);
    const unlock = useCallback(() => setIsFocused(false), []);

    // Helper for applying styles to non-active elements
    const getDimStyle = (active: boolean) => ({
        opacity: isFocused && !active ? 0.35 : 1,
        pointerEvents: isFocused && !active ? 'none' : 'auto' as any,
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    });

    const focusProps = {
        onMouseDown: lock,
        onMouseUp: unlock,
        onTouchStart: lock,
        onTouchEnd: unlock
    };

    return { isFocused, lock, unlock, getDimStyle, focusProps };
};
