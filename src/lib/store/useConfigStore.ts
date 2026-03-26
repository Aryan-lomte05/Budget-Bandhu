// src/lib/store/useConfigStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState {
    isMockMode: boolean;
    toggleMockMode: () => void;
    setMockMode: (enabled: boolean) => void;
}

export const useConfigStore = create<ConfigState>()(
    persist(
        (set) => ({
            isMockMode: true, // Start with mock by default for dev

            toggleMockMode: () =>
                set((state) => ({ isMockMode: !state.isMockMode })),

            setMockMode: (enabled: boolean) =>
                set({ isMockMode: enabled }),
        }),
        {
            name: 'budget-bandhu-config',
        }
    )
);
