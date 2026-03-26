export interface UserLevel {
    level: number;
    currentXP: number;
    xpToNextLevel: number;
    totalXP: number;
    title: string;
    benefits: string[];
}

export const levelTitles = [
    { min: 1, max: 5, title: 'Beginner' },
    { min: 6, max: 10, title: 'Learner' },
    { min: 11, max: 15, title: 'Explorer' },
    { min: 16, max: 20, title: 'Practitioner' },
    { min: 21, max: 25, title: 'Expert' },
    { min: 26, max: 30, title: 'Master' },
    { min: 31, max: 40, title: 'Grandmaster' },
    { min: 41, max: 50, title: 'Legend' },
];

export function calculateLevel(totalXP: number): UserLevel {
    // XP required for each level increases exponentially
    // Level 1: 0 XP, Level 2: 100 XP, Level 3: 250 XP, etc.
    const xpCurve = (level: number) => Math.floor(100 * Math.pow(level, 1.5));

    let level = 1;
    let cumulativeXP = 0;

    while (cumulativeXP + xpCurve(level) <= totalXP && level < 50) {
        cumulativeXP += xpCurve(level);
        level++;
    }

    const currentXP = totalXP - cumulativeXP;
    const xpToNextLevel = xpCurve(level);

    const titleRange = levelTitles.find(t => level >= t.min && level <= t.max);
    const title = titleRange?.title || 'Legend';

    const benefits = getLevelBenefits(level);

    return {
        level,
        currentXP,
        xpToNextLevel,
        totalXP,
        title,
        benefits,
    };
}

function getLevelBenefits(level: number): string[] {
    const benefits: string[] = [];

    if (level >= 5) benefits.push('Unlock AI Financial Advisor');
    if (level >= 10) benefits.push('Custom budget categories');
    if (level >= 15) benefits.push('Advanced analytics dashboard');
    if (level >= 20) benefits.push('Export to Excel/PDF');
    if (level >= 25) benefits.push('Premium investment insights');
    if (level >= 30) benefits.push('Multi-currency support');
    if (level >= 40) benefits.push('Exclusive Legend badge');

    return benefits;
}

export function getXPForAction(action: string): number {
    const xpTable: Record<string, number> = {
        'add_transaction': 5,
        'add_goal': 50,
        'complete_goal': 500,
        'stay_under_budget': 100,
        'save_money': 10,
        'cancel_subscription': 150,
        'login_daily': 20,
        'complete_challenge': 200,
        'invite_friend': 300,
    };

    return xpTable[action] || 0;
}
