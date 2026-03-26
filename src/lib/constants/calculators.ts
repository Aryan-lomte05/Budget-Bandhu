export interface Calculator {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    category: 'investment' | 'loan' | 'tax' | 'retirement';
}

export const calculators: Calculator[] = [
    {
        id: 'sip',
        title: 'SIP Calculator',
        description: 'Calculate returns on systematic investment plans',
        icon: '📈',
        color: '#10B981',
        category: 'investment',
    },
    {
        id: 'compound',
        title: 'Compound Interest',
        description: 'See how your money grows over time',
        icon: '💰',
        color: '#3B82F6',
        category: 'investment',
    },
    {
        id: 'emi',
        title: 'EMI Calculator',
        description: 'Calculate monthly loan payments',
        icon: '🏠',
        color: '#F59E0B',
        category: 'loan',
    },
    {
        id: 'retirement',
        title: 'Retirement Planner',
        description: 'Plan your retirement corpus',
        icon: '🌅',
        color: '#EC4899',
        category: 'retirement',
    },
    {
        id: 'tax',
        title: 'Income Tax Calculator',
        description: 'Estimate your tax liability',
        icon: '💳',
        color: '#EF4444',
        category: 'tax',
    },
    {
        id: 'lumpsum',
        title: 'Lumpsum Calculator',
        description: 'Returns on one-time investments',
        icon: '💎',
        color: '#8B5CF6',
        category: 'investment',
    },
];
