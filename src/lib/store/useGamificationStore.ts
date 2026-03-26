import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { achievements, Badge } from '@/lib/constants/achievements';
import { weeklyChallenges, Challenge } from '@/lib/constants/challenges';
import { calculateLevel, UserLevel } from '@/lib/utils/gamification';

interface GamificationState {
    totalXP: number;
    level: UserLevel;
    badges: Badge[];
    challenges: Challenge[];
    recentUnlocks: Badge[];
    addXP: (amount: number, reason: string) => void;
    unlockBadge: (badgeId: string) => void;
    updateChallengeProgress: (challengeId: string, progress: number) => void;
    clearRecentUnlocks: () => void;
}

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            totalXP: 2340, // Starting XP for demo
            level: calculateLevel(2340),
            badges: achievements,
            challenges: weeklyChallenges,
            recentUnlocks: [],

            addXP: (amount: number, reason: string) => {
                const newTotal = get().totalXP + amount;
                const oldLevel = get().level.level;
                const newLevel = calculateLevel(newTotal);

                set({
                    totalXP: newTotal,
                    level: newLevel,
                });

                // Check if leveled up
                if (newLevel.level > oldLevel) {
                    // Trigger level-up celebration
                    console.log(`🎉 LEVEL UP! You're now level ${newLevel.level}`);
                }
            },

            unlockBadge: (badgeId: string) => {
                const badges = get().badges.map(badge =>
                    badge.id === badgeId
                        ? { ...badge, unlocked: true, unlockedAt: new Date().toISOString() }
                        : badge
                );

                const unlockedBadge = badges.find(b => b.id === badgeId);

                if (unlockedBadge) {
                    set({
                        badges,
                        recentUnlocks: [...get().recentUnlocks, unlockedBadge],
                    });

                    // Add XP for unlocking
                    get().addXP(unlockedBadge.xp, `Unlocked ${unlockedBadge.title}`);
                }
            },

            updateChallengeProgress: (challengeId: string, progress: number) => {
                const challenges = get().challenges.map(challenge => {
                    if (challenge.id === challengeId) {
                        const completed = progress >= challenge.target;
                        return { ...challenge, progress, completed };
                    }
                    return challenge;
                });

                set({ challenges });
            },

            clearRecentUnlocks: () => set({ recentUnlocks: [] }),
        }),
        {
            name: 'budget-bandhu-gamification',
        }
    )
);
