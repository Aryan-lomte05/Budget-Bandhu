export interface Lesson {
    id: string;
    title: string;
    duration: number; // minutes
    completed: boolean;
    type: 'video' | 'article' | 'quiz' | 'calculator';
    content?: string;
    videoUrl?: string;
    quiz?: {
        questions: Array<{
            question: string;
            options: string[];
            correctAnswer: number;
            explanation: string;
        }>;
    };
}

export interface Course {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number; // total minutes
    lessons: Lesson[];
    progress: number; // percentage
    enrolled: boolean;
}

export const courses: Course[] = [
    {
        id: 'compound-interest',
        title: 'Understanding Compound Interest',
        description: 'Learn how money grows exponentially over time',
        icon: '📈',
        color: '#10B981',
        difficulty: 'beginner',
        duration: 25,
        progress: 100,
        enrolled: true,
        lessons: [
            {
                id: 'ci_1',
                title: 'What is Compound Interest?',
                duration: 8,
                completed: true,
                type: 'video',
                content: 'Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn\'t, pays it. - Albert Einstein',
                videoUrl: 'https://example.com/video1',
            },
            {
                id: 'ci_2',
                title: 'The Power of Compounding',
                duration: 10,
                completed: true,
                type: 'article',
                content: '# The Power of Compounding\n\nCompound interest works by earning interest on your interest...',
            },
            {
                id: 'ci_3',
                title: 'Compound Interest Calculator',
                duration: 7,
                completed: true,
                type: 'calculator',
            },
        ],
    },
    {
        id: 'good-vs-bad-debt',
        title: 'Good Debt vs Bad Debt',
        description: 'Not all debt is created equal - learn the difference',
        icon: '💳',
        color: '#3B82F6',
        difficulty: 'beginner',
        duration: 20,
        progress: 60,
        enrolled: true,
        lessons: [
            {
                id: 'debt_1',
                title: 'What Makes Debt "Good"?',
                duration: 7,
                completed: true,
                type: 'video',
                content: 'Good debt is an investment that will grow in value or generate long-term income.',
            },
            {
                id: 'debt_2',
                title: 'The Debt Trap',
                duration: 8,
                completed: true,
                type: 'article',
            },
            {
                id: 'debt_3',
                title: 'Quiz: Test Your Knowledge',
                duration: 5,
                completed: false,
                type: 'quiz',
                quiz: {
                    questions: [
                        {
                            question: 'Which of the following is an example of "good debt"?',
                            options: [
                                'Credit card balance for shopping',
                                'Home loan for property',
                                'Personal loan for vacation',
                                'Payday loan',
                            ],
                            correctAnswer: 1,
                            explanation: 'A home loan is good debt because property appreciates over time.',
                        },
                        {
                            question: 'What is the ideal credit card utilization ratio?',
                            options: ['100%', '70%', 'Below 30%', '50%'],
                            correctAnswer: 2,
                            explanation: 'Keeping utilization below 30% improves your credit score.',
                        },
                    ],
                },
            },
        ],
    },
    {
        id: 'credit-scores',
        title: 'How Credit Scores Work',
        description: 'Master the factors that affect your creditworthiness',
        icon: '🎯',
        color: '#A78BFA',
        difficulty: 'intermediate',
        duration: 30,
        progress: 0,
        enrolled: false,
        lessons: [
            {
                id: 'cs_1',
                title: 'CIBIL Score Explained',
                duration: 10,
                completed: false,
                type: 'video',
            },
            {
                id: 'cs_2',
                title: '5 Factors That Affect Your Score',
                duration: 12,
                completed: false,
                type: 'article',
            },
            {
                id: 'cs_3',
                title: 'How to Improve Your Credit',
                duration: 8,
                completed: false,
                type: 'article',
            },
        ],
    },
    {
        id: 'mutual-funds',
        title: 'Mutual Funds 101',
        description: 'Start your investment journey with mutual funds',
        icon: '📊',
        color: '#F59E0B',
        difficulty: 'beginner',
        duration: 35,
        progress: 0,
        enrolled: false,
        lessons: [
            {
                id: 'mf_1',
                title: 'What are Mutual Funds?',
                duration: 10,
                completed: false,
                type: 'video',
            },
            {
                id: 'mf_2',
                title: 'Types of Mutual Funds',
                duration: 12,
                completed: false,
                type: 'article',
            },
            {
                id: 'mf_3',
                title: 'SIP vs Lumpsum',
                duration: 8,
                completed: false,
                type: 'article',
            },
            {
                id: 'mf_4',
                title: 'SIP Calculator',
                duration: 5,
                completed: false,
                type: 'calculator',
            },
        ],
    },
    {
        id: 'tax-planning',
        title: 'Tax Planning Basics',
        description: 'Save tax legally with smart planning',
        icon: '💰',
        color: '#EF4444',
        difficulty: 'intermediate',
        duration: 40,
        progress: 0,
        enrolled: false,
        lessons: [
            {
                id: 'tax_1',
                title: 'Understanding 80C Deductions',
                duration: 12,
                completed: false,
                type: 'video',
            },
            {
                id: 'tax_2',
                title: 'HRA & Home Loan Benefits',
                duration: 15,
                completed: false,
                type: 'article',
            },
            {
                id: 'tax_3',
                title: 'Tax Calculator',
                duration: 8,
                completed: false,
                type: 'calculator',
            },
            {
                id: 'tax_4',
                title: 'Quiz: Tax Savings',
                duration: 5,
                completed: false,
                type: 'quiz',
            },
        ],
    },
    {
        id: 'emergency-fund',
        title: 'Building an Emergency Fund',
        description: 'Prepare for life\'s unexpected expenses',
        icon: '🛡️',
        color: '#06B6D4',
        difficulty: 'beginner',
        duration: 20,
        progress: 0,
        enrolled: false,
        lessons: [
            {
                id: 'ef_1',
                title: 'Why You Need Emergency Funds',
                duration: 7,
                completed: false,
                type: 'video',
            },
            {
                id: 'ef_2',
                title: 'How Much to Save?',
                duration: 8,
                completed: false,
                type: 'article',
            },
            {
                id: 'ef_3',
                title: 'Where to Keep Emergency Money',
                duration: 5,
                completed: false,
                type: 'article',
            },
        ],
    },
    {
        id: 'retirement-planning',
        title: 'Retirement Planning 101',
        description: 'Start planning for your future today',
        icon: '🌅',
        color: '#EC4899',
        difficulty: 'advanced',
        duration: 50,
        progress: 0,
        enrolled: false,
        lessons: [
            {
                id: 'rp_1',
                title: 'The 4% Rule',
                duration: 12,
                completed: false,
                type: 'video',
            },
            {
                id: 'rp_2',
                title: 'NPS vs PPF vs EPF',
                duration: 18,
                completed: false,
                type: 'article',
            },
            {
                id: 'rp_3',
                title: 'Retirement Calculator',
                duration: 10,
                completed: false,
                type: 'calculator',
            },
            {
                id: 'rp_4',
                title: 'Final Assessment',
                duration: 10,
                completed: false,
                type: 'quiz',
            },
        ],
    },
    {
        id: 'budgeting-basics',
        title: 'Budgeting Fundamentals',
        description: 'Master the 50-30-20 rule and beyond',
        icon: '💵',
        color: '#8B5CF6',
        difficulty: 'beginner',
        duration: 25,
        progress: 0,
        enrolled: false,
        lessons: [
            {
                id: 'bb_1',
                title: 'The 50-30-20 Rule',
                duration: 10,
                completed: false,
                type: 'video',
            },
            {
                id: 'bb_2',
                title: 'Tracking Your Expenses',
                duration: 8,
                completed: false,
                type: 'article',
            },
            {
                id: 'bb_3',
                title: 'Budget Allocation Tool',
                duration: 7,
                completed: false,
                type: 'calculator',
            },
        ],
    },
];

export const getCourseById = (id: string) => courses.find(c => c.id === id);
