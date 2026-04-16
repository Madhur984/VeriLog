import { useRef, useEffect, useCallback } from 'react';

// Singleton State (Exists outside the hook to be shared across all scene instances)
let globalAudioCtx: AudioContext | null = null;
const globalNodes = new Map<string, AudioNode>();

/**
 * useModule2Audio: A unified, singleton audio controller for Module 2.
 * Ensures the AudioContext is shared across scenes and properly cleaned up.
 */
export const useModule2Audio = () => {
    const init = useCallback(() => {
        if (!globalAudioCtx) {
            globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (globalAudioCtx.state === 'suspended') {
            globalAudioCtx.resume();
        }
        return globalAudioCtx;
    }, []);

    const createOscillator = useCallback((id: string, type: OscillatorType = 'sine', freq: number = 440) => {
        const ctx = init();
        if (globalNodes.has(id)) {
            const existing = globalNodes.get(id);
            if (existing instanceof OscillatorNode) return existing;
        }

        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.start();
        globalNodes.set(id, osc);
        return osc;
    }, [init]);

    const createGain = useCallback((id: string, initialGain: number = 0) => {
        const ctx = init();
        if (globalNodes.has(id)) {
            const existing = globalNodes.get(id);
            if (existing instanceof GainNode) return existing;
        }

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(initialGain, ctx.currentTime);
        gain.connect(ctx.destination);
        globalNodes.set(id, gain);
        return gain;
    }, [init]);

    const updateGain = useCallback((id: string, value: number, rampTime: number = 0.1) => {
        const node = globalNodes.get(id);
        if (node instanceof GainNode && globalAudioCtx) {
            const targetValue = Math.max(0, Math.min(1, value));
            node.gain.setTargetAtTime(targetValue, globalAudioCtx.currentTime, rampTime);
        }
    }, []);

    const updateFreq = useCallback((id: string, value: number, rampTime: number = 0.1) => {
        const node = globalNodes.get(id);
        if (node instanceof OscillatorNode && globalAudioCtx) {
            node.frequency.setTargetAtTime(value, globalAudioCtx.currentTime, rampTime);
        }
    }, []);

    const cleanup = useCallback(() => {
        // We don't want to close the context if other scenes might still need it,
        // but we should stop and disconnect nodes that are no longer needed.
        // For a true singleton in this scrollytelling app, we might just keep the context alive
        // until the entire Module 2 is unmounted.
    }, []);

    return { init, createOscillator, createGain, updateGain, updateFreq, cleanup };
};
