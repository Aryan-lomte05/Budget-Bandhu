"use client";

import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Medal, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LeaderboardEntry {
    rank: number;
    name: string;
    avatar: string;
    level: number;
    xp: number;
    savingsRate: number;
    change: number;
    isCurrentUser?: boolean;
}

const mockLeaderboard: LeaderboardEntry[] = [
    {
        rank: 1,
        name: 'Aryan L.',
        avatar: '',
        level: 28,
        xp: 8420,
        savingsRate: 42.5,
        change: 2,
        isCurrentUser: false,
    },
    {
        rank: 2,
        name: 'Tanuj B.',
        avatar: '',
        level: 24,
        xp: 6340,
        savingsRate: 38.2,
        change: 1,
        isCurrentUser: true,
    },
    {
        rank: 3,
        name: 'Aditya Y.',
        avatar: '',
        level: 22,
        xp: 5890,
        savingsRate: 35.8,
        change: -1,
        isCurrentUser: false,
    },
    {
        rank: 4,
        name: 'Krish G.',
        avatar: '',
        level: 20,
        xp: 5120,
        savingsRate: 33.4,
        change: 0,
        isCurrentUser: false,
    },
    {
        rank: 5,
        name: 'Chetan C.',
        avatar: '',
        level: 19,
        xp: 4890,
        savingsRate: 31.2,
        change: 2,
        isCurrentUser: false,
    },
    {
        rank: 6,
        name: 'Leena P.',
        avatar: '',
        level: 18,
        xp: 4890,
        savingsRate: 31.2,
        change: 2,
        isCurrentUser: false,
    },
];

export function Leaderboard() {
    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="w-5 h-5 text-yellow-500" />;
            case 2:
                return <Medal className="w-5 h-5 text-gray-400" />;
            case 3:
                return <Medal className="w-5 h-5 text-orange-600" />;
            default:
                return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
        }
    };

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return 'from-yellow-500 to-orange-500';
            case 2:
                return 'from-gray-400 to-gray-500';
            case 3:
                return 'from-orange-500 to-red-500';
            default:
                return 'from-mint-500 to-skyBlue-500';
        }
    };

    return (
        <div className="glass p-6 rounded-2xl border-2 border-white/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-mint-500 to-skyBlue-500 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Friend Leaderboard</h3>
                        <p className="text-sm text-gray-600">This month's rankings</p>
                    </div>
                </div>

                <button className="px-4 py-2 bg-mint-50 text-mint-700 font-medium text-sm rounded-lg hover:bg-mint-100 transition-colors">
                    Invite Friends
                </button>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-3">
                {mockLeaderboard.map((entry, index) => (
                    <motion.div
                        key={entry.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border-2 transition-all ${entry.isCurrentUser
                            ? 'bg-gradient-to-r from-mint-50 to-skyBlue-50 border-mint-500'
                            : 'bg-white border-gray-200 hover:border-mint-500/30'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            {/* Rank */}
                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                                {entry.rank <= 3 ? (
                                    <div
                                        className={`w-10 h-10 bg-gradient-to-br ${getRankColor(
                                            entry.rank
                                        )} rounded-full flex items-center justify-center`}
                                    >
                                        {getRankIcon(entry.rank)}
                                    </div>
                                ) : (
                                    getRankIcon(entry.rank)
                                )}
                            </div>

                            {/* Avatar & Name */}
                            <div className="flex items-center gap-3 flex-1">
                                <Avatar className="w-10 h-10 ring-2 ring-mint-500/20">
                                    <AvatarImage src={entry.avatar} />
                                    <AvatarFallback className="bg-mint-500 text-white">
                                        {entry.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900">{entry.name}</span>
                                        {entry.isCurrentUser && (
                                            <span className="px-2 py-0.5 bg-mint-500 text-white text-xs font-medium rounded">
                                                You
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-600">
                                        <span>Level {entry.level}</span>
                                        <span>•</span>
                                        <span>{entry.xp.toLocaleString()} XP</span>
                                    </div>
                                </div>
                            </div>

                            {/* Savings Rate */}
                            <div className="text-right">
                                <div className="text-lg font-bold text-mint-600">
                                    {entry.savingsRate}%
                                </div>
                                <div className="text-xs text-gray-500">Savings Rate</div>
                            </div>

                            {/* Change Indicator */}
                            <div className="flex-shrink-0 w-12 text-center">
                                {entry.change !== 0 && (
                                    <div
                                        className={`flex items-center justify-center gap-0.5 ${entry.change > 0 ? 'text-mint-600' : 'text-coral-600'
                                            }`}
                                    >
                                        <TrendingUp
                                            className={`w-4 h-4 ${entry.change < 0 ? 'rotate-180' : ''
                                                }`}
                                        />
                                        <span className="text-xs font-semibold">{Math.abs(entry.change)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">2nd</div>
                    <div className="text-xs text-gray-600 mt-1">Your Rank</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-mint-600">38.2%</div>
                    <div className="text-xs text-gray-600 mt-1">Your Rate</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-skyBlue-600">+1</div>
                    <div className="text-xs text-gray-600 mt-1">This Week</div>
                </div>
            </div>
        </div>
    );
}
