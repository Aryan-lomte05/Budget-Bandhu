"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGamificationStore } from '@/lib/store/useGamificationStore';
import { useGamification, useDashboard } from '@/lib/hooks/useMLApi';
import { useUserStore } from '@/lib/store/useUserStore';
import { LevelProgressBar } from '@/components/gamification/LevelProgressBar';
import { BadgeGrid } from '@/components/gamification/BadgeGrid';
import { ChallengeCard } from '@/components/gamification/ChallengeCard';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { BadgeUnlockModal } from '@/components/gamification/BadgeUnlockModal';
import { AchievementUnlockModal } from '@/components/gamification/AchievementUnlockModal';
import { LevelUpModal } from '@/components/gamification/LevelUpModal';
import { Badge } from '@/lib/constants/achievements';
import { FireworksEffect } from '@/components/animations/FireworksEffect';
import { useFireworks } from '@/lib/hooks/useFireworks';
import { useLevelUp } from '@/lib/hooks/useLevelUp';
import { Trophy, Target, Award, Users, Loader2, Share2, Copy } from 'lucide-react';

// Demo user ID
const DEMO_USER_ID = "696a022c3c758e29b2ca8d50";

export default function GamificationPage() {
    // Get user from store or use demo
    const { userId } = useUserStore();
    const activeUserId = userId || DEMO_USER_ID;

    // Fetch real gamification data from API
    const { gamification: apiGamification, loading: gamificationLoading, refetch, checkBadges } = useGamification(activeUserId);
    const { data: dashboardData, loading: dashboardLoading } = useDashboard(activeUserId);

    const loading = gamificationLoading || dashboardLoading;

    // Sync API data with local store
    const { level, badges, challenges, recentUnlocks, addXP, updateChallengeProgress, clearRecentUnlocks } = useGamificationStore();

    // Use API data for level info if available
    const displayLevel = apiGamification?.level_info || level;
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [activeTab, setActiveTab] = useState<'challenges' | 'badges' | 'leaderboard'>('challenges');
    const { isActive: fireworksActive, launch: launchFireworks } = useFireworks();
    const { showModal: showLevelUpModal, levelData, closeModal: closeLevelUpModal } = useLevelUp(); // NEW

    // Get current unlock from recent unlocks
    const currentUnlock = recentUnlocks[0] || null;

    const handleCompleteChallenge = (challengeId: string) => {
        const challenge = challenges.find(c => c.id === challengeId);
        if (challenge && !challenge.completed) {
            // Store old level before updating
            const oldLevel = level.level;

            // Update challenge and add XP
            updateChallengeProgress(challengeId, challenge.target);
            addXP(challenge.xp, `Completed ${challenge.title}`);

            // Check if leveled up after state updates
            setTimeout(() => {
                const newLevel = useGamificationStore.getState().level.level;
                if (newLevel > oldLevel) {
                    // LEVEL UP! Launch fireworks 🎆
                    launchFireworks(6000);
                }
            }, 100);
        }
    };

    const streak = apiGamification?.streak_days || 0;
    const totalSaved = dashboardData?.stats.month_saved || 0;
    const currentBadge = level.title;

    const generateMessage = (isEncoded = true) => {
        const msg = `🐷 Budget Bandhu Update!\n` +
            `🔥 I'm on a ${streak}-day saving streak!\n` +
            `💰 Saved ₹${totalSaved.toLocaleString()} this month\n` +
            `🏆 Badge: ${currentBadge}\n` +
            `Join me on Budget Bandhu and take control of your finances!`;
        return isEncoded ? encodeURIComponent(msg) : msg;
    };

    const handleShareWhatsApp = () => {
        const url = `https://wa.me/?text=${generateMessage()}`;
        window.open(url, '_blank');
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(generateMessage(false));
        alert('Copied to clipboard!');
    };

    return (
        <>
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements & Rewards</h1>
                    <p className="text-gray-600">Level up, unlock badges, and compete with friends</p>
                </div>

                {/* Level Progress */}
                <LevelProgressBar level={level} />

                {/* Streak & Sharing Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass p-6 rounded-2xl border-2 border-white/50 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Streak</div>
                                <div className="text-3xl font-black text-gray-900">{streak} Days 🔥</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Month Savings</div>
                            <div className="text-2xl font-bold text-mint-600">₹{totalSaved.toLocaleString()}</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass p-6 rounded-2xl border-2 border-white/50 flex flex-col justify-center gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleShareWhatsApp}
                                className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transition-transform group-hover:scale-110">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.028 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .081 5.363.079 11.969c0 2.112.551 4.17 1.595 5.98L0 24l6.176-1.62a11.782 11.782 0 005.867 1.56h.005c6.604 0 11.967-5.363 11.97-11.97a11.815 11.815 0 00-3.404-8.475" />
                                </svg>
                                Share Streak 🔥
                            </button>
                            <button
                                onClick={handleCopyToClipboard}
                                className="p-3 bg-white border-2 border-gray-200 hover:border-mint-500 rounded-xl transition-all group"
                                title="Copy to Clipboard"
                            >
                                <Copy className="w-6 h-6 text-gray-600 group-hover:text-mint-600" />
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Show off your progress!</p>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="glass p-2 rounded-xl border-2 border-white/50 inline-flex gap-2">
                    {[
                        { id: 'challenges', label: 'Challenges', icon: Target },
                        { id: 'badges', label: 'Badges', icon: Award },
                        { id: 'leaderboard', label: 'Leaderboard', icon: Users },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-mint-500 to-skyBlue-500 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'challenges' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Weekly Challenges</h2>
                            <span className="text-sm text-gray-600">
                                {challenges.filter(c => c.completed).length} / {challenges.length} completed
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {challenges.map((challenge) => (
                                <ChallengeCard
                                    key={challenge.id}
                                    challenge={challenge}
                                    onComplete={() => handleCompleteChallenge(challenge.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'badges' && (
                    <BadgeGrid badges={badges} onBadgeClick={setSelectedBadge} />
                )}

                {activeTab === 'leaderboard' && <Leaderboard />}

                {/* Badge Detail Modal */}
                <BadgeUnlockModal
                    badge={selectedBadge}
                    onClose={() => setSelectedBadge(null)}
                />

                {/* Achievement Unlock Modal */}
                <AchievementUnlockModal
                    badge={currentUnlock}
                    isOpen={!!currentUnlock}
                    onClose={clearRecentUnlocks}
                />
            </div>

            {/* NEW: Level Up Modal */}
            <LevelUpModal
                isOpen={showLevelUpModal}
                onClose={closeLevelUpModal}
                newLevel={levelData.newLevel}
                xpEarned={levelData.xpEarned}
                xpToNextLevel={levelData.xpToNextLevel}
                rewards={levelData.rewards}
            />

            {/* Fireworks Animation */}
            <FireworksEffect isActive={fireworksActive} duration={6000} />
        </>
    );
}
