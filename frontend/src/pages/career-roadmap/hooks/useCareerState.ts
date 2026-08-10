import { useState, useEffect } from 'react';

interface CareerState {
  unlockedNodes: string[];
  quizScores: Record<string, number>;
  simulationHistory: string[];
  dailyCalibration: {
    lastCompleted: string | null;
    streak: number;
    points: number;
  };
  fiscalPrefs: {
    country: string;
    expYears: number;
  };
  completedNextActions: string[];
}

const DEFAULT_STATE: CareerState = {
  unlockedNodes: ['start'],
  quizScores: {},
  simulationHistory: [],
  dailyCalibration: {
    lastCompleted: null,
    streak: 0,
    points: 0
  },
  fiscalPrefs: {
    country: 'India',
    expYears: 0
  },
  completedNextActions: []
};

export function useCareerState() {
  const [state, setState] = useState<CareerState>(() => {
    const saved = localStorage.getItem('bfb_career_v3_state');
    try {
      return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    localStorage.setItem('bfb_career_v3_state', JSON.stringify(state));
  }, [state]);

  const unlockNode = (nodeId: string) => {
    setState(prev => ({
      ...prev,
      unlockedNodes: prev.unlockedNodes.includes(nodeId) 
        ? prev.unlockedNodes 
        : [...prev.unlockedNodes, nodeId]
    }));
  };

  const updateQuizScore = (domainId: string, score: number) => {
    setState(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [domainId]: Math.max(prev.quizScores[domainId] || 0, score)
      }
    }));
  };

  const recordSimulation = (outcomeId: string) => {
    setState(prev => ({
      ...prev,
      simulationHistory: [...prev.simulationHistory, outcomeId]
    }));
  };

  const completeCalibration = (points: number) => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
      const isStreak = prev.dailyCalibration.lastCompleted === 
        new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      return {
        ...prev,
        dailyCalibration: {
          lastCompleted: today,
          streak: isStreak ? prev.dailyCalibration.streak + 1 : 1,
          points: prev.dailyCalibration.points + points
        }
      };
    });
  };

  const setFiscalPrefs = (country: string, expYears: number) => {
    setState(prev => ({
      ...prev,
      fiscalPrefs: { country, expYears }
    }));
  };

  const toggleNextAction = (actionId: string) => {
    setState(prev => ({
      ...prev,
      completedNextActions: prev.completedNextActions.includes(actionId)
        ? prev.completedNextActions.filter((id) => id !== actionId)
        : [...prev.completedNextActions, actionId]
    }));
  };

  const generateShareLink = () => {
    const data = JSON.stringify(state);
    const encoded = btoa(data);
    return `${window.location.origin}${window.location.pathname}?state=${encoded}`;
  };

  const loadFromShareLink = (encoded: string) => {
    try {
      const decoded = atob(encoded);
      const newState = JSON.parse(decoded);
      setState(newState);
      return true;
    } catch (e) {
      console.error('Failed to load shared state', e);
      return false;
    }
  };

  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [nodeVisitHistory, setNodeVisitHistory] = useState<string[]>([]);

  const addToVisitHistory = (itemId: string) => {
    setNodeVisitHistory(prev => {
      if (prev[prev.length - 1] === itemId) return prev;
      return [...prev, itemId];
    });
  };

  return {
    ...state,
    focusedNodeId,
    setFocusedNodeId,
    nodeVisitHistory,
    addToVisitHistory,
    unlockNode,
    updateQuizScore,
    recordSimulation,
    completeCalibration,
    setFiscalPrefs,
    toggleNextAction,
    generateShareLink,
    loadFromShareLink
  };
}
