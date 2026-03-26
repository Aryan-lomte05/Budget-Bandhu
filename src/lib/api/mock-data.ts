// src/lib/api/mock-data.ts
import { addDays, subDays, format } from 'date-fns';

export const mockData = {
    // User profile
    user: {
        id: 'user_1',
        name: 'Aryan Lomte',
        email: 'aryan@example.com',
        avatar: '/avatars/aryan.jpg',
        monthlyIncome: 50000,
        createdAt: '2024-01-15T00:00:00Z',
        preferences: {
            currency: 'INR',
            language: 'en',
            notifications: true,
        },
    },

    // Dashboard summary
    dashboardSummary: {
        currentBalance: 42340,
        monthSpent: 28650,
        monthSaved: 21350,
        savingsRate: 0.427, // 42.7%
        budgetAdherence: 0.89, // 89%
        financialScore: 782, // out of 1000
        trend: {
            balance: '+12%',
            spending: '-8%',
            savings: '+15%',
        },
    },

    // Spending Trend (Last 30 days)
    spendingTrend: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
            date: format(date, 'dd MMM'),
            amount: 2000 + Math.floor(Math.abs(Math.sin(i * 0.5)) * 5000) + (i % 7 === 0 ? 5000 : 0) // Deterministic pattern
        };
    }),

    // Transactions (100+ samples)
    transactions: [
        {
            id: 'txn_001',
            date: format(new Date(), 'yyyy-MM-dd'),
            merchant: 'SWIGGY FOOD ORDER',
            amount: 450,
            category: 'Food & Dining',
            type: 'debit',
            balance: 42340,
            notes: 'Dinner with friends',
            isAnomaly: false,
            receipt: null,
        },
        {
            id: 'txn_002',
            date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
            merchant: 'OLA CABS RIDE',
            amount: 180,
            category: 'Transport',
            type: 'debit',
            balance: 42790,
            notes: '',
            isAnomaly: false,
            receipt: null,
        },
        {
            id: 'txn_003',
            date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
            merchant: 'SALARY CREDIT',
            amount: 50000,
            category: 'Income',
            type: 'credit',
            balance: 42970,
            notes: 'Monthly salary',
            isAnomaly: false,
            receipt: null,
        },
        {
            id: 'txn_004',
            date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
            merchant: 'AMAZON SHOPPING',
            amount: 2340,
            category: 'Shopping',
            type: 'debit',
            balance: -7030,
            notes: 'Laptop accessories',
            isAnomaly: false,
            receipt: '/receipts/amazon_001.jpg',
        },
        {
            id: 'txn_005',
            date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
            merchant: 'NETFLIX SUBSCRIPTION',
            amount: 649,
            category: 'Entertainment',
            type: 'debit',
            balance: -4690,
            notes: 'Monthly subscription',
            isAnomaly: false,
            receipt: null,
        },
        {
            id: 'txn_006',
            date: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
            merchant: 'UNKNOWN CHARGE',
            amount: 15000,
            category: 'Others',
            type: 'debit',
            balance: -4041,
            notes: '',
            isAnomaly: true, // ⚠️ Flagged by Isolation Forest
            receipt: null,
        },
        // ... Generate 100+ more transactions
    ].concat(
        // Auto-generate more transactions
        Array.from({ length: 94 }, (_, i) => ({
            id: `txn_${String(i + 7).padStart(3, '0')}`,
            date: format(subDays(new Date(), Math.floor(i / 3)), 'yyyy-MM-dd'),
            merchant: [
                'FLIPKART', 'ZOMATO', 'UBER', 'BIGBASKET', 'BOOKMYSHOW',
                'AIRTEL BILL', 'ELECTRICITY BILL', 'RENT PAYMENT',
                'GROWW SIP', 'ZERODHA', 'PHARMACY', 'GYM MEMBERSHIP'
            ][i % 12],
            amount: Math.floor(Math.random() * 3000) + 100,
            category: [
                'Shopping', 'Food & Dining', 'Transport', 'Groceries', 'Entertainment',
                'Bills & Utilities', 'Bills & Utilities', 'Bills & Utilities',
                'Investments', 'Investments', 'Healthcare', 'Personal Care'
            ][i % 12],
            type: 'debit' as const,
            balance: 50000 - (i * 500),
            notes: '',
            isAnomaly: Math.random() > 0.95, // 5% anomaly rate
            receipt: null,
        }))
    ),

    // Budget allocations
    budget: {
        totalIncome: 50000,
        allocations: [
            { category: 'Food & Dining', allocated: 8000, spent: 6540, percentage: 16 },
            { category: 'Transport', allocated: 3000, spent: 2890, percentage: 6 },
            { category: 'Shopping', allocated: 5000, spent: 5420, percentage: 10 },
            { category: 'Bills & Utilities', allocated: 6000, spent: 5800, percentage: 12 },
            { category: 'Entertainment', allocated: 2000, spent: 1650, percentage: 4 },
            { category: 'Groceries', allocated: 4000, spent: 3780, percentage: 8 },
            { category: 'Healthcare', allocated: 2000, spent: 890, percentage: 4 },
            { category: 'Education', allocated: 1000, spent: 0, percentage: 2 },
            { category: 'EMI/Loans', allocated: 5000, spent: 5000, percentage: 10 },
            { category: 'Insurance', allocated: 2000, spent: 2000, percentage: 4 },
            { category: 'Investments', allocated: 5000, spent: 5000, percentage: 10 },
            { category: 'Others', allocated: 2000, spent: 680, percentage: 4 },
        ],
        savingsTarget: 10000,
        currentSavings: 21350,
    },

    // Financial goals
    goals: [
        {
            id: 'goal_001',
            name: 'Emergency Fund',
            icon: '🛡️',
            target: 150000,
            current: 67500,
            deadline: '2025-12-31',
            priority: 'high',
            color: '#10B981',
            milestones: [
                { amount: 50000, reached: true, date: '2024-06-15' },
                { amount: 100000, reached: false, date: null },
                { amount: 150000, reached: false, date: null },
            ],
        },
        {
            id: 'goal_002',
            name: 'Europe Trip',
            icon: '✈️',
            target: 200000,
            current: 45000,
            deadline: '2026-06-30',
            priority: 'medium',
            color: '#3B82F6',
            milestones: [],
        },
        {
            id: 'goal_003',
            name: 'MacBook Pro',
            icon: '💻',
            target: 180000,
            current: 92000,
            deadline: '2025-03-31',
            priority: 'high',
            color: '#A78BFA',
            milestones: [],
        },
    ],

    // LSTM Savings Forecast
    savingsForecast: {
        '7day': {
            predicted: 22450,
            confidence: 0.91,
            trend: 'up',
            change: 1100,
        },
        '30day': {
            predicted: 28900,
            confidence: 0.87,
            trend: 'up',
            change: 7550,
        },
        '90day': {
            predicted: 45600,
            confidence: 0.74,
            trend: 'up',
            change: 24250,
        },
    },

    // Insights & patterns
    insights: [
        {
            id: 'insight_001',
            type: 'spending_spike',
            title: 'Shopping increased 40% this week',
            description: 'You spent ₹5,420 on shopping vs usual ₹3,800. Consider reducing online purchases.',
            severity: 'warning',
            icon: '⚠️',
            date: format(new Date(), 'yyyy-MM-dd'),
        },
        {
            id: 'insight_002',
            type: 'achievement',
            title: 'Budget Ninja Badge Earned! 🥷',
            description: 'Stayed under budget for 5 consecutive months. Keep it up!',
            severity: 'success',
            icon: '🏆',
            date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
        },
        {
            id: 'insight_003',
            type: 'forecast',
            title: 'On track to save ₹45K in 90 days',
            description: 'LSTM model predicts you\'ll exceed your quarterly savings goal by ₹15K.',
            severity: 'info',
            icon: '📈',
            date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
        },
    ],

    // AI Chat history
    chatHistory: [
        {
            id: 'msg_001',
            role: 'user',
            content: 'Can I afford a ₹15,000 laptop?',
            timestamp: new Date().toISOString(),
        },
        {
            id: 'msg_002',
            role: 'assistant',
            content: 'Based on your current balance of ₹42,340 and upcoming bills of ₹8,500, you can afford it! However, I recommend waiting 2 weeks for your next salary to maintain your emergency fund target. Your call, buddy! 🤝',
            timestamp: new Date().toISOString(),
        },
    ],

    // Financial History (Time Machine)
    financialHistory: {
        month: {
            period: '1 Month',
            label: 'vs Last Month',
            current: { income: 85000, expenses: 42500, savings: 42500, balance: 245680 },
            past: { income: 80000, expenses: 48000, savings: 32000, balance: 203180 },
        },
        quarter: {
            period: '3 Months',
            label: 'vs Last Quarter',
            current: { income: 255000, expenses: 127500, savings: 127500, balance: 245680 },
            past: { income: 240000, expenses: 144000, savings: 96000, balance: 118180 },
        },
        year: {
            period: '1 Year',
            label: 'vs Last Year',
            current: { income: 1020000, expenses: 510000, savings: 510000, balance: 245680 },
            past: { income: 960000, expenses: 576000, savings: 384000, balance: 118180 },
        },
    },

    // Tax Optimization Data
    tax: {
        maxLimit80C: 150000,
        investments: [
            {
                id: '1',
                category: 'PPF',
                amount: 45000,
                limit: 150000,
                description: 'Public Provident Fund',
            },
            {
                id: '2',
                category: 'ELSS',
                amount: 30000,
                limit: 150000,
                description: 'Equity Linked Savings Scheme',
            },
            {
                id: '3',
                category: 'Life Insurance',
                amount: 25000,
                limit: 150000,
                description: 'Premium paid',
            },
            {
                id: '4',
                category: 'Home Loan',
                amount: 15000,
                limit: 150000,
                description: 'Principal repayment',
            },
            {
                id: '5',
                category: 'Tuition Fees',
                amount: 8000,
                limit: 150000,
                description: 'Children education',
            },
        ]
    },

    anomalies: [
        {
            id: 'anom_001',
            transaction_id: 'txn_006',
            score: -0.73, // Isolation Forest score
            reason: 'Amount 5x higher than average spending',
            severity: 'high',
            date: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
        },
    ],
} as const;

export type MockDataKey = keyof typeof mockData;
