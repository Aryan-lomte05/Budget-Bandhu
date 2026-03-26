import { create } from 'zustand';

interface BudgetState {
    budget: any;
    setBudget: (budget: any) => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
    budget: null,
    setBudget: (budget) => set({ budget }),
}));
