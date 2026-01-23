import { create } from 'zustand';

type AppScreen = 'video' | 'welcome' | 'act1' | 'act2' | 'act3' | 'act4' | 'login';

interface UIState {
    currentScreen: AppScreen;
    setScreen: (screen: AppScreen) => void;
    isMuted: boolean;
    toggleMute: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    currentScreen: 'video',
    setScreen: (screen) => set({ currentScreen: screen }),
    isMuted: false,
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));