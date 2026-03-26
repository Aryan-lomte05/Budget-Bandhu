import { useState } from 'react';
import { mockData } from '@/lib/api/mock-data';

export function useBudget() {
    const [budget, setBudget] = useState(mockData.budget);
    return { budget };
}
