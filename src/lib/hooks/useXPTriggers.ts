'use client';

import { useEffect } from 'react';
import { useGamificationStore } from '@/lib/store/useGamificationStore';
import { toast } from 'react-hot-toast';

export function useXPTriggers() {
    const { addXP } = useGamificationStore();

    // Transaction created
    const onTransactionCreated = (amount: number) => {
        const xp = 10;
        addXP(xp, 'Transaction logged');
        toast.success(`+${xp} XP for logging a transaction! 📝`);
    };

    // Goal contribution
    const onGoalContribution = (amount: number) => {
        const xp = Math.min(Math.floor(amount / 1000), 50); // 1 XP per ₹1000, max 50
        if (xp > 0) {
            addXP(xp, 'Goal contribution');
            toast.success(`+${xp} XP for contributing to your goal! 🎯`);
        }
    };

    // Goal completed
    const onGoalCompleted = () => {
        const xp = 100;
        addXP(xp, 'Goal completed');
        toast.success(`+${xp} XP for completing a goal! 🎉`);
    };

    // Budget set
    const onBudgetSet = () => {
        const xp = 25;
        addXP(xp, 'Budget created');
        toast.success(`+${xp} XP for setting a budget! 💰`);
    };

    // Daily login streak
    const onDailyLogin = () => {
        const xp = 5;
        addXP(xp, 'Daily login');
        // Don't show toast for this one (too frequent)
    };

    // Profile completed
    const onProfileCompleted = () => {
        const xp = 50;
        addXP(xp, 'Profile completed');
        toast.success(`+${xp} XP for completing your profile! 👤`);
    };

    // Spending under budget
    const onUnderBudget = () => {
        const xp = 30;
        addXP(xp, 'Under budget');
        toast.success(`+${xp} XP for staying under budget! 🎊`);
    };

    // Emergency fund milestone
    const onEmergencyFundMilestone = (months: number) => {
        const xp = months * 20; // 20 XP per month covered
        addXP(xp, `${months}-month emergency fund`);
        toast.success(`+${xp} XP for ${months}-month emergency fund! 🛡️`);
    };

    // First time actions
    const onFirstTransaction = () => {
        const xp = 50;
        addXP(xp, 'First transaction');
        toast.success(`+${xp} XP for your first transaction! 🎊`);
    };

    const onFirstGoal = () => {
        const xp = 50;
        addXP(xp, 'First goal created');
        toast.success(`+${xp} XP for creating your first goal! 🎯`);
    };

    return {
        onTransactionCreated,
        onGoalContribution,
        onGoalCompleted,
        onBudgetSet,
        onDailyLogin,
        onProfileCompleted,
        onUnderBudget,
        onEmergencyFundMilestone,
        onFirstTransaction,
        onFirstGoal,
    };
}
