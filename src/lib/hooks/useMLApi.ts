/**
 * React hooks for ML API data fetching
 * Provides easy-to-use hooks for components
 */

import { useState, useEffect, useCallback } from 'react';
import {
    mlApi,
    DashboardData,
    Transaction,
    Budget,
    BudgetRecommendation,
    Goal,
    Gamification,
    TransactionStats
} from '../api/ml-api';

// ===== DASHBOARD HOOK =====
export function useDashboard(userId: string | null) {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async (signal?: AbortSignal) => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            // Passing signal to the API call if supported, though here it's a wrapper
            const dashboardData = await mlApi.dashboard.get(userId);
            if (signal?.aborted) return;
            setData(dashboardData);
        } catch (err) {
            if (signal?.aborted) return;
            setError(err instanceof Error ? err.message : 'Failed to fetch dashboard');
            console.error('[useDashboard] Error:', err);
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        const controller = new AbortController();
        fetchDashboard(controller.signal);
        return () => controller.abort();
    }, [fetchDashboard]);

    return { data, loading, error, refetch: fetchDashboard };
}

// ===== TRANSACTIONS HOOK =====
export function useTransactions(userId: string | null, options?: {
    limit?: number;
    category?: string;
    anomaliesOnly?: boolean;
}) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState<TransactionStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(async (signal?: AbortSignal) => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const [txns, txnStats] = await Promise.all([
                mlApi.transactions.getAll(userId, options),
                mlApi.transactions.getStats(userId)
            ]);
            if (signal?.aborted) return;
            setTransactions(txns);
            setStats(txnStats);
        } catch (err) {
            if (signal?.aborted) return;
            setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
            console.error('[useTransactions] Error:', err);
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    }, [userId, options?.limit, options?.category, options?.anomaliesOnly]);

    useEffect(() => {
        const controller = new AbortController();
        fetchTransactions(controller.signal);
        return () => controller.abort();
    }, [fetchTransactions]);

    // Add transaction
    const addTransaction = useCallback(async (transaction: Parameters<typeof mlApi.transactions.add>[1]) => {
        if (!userId) return;
        try {
            const result = await mlApi.transactions.add(userId, transaction);
            await fetchTransactions(); // Refresh
            return result;
        } catch (err) {
            throw err;
        }
    }, [userId, fetchTransactions]);

    // Upload CSV
    const uploadCsv = useCallback(async (file: File) => {
        if (!userId) return;
        try {
            const result = await mlApi.transactions.uploadCsv(userId, file);
            await fetchTransactions(); // Refresh
            return result;
        } catch (err) {
            throw err;
        }
    }, [userId, fetchTransactions]);

    return {
        transactions,
        stats,
        loading,
        error,
        refetch: fetchTransactions,
        addTransaction,
        uploadCsv
    };
}

// ===== BUDGET HOOK =====
export function useBudget(userId: string | null) {
    const [budget, setBudget] = useState<Budget | null>(null);
    const [recommendations, setRecommendations] = useState<BudgetRecommendation[]>([]);
    const [savingsPotential, setSavingsPotential] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBudget = useCallback(async (signal?: AbortSignal) => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const [budgetData, recsData] = await Promise.all([
                mlApi.budget.get(userId),
                mlApi.budget.getRecommendations(userId).catch(() => null)
            ]);
            if (signal?.aborted) return;
            setBudget(budgetData);
            if (recsData) {
                setRecommendations(recsData.recommendations);
                setSavingsPotential(recsData.total_savings_potential);
            }
        } catch (err) {
            if (signal?.aborted) return;
            setError(err instanceof Error ? err.message : 'Failed to fetch budget');
            console.error('[useBudget] Error:', err);
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        const controller = new AbortController();
        fetchBudget(controller.signal);
        return () => controller.abort();
    }, [fetchBudget]);

    // Update budget
    const updateBudget = useCallback(async (allocations: Array<{ category: string; allocated: number }>) => {
        if (!userId || !budget) return;
        try {
            await mlApi.budget.update(userId, {
                total_income: budget.total_income,
                allocations: allocations.map(a => ({ ...a, spent: 0 }))
            });
            await fetchBudget(); // Refresh
        } catch (err) {
            throw err;
        }
    }, [userId, budget, fetchBudget]);

    // Submit recommendation feedback
    const submitFeedback = useCallback(async (category: string, feedback: 'accepted' | 'rejected') => {
        if (!userId) return;
        try {
            await mlApi.budget.submitFeedback(userId, category, feedback);
            await fetchBudget(); // Refresh to get updated recommendations
        } catch (err) {
            throw err;
        }
    }, [userId, fetchBudget]);

    return {
        budget,
        recommendations,
        savingsPotential,
        loading,
        error,
        refetch: fetchBudget,
        updateBudget,
        submitFeedback
    };
}

// ===== GOALS HOOK =====
export function useGoals(userId: string | null) {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGoals = useCallback(async (signal?: AbortSignal) => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const goalsData = await mlApi.goals.getAll(userId);
            if (signal?.aborted) return;
            setGoals(goalsData);
        } catch (err) {
            if (signal?.aborted) return;
            setError(err instanceof Error ? err.message : 'Failed to fetch goals');
            console.error('[useGoals] Error:', err);
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        const controller = new AbortController();
        fetchGoals(controller.signal);
        return () => controller.abort();
    }, [fetchGoals]);

    // Create goal
    const createGoal = useCallback(async (goal: Omit<Parameters<typeof mlApi.goals.create>[0], 'user_id'>) => {
        if (!userId) return;
        try {
            const result = await mlApi.goals.create({ ...goal, user_id: userId });
            await fetchGoals(); // Refresh
            return result;
        } catch (err) {
            throw err;
        }
    }, [userId, fetchGoals]);

    // Contribute to goal
    const contributeToGoal = useCallback(async (goalId: string, amount: number) => {
        try {
            const result = await mlApi.goals.contribute(goalId, amount);
            await fetchGoals(); // Refresh
            return result;
        } catch (err) {
            throw err;
        }
    }, [fetchGoals]);

    // Delete goal
    const deleteGoal = useCallback(async (goalId: string) => {
        try {
            await mlApi.goals.delete(goalId);
            await fetchGoals(); // Refresh
        } catch (err) {
            throw err;
        }
    }, [fetchGoals]);

    return {
        goals,
        loading,
        error,
        refetch: fetchGoals,
        createGoal,
        contributeToGoal,
        deleteGoal
    };
}

// ===== GAMIFICATION HOOK =====
export function useGamification(userId: string | null) {
    const [gamification, setGamification] = useState<Gamification | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGamification = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await mlApi.gamification.get(userId);
            setGamification(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch gamification');
            console.error('[useGamification] Error:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchGamification();
    }, [fetchGamification]);

    // Check badges
    const checkBadges = useCallback(async () => {
        if (!userId) return;
        try {
            const result = await mlApi.gamification.checkBadges(userId);
            await fetchGamification(); // Refresh
            return result;
        } catch (err) {
            throw err;
        }
    }, [userId, fetchGamification]);

    return {
        gamification,
        loading,
        error,
        refetch: fetchGamification,
        checkBadges
    };
}

// ===== API HEALTH HOOK =====
export function useApiHealth() {
    const [healthy, setHealthy] = useState<boolean | null>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const result = await mlApi.health();
                setHealthy(result.status === 'healthy');
            } catch {
                setHealthy(false);
            } finally {
                setChecking(false);
            }
        };
        checkHealth();
    }, []);

    return { healthy, checking };
}
