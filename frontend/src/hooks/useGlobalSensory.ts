import { useCallback } from 'react';

// ─── Pacing Constants ─────────────────────────────────────────────────────

export const PACING = {
    TEXT_DELAY: 1800,
    MICRO_DELAY: 700,
    ANIMATION: 500
};

// ─── Haptic System ────────────────────────────────────────────────────────

export type HapticType = 'micro' | 'light' | 'medium' | 'heavy' | 'success' | 'warning';

const HAPTICS: Record<HapticType, number | number[]> = {
    micro: 3,
    light: 5,
    medium: 10,
    heavy: 18,
    success: [10, 30, 10],
    warning: [20, 40, 20],
};

// ─── Sound System ─────────────────────────────────────────────────────────

export type SoundType = 'ambient' | 'move' | 'tension' | 'snap' | 'success' | 'break' | 'fail' | 'spark';

// Centralized asset map to ensure we load the same tracks app-wide
const SOUNDS: Record<SoundType, string> = {
    ambient: '/sounds/hum.mp3',
    move: '/sounds/whoosh.mp3',
    tension: '/sounds/rise.mp3',
    snap: '/sounds/click.mp3',
    success: '/sounds/chord.mp3',
    break: '/sounds/cut.mp3',
    fail: '/sounds/drop.mp3',
    spark: '/sounds/drop.mp3', 
};

// Global ambient instance so it can survive unmounts if needed, 
// though typically managed per module/level for specific hums.
let globalAmbientAudio: HTMLAudioElement | null = null;

// The interpolater to dip/restore volume smoothly
const animateVolume = (audio: HTMLAudioElement, targetVol: number, durationMs: number) => {
    const startVol = audio.volume;
    const startTime = performance.now();
    
    const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        // Easing out
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        audio.volume = startVol + (targetVol - startVol) * easeProgress;
        
        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    };
    requestAnimationFrame(tick);
};

export const useGlobalSensory = () => {
    // ─── Trigger Haptics ───
    const triggerHaptic = useCallback((type: HapticType) => {
        if (!navigator.vibrate) return;
        navigator.vibrate(HAPTICS[type]);
    }, []);

    // ─── Ambient Control ───
    const dipAmbient = useCallback(() => {
        if (globalAmbientAudio) {
            animateVolume(globalAmbientAudio, 0.1, 500); // Dip to 10% over 500ms
        }
    }, []);

    const restoreAmbient = useCallback(() => {
        if (globalAmbientAudio) {
            animateVolume(globalAmbientAudio, 0.25, 400); // Restore to 25% over 400ms
        }
    }, []);

    const playAmbient = useCallback(() => {
        if (!globalAmbientAudio) {
            globalAmbientAudio = new Audio(SOUNDS.ambient);
            globalAmbientAudio.loop = true;
            globalAmbientAudio.volume = 0.25;
        }
        globalAmbientAudio.play().catch(() => {});
    }, []);

    const stopAmbient = useCallback(() => {
        if (globalAmbientAudio) {
            globalAmbientAudio.pause();
            globalAmbientAudio.currentTime = 0;
            globalAmbientAudio = null;
        }
    }, []);

    // ─── Discrete Interaction Sounds ───
    const playSound = useCallback((type: SoundType) => {
        if (type === 'ambient') {
            playAmbient();
            return;
        }
        const audio = new Audio(SOUNDS[type]);
        audio.volume = 0.28; // Keep under 40% rule
        audio.play().catch(() => {});
    }, [playAmbient]);

    // Cleanup on unmount only if desired, but typically we want ambient to manually stop 
    // depending on the level routing. We'll leave explicit `stopAmbient` for the component to call.

    return {
        triggerHaptic,
        playSound,
        playAmbient,
        stopAmbient,
        dipAmbient,
        restoreAmbient,
        PACING
    };
};
