/**
 * BudgetBandhu ML API Client
 * Connects frontend to Tanuj's FastAPI backend with all ML models
 * 
 * @author Tanuj
 * @date Jan 16, 2026
 */

import { apiClient, smartFetch } from './client';
import { mockData } from './mock-data';
import { ChatMessage } from '../types/chat';
import { useConfigStore } from '../store/useConfigStore';

// ===== API Configuration =====
const ML_API_BASE = process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8000';
const TRANSLATION_API = 'https://api.mymemory.translated.net/get';

// ===== Type Definitions =====

// User types (Mobile-First)
export interface User {
    id: string;           // Mobile number (12 digits: 91XXXXXXXXXX)
    mobile_number: string;
    name: string;
    email?: string;
    income: number;
    currency: string;
    created_at: string;
}

export interface UserCreateData {
    name: string;
    mobile_number: string;  // 12-digit format: 91XXXXXXXXXX
    password: string;
    income?: number;
}

// Translation types
export interface TranslationResult {
    translatedText: string;
    detectedLanguage?: string;
}

// OCR types  
export interface OCRResult {
    amount?: number;
    description?: string;
    date?: string;
    merchant?: string;
    rawText: string;
}

// Transaction types
export interface Transaction {
    id: string;
    user_id: string;
    date: string;
    amount: number;
    description: string;
    type: 'debit' | 'credit';
    category: string;
    category_confidence: number;
    is_anomaly: boolean;
    anomaly_severity: 'normal' | 'low' | 'medium' | 'high';
    notes?: string;
    created_at: string;
}

export interface TransactionUpload {
    date: string;
    amount: number;
    description: string;
    type?: 'debit' | 'credit';
    category?: string;
    notes?: string;
}

export interface TransactionStats {
    total_transactions: number;
    total_anomalies: number;
    anomaly_rate: number;
    category_breakdown: Record<string, { total: number; count: number }>;
}

// Dashboard types
export interface DashboardData {
    user: {
        id: string;
        name: string;
        income: number;
    };
    stats: {
        current_balance: number;
        month_spent: number;
        month_saved: number;
        savings_rate: number;
        financial_score: number;
        total_transactions: number;
    };
    category_breakdown: Record<string, { total: number; count: number }>;
    anomalies: {
        count: number;
        rate: number;
    };
    insights: Insight[];
    forecast: {
        horizon: string;
        predicted_savings: number;
        confidence: number;
    } | null;
    budget_summary: {
        total_allocated: number;
        total_spent: number;
    } | null;
    goals_summary: {
        total: number;
        total_saved: number;
        total_target: number;
    };
}

export interface Insight {
    type: string;
    title: string;
    description: string;
    severity: 'info' | 'success' | 'warning' | 'error';
    icon: string;
}

// Budget types
export interface BudgetAllocation {
    category: string;
    allocated: number;
    spent: number;
}

export interface Budget {
    id: string;
    user_id: string;
    total_income: number;
    allocations: BudgetAllocation[];
    savings_target: number;
    current_savings: number;
}

export interface BudgetRecommendation {
    category: string;
    current_allocation: number;
    actual_spent: number;
    recommended: number;
    multiplier: number;
    change: 'increase' | 'decrease' | 'maintain';
    reason: string;
}

// Goal types
export interface Goal {
    id: string;
    user_id: string;
    name: string;
    icon: string;
    target: number;
    current: number;
    deadline: string;
    priority: 'low' | 'medium' | 'high';
    color: string;
    progress_percentage: number;
    remaining: number;
    on_track: boolean;
    eta_days: number | null;
    milestones: Array<{ amount: number; reached: boolean; date: string | null }>;
}

export interface GoalCreate {
    user_id: string;
    name: string;
    icon?: string;
    target: number;
    deadline: string;
    priority?: 'low' | 'medium' | 'high';
    color?: string;
}

