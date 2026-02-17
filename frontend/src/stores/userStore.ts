import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    xp: number;
    gems: number;
    hearts: number;
    maxHearts: number;
    streak: number;
    firstName: string | null;
    hasSeenGreeting: boolean;

    // Actions
    addXp: (amount: number) => void;
    addGems: (amount: number) => void;
    spendGems: (amount: number) => boolean; // returns success
    loseHeart: () => void;
    refillHearts: () => void;
    setFirstName: (name: string | null) => void;
    setHasSeenGreeting: (seen: boolean) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            xp: 0,
            gems: 500, // Start with some currency
            hearts: 5,
            maxHearts: 5,
            streak: 1,
            firstName: null,
            hasSeenGreeting: false,

            addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

            addGems: (amount) => set((state) => ({ gems: state.gems + amount })),

            spendGems: (amount) => {
                const { gems } = get();
                if (gems >= amount) {
                    set({ gems: gems - amount });
                    return true;
                }
                return false;
            },

            loseHeart: () => set((state) => ({
                hearts: Math.max(0, state.hearts - 1)
            })),

            refillHearts: () => set((state) => ({ hearts: state.maxHearts })),

            setFirstName: (name) => set({ firstName: name }),

            setHasSeenGreeting: (seen) => set({ hasSeenGreeting: seen }),
        }),
        {
            name: 'veriquest-user-storage',
        }
    )
);
