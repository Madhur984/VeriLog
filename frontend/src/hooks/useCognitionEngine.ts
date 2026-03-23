import { useState, useCallback, useRef } from 'react';

/**
 * useCognitionEngine.ts
 * 
 * The "Thinking Engine" of Module 2. Tracks user interaction patterns
 * to adapt difficulty, feedback, and constraints.
 */

export type UserClassification = 'Advanced' | 'Learning' | 'Struggling' | 'Overconfident' | 'Passive';

export interface CognitionState {
    predictionAccuracy: number; // 0-1
    explorationScore: number;    // % of monitored interactions used
    hesitationTime: number;      // average delay before answering in ms
    confidenceDrift: number;     // trend (-1 declining, +1 improving)
    classification: UserClassification;
}

interface InternalStats {
    totalPredictions: number;
    correctPredictions: number;
    totalInteractions: number;
    interactionTimestamps: number[];
    predictionHistory: boolean[];
    monitoredElements: Set<string>;
    usedElements: Set<string>;
    startTime: number;
}

export const useCognitionEngine = (labId: string) => {
    const [state, setState] = useState<CognitionState>({
        predictionAccuracy: 1,
        explorationScore: 0,
        hesitationTime: 0,
        confidenceDrift: 0,
        classification: 'Learning'
    });

    const stats = useRef<InternalStats>({
        totalPredictions: 0,
        correctPredictions: 0,
        totalInteractions: 0,
        interactionTimestamps: [],
        predictionHistory: [],
        monitoredElements: new Set(),
        usedElements: new Set(),
        startTime: Date.now()
    });

    // ─── Register Interaction Targets ───────────────────────────────────────
    const registerTarget = useCallback((id: string) => {
        stats.current.monitoredElements.add(id);
    }, []);

    // ─── Record User Action ─────────────────────────────────────────────────
    const recordInteraction = useCallback((id: string) => {
        const now = Date.now();
        stats.current.totalInteractions++;
        stats.current.interactionTimestamps.push(now);
        stats.current.usedElements.add(id);
        updateCognition();
    }, []);

    // ─── Record Prediction ──────────────────────────────────────────────────
    const recordPrediction = useCallback((isCorrect: boolean, delayMs: number) => {
        stats.current.totalPredictions++;
        if (isCorrect) stats.current.correctPredictions++;
        stats.current.predictionHistory.push(isCorrect);
        
        // Update average hesitation
        const prevAvg = state.hesitationTime;
        const total = stats.current.totalPredictions;
        const newAvg = (prevAvg * (total - 1) + delayMs) / total;

        updateCognition(newAvg);
    }, [state.hesitationTime]);

    // ─── Update Logic ───────────────────────────────────────────────────────
    const updateCognition = (newHesitation?: number) => {
        const s = stats.current;
        
        // 1. Accuracy
        const predictionAccuracy = s.totalPredictions > 0 
            ? s.correctPredictions / s.totalPredictions 
            : 1;

        // 2. Exploration
        const explorationScore = s.monitoredElements.size > 0 
            ? s.usedElements.size / s.monitoredElements.size 
            : 0;

        // 3. Drift (weighted trend of last 5 predictions)
        const last5 = s.predictionHistory.slice(-5);
        let confidenceDrift = 0;
        if (last5.length > 1) {
            const trend = last5.map(v => v ? 1 : -1);
            confidenceDrift = trend.reduce((a, b) => a + b, 0) / last5.length;
        }

        // 4. Classification Logic
        let classification: UserClassification = 'Learning';
        
        const isFast = (newHesitation || state.hesitationTime) < 1500;
        const isAccurate = predictionAccuracy > 0.8;
        const isStruggling = predictionAccuracy < 0.4;
        const isLowInteraction = explorationScore < 0.3 && (Date.now() - s.startTime > 30000);

        if (isAccurate && s.totalPredictions > 3) {
            classification = isFast ? 'Advanced' : 'Learning';
        } else if (isStruggling) {
            classification = 'Struggling';
        }

        if (isFast && isStruggling) {
            classification = 'Overconfident';
        } else if (isLowInteraction) {
            classification = 'Passive';
        }

        setState(prev => ({
            predictionAccuracy,
            explorationScore,
            hesitationTime: newHesitation ?? prev.hesitationTime,
            confidenceDrift,
            classification
        }));

        // Persist to LocalStorage
        localStorage.setItem(`verilog_cognition_${labId}`, JSON.stringify({
            predictionAccuracy,
            explorationScore,
            classification,
            timestamp: Date.now()
        }));
    };

    return {
        ...state,
        registerTarget,
        recordInteraction,
        recordPrediction
    };
};
