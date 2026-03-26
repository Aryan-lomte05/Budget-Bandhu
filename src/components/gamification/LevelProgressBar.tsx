"use client";

import { motion } from 'framer-motion';
import { UserLevel } from '@/lib/utils/gamification';
import { Zap, Crown } from 'lucide-react';

interface LevelProgressBarProps {
    level: UserLevel;
    showDetails?: boolean;
}

export function LevelProgressBar({ level, showDetails = true }: LevelProgressBarProps) {
    const progress = (level.currentXP / level.xpToNextLevel) * 100;

    return (
        <div className="glass p-6 rounded-2xl border-2 border-white/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-mint-500 to-skyBlue-500 rounded-full flex items-center justify-center relative">
                        <Crown className="w-8 h-8 text-white" />
                        <motion.div
                            className="absolute -top-1 -right-1 w-6 h-6 bg-coral-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                        >
                            {level.level}
                        </motion.div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">Level {level.level}</h3>
                        <p className="text-sm font-medium text-gray-600">{level.title}</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="flex items-center gap-2 text-mint-600">
                        <Zap className="w-5 h-5" />
                        <span className="text-2xl font-bold">{level.totalXP.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Total XP</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">Progress to Level {level.level + 1}</span>
                    <span className="font-semibold text-gray-900">
                        {level.currentXP.toLocaleString()} / {level.xpToNextLevel.toLocaleString()} XP
                    </span>
                </div>

                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-mint-500 to-skyBlue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />

                    {/* Shimmer effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{progress.toFixed(1)}% complete</span>
                    <span>{(level.xpToNextLevel - level.currentXP).toLocaleString()} XP remaining</span>
                </div>
            </div>

            {/* Level Benefits */}
            {showDetails && level.benefits.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-mint-500" />
                        Unlocked Benefits
                    </h4>
                    <div className="space-y-2">
                        {level.benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2 text-sm text-gray-600"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-mint-500" />
                                {benefit}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
