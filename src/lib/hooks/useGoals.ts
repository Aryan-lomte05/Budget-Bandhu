import { useState } from 'react';
import { mockData } from '@/lib/api/mock-data';

export function useGoals() {
    const [goals, setGoals] = useState(mockData.goals);
    return { goals };
}