// Gamification types
export interface LevelInfo {
    level: number;
    current_xp: number;
    xp_to_next_level: number;
    title: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlocked_at: string | null;
    trigger_description: string;
}

export interface Gamification {
    id: string;
    user_id: string;
    level_info: LevelInfo;
    total_xp: number;
    badges: Badge[];
    challenges_completed: number;
    streak_days: number;
}

// ===== Helper Functions =====

/**
 * Centrally manages API calls with mock fallback.
 * Prevents "Failed to Fetch" console errors when backend is offline.
 */
async function callApi<T>(
    endpoint: string,
    fallbackData: T,
    options?: RequestInit
): Promise<T> {
    const { isMockMode } = useConfigStore.getState();

    // 1. Force Mock Mode if enabled globally
    if (isMockMode) {
        console.log(`🎭 [MOCK] Bypassing ${endpoint} (Mock Mode Active)`);
        return fallbackData;
    }

    try {
        const res = await fetch(`${ML_API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!res.ok) {
            console.warn(`⚠️ API returned ${res.status} for ${endpoint}. Falling back to mock.`);
            return fallbackData;
        }

        return await res.json();
    } catch (error) {
        // Log gently and return mock
        console.warn(`🌐 [OFFLINE] ${endpoint} unreachable. Using mock data.`, error);
        return fallbackData;
    }
}

// ===== Mock Data Transformers =====

const getMockDashboardData = (userId: string): DashboardData => ({
    user: {
        id: userId,
        name: mockData.user.name,
        income: mockData.user.monthlyIncome
    },
    stats: {
        current_balance: mockData.dashboardSummary.currentBalance,
        month_spent: mockData.dashboardSummary.monthSpent,
        month_saved: mockData.dashboardSummary.monthSaved,
        savings_rate: mockData.dashboardSummary.savingsRate * 100,
        financial_score: mockData.dashboardSummary.financialScore,
        total_transactions: mockData.transactions.length
    },
    category_breakdown: mockData.budget.allocations.reduce((acc, curr) => ({
        ...acc,
        [curr.category]: { total: curr.spent, count: 1 }
    }), {}),
    anomalies: {
        count: mockData.anomalies.length,
        rate: (mockData.anomalies.length / mockData.transactions.length) * 100
    },
    insights: mockData.insights.map(i => ({
        type: i.type,
        title: i.title,
        description: i.description,
        severity: i.severity as any,
        icon: i.icon
    })),
    forecast: {
        horizon: '30 days',
        predicted_savings: mockData.savingsForecast['30day'].predicted,
        confidence: mockData.savingsForecast['30day'].confidence
    },
    budget_summary: {
        total_allocated: mockData.budget.allocations.reduce((acc, curr) => acc + curr.allocated, 0),
        total_spent: mockData.budget.allocations.reduce((acc, curr) => acc + curr.spent, 0)
    },
    goals_summary: {
        total: mockData.goals.length,
        total_saved: mockData.goals.reduce((acc, curr) => acc + curr.current, 0),
        total_target: mockData.goals.reduce((acc, curr) => acc + curr.target, 0)
    }
});

/**
 * ML API Client - connects to FastAPI backend
 */
export const mlApi = {
    // ===== USER ENDPOINTS =====
    user: {
        register: async (data: UserCreateData): Promise<User> => {
            const payload = {
                name: data.name,
                password: data.password,
                mobile: data.mobile_number,
                income: data.income || 50000
            };
            return callApi<User>(
                '/api/v1/user/register',
                { ...mockData.user, id: data.mobile_number, mobile_number: data.mobile_number, income: mockData.user.monthlyIncome, currency: 'INR', created_at: new Date().toISOString() } as any,
                { method: 'POST', body: JSON.stringify(payload) }
            );
        },

        login: async (mobile_number: string, password: string): Promise<{ message: string; user: User }> => {
            return callApi<{ message: string; user: User }>(
                '/api/v1/user/login',
                { message: 'Logged in (Mock)', user: { ...mockData.user, mobile_number, id: mobile_number, income: mockData.user.monthlyIncome, currency: 'INR', created_at: new Date().toISOString() } as any },
                { method: 'POST', body: JSON.stringify({ mobile: mobile_number, password }) }
            );
        },

        getProfile: async (userId: string): Promise<User> => {
            return callApi<User>(
                `/api/v1/user/${userId}`,
                { ...mockData.user, id: userId, mobile_number: userId, income: mockData.user.monthlyIncome, currency: 'INR', created_at: new Date().toISOString() } as any
            );
        },

        updateIncome: async (userId: string, income: number): Promise<{ message: string }> => {
            return callApi<{ message: string }>(
                `/api/v1/user/${userId}/income?income=${income}`,
                { message: 'Income updated (Mock)' },
                { method: 'PUT' }
            );
        },
    },

    // ===== TRANSACTION ENDPOINTS =====
    transactions: {
        add: async (userId: string, transaction: TransactionUpload): Promise<{
            transaction_id: string;
            category: string;
            is_anomaly: boolean;
            anomaly_severity: string;
        }> => {
            return callApi<{ transaction_id: string; category: string; is_anomaly: boolean; anomaly_severity: string }>(
                `/api/v1/transactions?user_id=${userId}`,
                { transaction_id: 'txn_mock_' + Date.now(), category: transaction.category || 'Others', is_anomaly: false, anomaly_severity: 'normal' },
                { method: 'POST', body: JSON.stringify(transaction) }
            );
        },

        addBulk: async (userId: string, transactions: TransactionUpload[]): Promise<{
            inserted_count: number;
            categorization_stats: Record<string, number>;
            anomaly_stats: Record<string, number>;
        }> => {
            return callApi<{ inserted_count: number; categorization_stats: Record<string, number>; anomaly_stats: Record<string, number> }>(
                `/api/v1/transactions/bulk`,
                { inserted_count: transactions.length, categorization_stats: {}, anomaly_stats: {} },
                { method: 'POST', body: JSON.stringify({ user_id: userId, transactions }) }
            );
        },

        uploadCsv: async (userId: string, file: File): Promise<{
            inserted_count: number;
            categorization_stats: Record<string, number>;
            anomaly_stats: Record<string, number>;
        }> => {
            const formData = new FormData();
            formData.append('file', file);
            return callApi<{ inserted_count: number; categorization_stats: Record<string, number>; anomaly_stats: Record<string, number> }>(
                `/api/v1/transactions/upload-csv?user_id=${userId}`,
                { inserted_count: 50, categorization_stats: {}, anomaly_stats: {} },
                { method: 'POST', body: formData }
            );
        },

        getAll: async (userId: string, options?: {
            limit?: number;
            skip?: number;
            category?: string;
            anomaliesOnly?: boolean;
        }): Promise<Transaction[]> => {
            const params = new URLSearchParams();
            if (options?.limit) params.set('limit', options.limit.toString());
            const fallbackTransactions: Transaction[] = mockData.transactions.map(t => ({
                id: t.id,
                user_id: userId,
                date: t.date,
                amount: t.amount,
                description: t.merchant,
                type: t.type as any,
                category: t.category,
                category_confidence: 1.0,
                is_anomaly: t.isAnomaly,
                anomaly_severity: 'normal',
                created_at: t.date
            }));
            return callApi<Transaction[]>(
                `/api/v1/transactions/${userId}?${params}`,
                fallbackTransactions.slice(0, options?.limit || 100)
            );
        },

        getStats: async (userId: string): Promise<TransactionStats> => {
            return callApi<TransactionStats>(
                `/api/v1/transactions/${userId}/stats`,
                {
                    total_transactions: mockData.transactions.length,
                    total_anomalies: mockData.anomalies.length,
                    anomaly_rate: (mockData.anomalies.length / mockData.transactions.length) * 100,
                    category_breakdown: mockData.budget.allocations.reduce((acc, curr) => ({
                        ...acc,
                        [curr.category]: { total: curr.spent, count: 1 }
                    }), {})
                }
            );
        },

        getAnomalies: async (userId: string): Promise<Transaction[]> => {
            const anomTxns: Transaction[] = mockData.transactions.filter(t => t.isAnomaly).map(t => ({
                id: t.id,
                user_id: userId,
                date: t.date,
                amount: t.amount,
                description: t.merchant,
                type: t.type as any,
                category: t.category,
                category_confidence: 1.0,
                is_anomaly: true,
                anomaly_severity: 'high',
                created_at: t.date
            }));
            return callApi<Transaction[]>(
                `/api/v1/transactions/${userId}/anomalies`,
                anomTxns
            );
        },
    },

    // ===== DASHBOARD ENDPOINT =====
    dashboard: {
        get: async (userId: string): Promise<DashboardData> => {
            return callApi<DashboardData>(
                `/api/v1/dashboard/${userId}`,
                getMockDashboardData(userId)
            );
        },

        getSpendingTrend: async (userId: string, days: number = 30): Promise<Array<{ date: string; amount: number }>> => {
            return callApi<Array<{ date: string; amount: number }>>(
                `/api/v1/dashboard/${userId}/spending-trend?days=${days}`,
                mockData.spendingTrend as any
            );
        },
    },

    // ===== BUDGET ENDPOINTS =====
    budget: {
        get: async (userId: string): Promise<Budget> => {
            return callApi<Budget>(
                `/api/v1/budget/${userId}`,
                {
                    id: 'budget_mock',
                    user_id: userId,
                    total_income: mockData.budget.totalIncome,
                    allocations: mockData.budget.allocations as any,
                    savings_target: mockData.budget.savingsTarget,
                    current_savings: mockData.budget.currentSavings
                }
            );
        },

        update: async (userId: string, budget: {
            total_income: number;
            allocations: Array<{ category: string; allocated: number; spent?: number }>;
        }): Promise<{ message: string; total_allocated: number }> => {
            return callApi<{ message: string; total_allocated: number }>(
                `/api/v1/budget/${userId}`,
                { message: 'Budget updated (Mock)', total_allocated: budget.allocations.reduce((acc, curr) => acc + curr.allocated, 0) },
                { method: 'PUT', body: JSON.stringify({ ...budget, user_id: userId }) }
            );
        },

        getRecommendations: async (userId: string): Promise<{
            user_id: string;
            recommendations: BudgetRecommendation[];
            total_savings_potential: number;
            method: string;
        }> => {
            return callApi<{ user_id: string; recommendations: BudgetRecommendation[]; total_savings_potential: number; method: string }>(
                `/api/v1/budget/${userId}/recommend`,
                {
                    user_id: userId,
                    recommendations: [],
                    total_savings_potential: 5000,
                    method: 'Mock Model'
                }
            );
        },

        submitFeedback: async (userId: string, category: string, feedback: 'accepted' | 'rejected'): Promise<{ message: string }> => {
            return callApi<{ message: string }>(
                `/api/v1/budget/${userId}/feedback?category=${category}&feedback=${feedback}`,
                { message: 'Feedback submitted (Mock)' },
                { method: 'POST' }
            );
        },

        reset: async (userId: string): Promise<{ message: string; allocations: BudgetAllocation[] }> => {
            return callApi<{ message: string; allocations: BudgetAllocation[] }>(
                `/api/v1/budget/${userId}/reset`,
                { message: 'Budget reset (Mock)', allocations: mockData.budget.allocations as any },
                { method: 'POST' }
            );
        },
    },

    // ===== GOALS ENDPOINTS =====
    goals: {
        getAll: async (userId: string): Promise<Goal[]> => {
            const fallbackGoals: Goal[] = mockData.goals.map(g => ({
                id: g.id,
                user_id: userId,
                name: g.name,
                icon: g.icon,
                target: g.target,
                current: g.current,
                deadline: g.deadline,
                priority: g.priority as any,
                color: g.color || '#8B5CF6',
                progress_percentage: (g.current / g.target) * 100,
                remaining: g.target - g.current,
                on_track: true,
                eta_days: 90,
                milestones: g.milestones as any || []
            }));
            return callApi<Goal[]>(
                `/api/v1/goals/${userId}`,
                fallbackGoals
            );
        },

        create: async (goal: GoalCreate): Promise<{ goal_id: string; name: string; target: number }> => {
            return callApi<{ goal_id: string; name: string; target: number }>(
                `/api/v1/goals`,
                { goal_id: 'goal_mock_' + Date.now(), name: goal.name, target: goal.target },
                { method: 'POST', body: JSON.stringify(goal) }
            );
        },

        contribute: async (goalId: string, amount: number): Promise<{
            new_current: number;
            progress_percentage: number;
            milestones_reached: number[];
            is_complete: boolean;
            xp_earned: number;
        }> => {
            return callApi<{ new_current: number; progress_percentage: number; milestones_reached: number[]; is_complete: boolean; xp_earned: number }>(
                `/api/v1/goals/${goalId}/contribute`,
                { new_current: 50000 + amount, progress_percentage: 75, milestones_reached: [], is_complete: false, xp_earned: 50 },
                { method: 'PUT', body: JSON.stringify({ amount }) }
            );
        },

        getEta: async (goalId: string): Promise<{
            eta_days: number | null;
            days_until_deadline: number;
            on_track: boolean | null;
            message: string;
        }> => {
            return callApi<{ eta_days: number | null; days_until_deadline: number; on_track: boolean | null; message: string }>(
                `/api/v1/goals/${goalId}/eta`,
                { eta_days: 60, days_until_deadline: 120, on_track: true, message: 'On track!' }
            );
        },

        delete: async (goalId: string): Promise<{ message: string }> => {
            return callApi<{ message: string }>(
                `/api/v1/goals/${goalId}`,
                { message: 'Goal deleted (Mock)' },
                { method: 'DELETE' }
            );
        },
    },

    // ===== GAMIFICATION ENDPOINTS =====
    gamification: {
        get: async (userId: string): Promise<Gamification> => {
            return callApi<Gamification>(
                `/api/v1/gamification/${userId}`,
                {
                    id: 'gamify_mock',
                    user_id: userId,
                    level_info: { level: 5, current_xp: 450, xp_to_next_level: 1000, title: 'Budget Ninja' },
                    total_xp: 4450,
                    badges: [],
                    challenges_completed: 12,
                    streak_days: 15
                }
            );
        },

        addXp: async (userId: string, amount: number, reason: string): Promise<{
            new_total_xp: number;
            level_info: LevelInfo;
            leveled_up: boolean;
            new_level: number | null;
        }> => {
            return callApi<{ new_total_xp: number; level_info: LevelInfo; leveled_up: boolean; new_level: number | null }>(
                `/api/v1/gamification/${userId}/xp?amount=${amount}&reason=${reason}`,
                { new_total_xp: 4500, level_info: { level: 5, current_xp: 500, xp_to_next_level: 1000, title: 'Budget Ninja' }, leveled_up: false, new_level: null },
                { method: 'POST' }
            );
        },

        checkBadges: async (userId: string): Promise<{
            checked: number;
            newly_unlocked: Array<{ id: string; name: string; icon: string }>;
            xp_earned: number;
        }> => {
            return callApi<{ checked: number; newly_unlocked: Array<{ id: string; name: string; icon: string }>; xp_earned: number }>(
                `/api/v1/gamification/${userId}/check-badges`,
                { checked: 10, newly_unlocked: [], xp_earned: 0 },
                { method: 'POST' }
            );
        },

        getLeaderboard: async (userId: string, limit: number = 10): Promise<{
            leaderboard: Array<{
                rank: number;
                user_id: string;
                name: string;
                total_xp: number;
                level: number;
                is_current_user: boolean;
            }>;
            user_rank: { rank: number; total_xp: number; level: number } | null;
        }> => {
            return callApi<{ leaderboard: any[]; user_rank: any }>(
                `/api/v1/gamification/leaderboard/${userId}?limit=${limit}`,
                { leaderboard: [], user_rank: null }
            );
        },
    },

    // ===== HEALTH CHECK =====
    health: async (): Promise<{
        status: string;
        version: string;
        database: string;
        agent_available: boolean;
        ml_components: Record<string, string>;
    }> => {
        return callApi<any>(
            '/health',
            { status: 'healthy (mock)', version: '1.0.0', database: 'connected', agent_available: true, ml_components: {} }
        );
    },

    // ===== AI CHAT =====
    chat: {
        send: async (userId: string, query: string | { original_text: string, translated_text: string, language: string }, sessionId?: string): Promise<{
            response: string;
            session_id: string;
            confidence: number;
            context_used: {
                episodic_count: number;
                semantic_count: number;
            };
        }> => {
            const payload = typeof query === 'string' 
                ? { user_id: userId, query, session_id: sessionId }
                : { user_id: userId, ...query, query: query.translated_text, session_id: sessionId };

            return callApi<any>(
                '/api/v1/chat',
                { response: 'I am in mock mode. Please start the backend for real AI responses!', session_id: 'mock_session', confidence: 1.0, context_used: { episodic_count: 0, semantic_count: 0 } },
                { method: 'POST', body: JSON.stringify(payload) }
            );
        },
        getHistory: async (userId: string): Promise<ChatMessage[]> => {
            return callApi<ChatMessage[]>(
                `/api/v1/chat/history/${userId}`,
                mockData.chatHistory.map(m => ({ id: m.id, role: m.role as any, content: m.content, timestamp: m.timestamp }))
            );
        },
    },

    // ===== TRANSLATION SERVICE (Google Unofficial) =====
    translate: {
        text: async (text: string, targetLang: string = 'hi', sourceLang: string = 'auto'): Promise<TranslationResult> => {
            try {
                const encodedText = encodeURIComponent(text);
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodedText}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error('Translation failed');
                const data = await res.json();
                const translatedText = data[0]?.map((item: any[]) => item[0]).join('') || text;
                const detectedLanguage = data[2] || sourceLang;
                return { translatedText, detectedLanguage };
            } catch (error) {
                console.error('[Translation] Error:', error);
                return { translatedText: text, detectedLanguage: 'unknown' };
            }
        },
        languages: [
            { code: 'hi', name: 'हिंदी (Hindi)' },
            { code: 'mr', name: 'मराठी (Marathi)' },
            { code: 'ta', name: 'தமிழ் (Tamil)' },
            { code: 'te', name: 'తెలుగు (Telugu)' },
            { code: 'bn', name: 'বাংলা (Bengali)' },
            { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
            { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
            { code: 'ml', name: 'മലയാളം (Malayalam)' },
            { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
            { code: 'en', name: 'English' },
        ],
    },

    // ===== OCR SERVICE (Receipt/Bill Scanning) =====
    ocr: {
        scanReceipt: async (imageFile: File): Promise<OCRResult> => {
            const formData = new FormData();
            formData.append('image', imageFile);
            return callApi<OCRResult>(
                '/api/v1/ocr/scan-receipt',
                { rawText: 'OCR service unavailable (Mock Mode)' },
                { method: 'POST', body: formData }
            );
        },
        extractAmount: (text: string): number | null => {
            const patterns = [
                /₹\s*([\d,]+(?:\.\d{2})?)/,
                /Rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
                /INR\s*([\d,]+(?:\.\d{2})?)/i,
                /Total[:\s]*([\d,]+(?:\.\d{2})?)/i,
                /Amount[:\s]*([\d,]+(?:\.\d{2})?)/i,
            ];
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) return parseFloat(match[1].replace(/,/g, ''));
            }
            return null;
        },
    },
};
