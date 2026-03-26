import { create } from 'zustand';

interface TransactionState {
    transactions: any[];
    addTransaction: (txn: any) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
    transactions: [],
    addTransaction: (txn) => set((state) => ({ transactions: [...state.transactions, txn] })),
}));
