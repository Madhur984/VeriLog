import { useRef, useEffect, useCallback } from 'react';

let globalAudioCtx: AudioContext | null = null;
const globalNodes = new Map<string, AudioNode>();

/**
 * useModule1Audio: A singleton audio controller for Module 1.
 * Provides procedural feedback for signal interactions.
 */
export const useModule1Audio = () => {
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

    const playPing = useCallback((freq: number = 880, duration: number = 0.1) => {
        const ctx = init();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
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

    return { init, createOscillator, createGain, updateGain, updateFreq, playPing };
};
