export interface Challenge {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    xp: number;
    progress: number;
    target: number;
    deadline: string;
    active: boolean;
    completed: boolean;
}

export const weeklyChallenges: Challenge[] = [
    {
        id: 'save_500',
        title: 'Save ₹500 This Week',
        description: 'Add ₹500 to your savings by Sunday',
        icon: '💰',
        color: '#10B981',
        xp: 200,
        progress: 320,
        target: 500,
        deadline: '2025-12-28',
        active: true,
        completed: false,
    },
    {
        id: 'reduce_food_15',
        title: 'Reduce Food Spending',
        description: 'Spend 15% less on food this week',
        icon: '🍔',
        color: '#F59E0B',
        xp: 250,
        progress: 12,
        target: 15,
        deadline: '2025-12-28',
        active: true,
        completed: false,
    },
    {
        id: 'log_50_transactions',
        title: 'Log 50 Transactions',
        description: 'Record all your expenses this week',
        icon: '📝',
        color: '#3B82F6',
        xp: 150,
        progress: 37,
        target: 50,
        deadline: '2025-12-28',
        active: true,
        completed: false,
    },
    {
        id: 'no_impulse_buy',
        title: 'No Impulse Purchases',
        description: 'Avoid impulse buys for 7 days',
        icon: '🛍️',
        color: '#EF4444',
        xp: 300,
        progress: 5,
        target: 7,
        deadline: '2025-12-28',
        active: false,
        completed: false,
    },
];
