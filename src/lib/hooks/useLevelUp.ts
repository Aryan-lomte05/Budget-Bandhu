'use client';

import { useEffect, useState } from 'react';
import { useGamificationStore } from '@/lib/store/useGamificationStore';

export function useLevelUp() {
    const [showModal, setShowModal] = useState(false);
    const [levelData, setLevelData] = useState({
        newLevel: 1,
        xpEarned: 0,
        xpToNextLevel: 100,
        rewards: [] as string[],
    });

    useEffect(() => {
        // Listen for level changes
        const unsubscribe = useGamificationStore.subscribe((state, prevState) => {
            if (state.level.level > prevState.level.level) {
                // Level up detected!
                const rewards = getLevelRewards(state.level.level);

                setLevelData({
                    newLevel: state.level.level,
                    xpEarned: state.level.currentXP, // FIXED: Use currentXP instead of xp
                    xpToNextLevel: state.level.xpToNextLevel,
                    rewards,
                });

                setShowModal(true);
            }
        });

        return () => unsubscribe();
    }, []);

    const getLevelRewards = (level: number): string[] => {
        const rewards: Record<number, string[]> = {
            2: ['New badge unlocked', '+50 bonus XP'],
            3: ['Custom avatar frame', 'Weekly challenges unlocked'],
            5: ['Premium insights access', 'Advanced analytics'],
            10: ['Gold tier status', 'Exclusive features'],
        };

        return rewards[level] || ['Keep going! More rewards ahead'];
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return {
        showModal,
        levelData,
        closeModal,
    };
}
