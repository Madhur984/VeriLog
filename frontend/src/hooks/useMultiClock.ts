import { useState, useEffect } from 'react';

export interface MissionClockData {
  id: string;
  examName: string;
  targetDate: string;
  notes: string;
  color: 'cyan' | 'amber' | 'copper' | 'green';
}

const DEFAULT_CLOCK: MissionClockData = {
  id: 'gate-2027',
  examName: 'GATE 2027',
  targetDate: '2027-02-07T09:00:00+05:30',
  notes: "India's gateway to PSUs and IITs.",
  color: 'cyan'
};

export const useMultiClock = () => {
  const [clocks, setClocks] = useState<MissionClockData[]>(() => {
    const saved = localStorage.getItem('axe_mission_clocks');
    return saved ? JSON.parse(saved) : [DEFAULT_CLOCK];
  });

  useEffect(() => {
    localStorage.setItem('axe_mission_clocks', JSON.stringify(clocks));
  }, [clocks]);

  const addClock = (data: Omit<MissionClockData, 'id'>) => {
    if (clocks.length >= 3) return;
    const newClock = { ...data, id: Math.random().toString(36).substr(2, 9) };
    setClocks([...clocks, newClock]);
  };

  const removeClock = (id: string) => {
    if (clocks.length <= 1) return;
    setClocks(clocks.filter(c => c.id !== id));
  };

  const updateClock = (id: string, data: Partial<MissionClockData>) => {
    setClocks(clocks.map(c => c.id === id ? { ...c, ...data } : c));
  };

  return { clocks, addClock, removeClock, updateClock };
};
