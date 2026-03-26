import { useState, useEffect } from 'react';
import { mockData } from '@/lib/api/mock-data';

export function useTransactions() {
    const [transactions, setTransactions] = useState(mockData.transactions);
    const [loading, setLoading] = useState(false);

    return { transactions, loading };
}
