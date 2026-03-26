"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge, getRarityColor } from '@/lib/constants/achievements';
import { Lock, Sparkles } from 'lucide-react';

interface BadgeGridProps {
    badges: Badge[];
    onBadgeClick?: (badge: Badge) => void;
}

export function BadgeGrid({ badges, onBadgeClick }: BadgeGridProps) {
    const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const filteredBadges = badges.filter(badge => {
        if (filter === 'unlocked' && !badge.unlocked) return false;
        if (filter === 'locked' && badge.unlocked) return false;
        if (categoryFilter !== 'all' && badge.category !== categoryFilter) return false;
        return true;
    });

    const categories = Array.from(new Set(badges.map(b => b.category)));

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Status Filter */}
                <div className="flex gap-2">
                    {['all', 'unlocked', 'locked'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status as any)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${filter === status
                                    ? 'bg-mint-500 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Category Filter */}
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-mint-500"
                >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
                <div>
                    <span className="text-gray-600">Total: </span>
                    <span className="font-bold text-gray-900">{badges.length}</span>
                </div>
                <div>
                    <span className="text-gray-600">Unlocked: </span>
                    <span className="font-bold text-mint-600">
                        {badges.filter(b => b.unlocked).length}
                    </span>
                </div>
                <div>
                    <span className="text-gray-600">Completion: </span>
                    <span className="font-bold text-skyBlue-600">
                        {((badges.filter(b => b.unlocked).length / badges.length) * 100).toFixed(0)}%
                    </span>
                </div>
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredBadges.map((badge, index) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onBadgeClick?.(badge)}
                        className={`glass p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${badge.unlocked
                                ? 'border-white/50 hover:border-mint-500/50'
                                : 'border-white/30 opacity-60 grayscale hover:grayscale-0'
                            }`}
                        style={{
                            borderColor: badge.unlocked ? `${getRarityColor(badge.rarity)}30` : undefined,
                        }}
                    >
                        <div className="relative">
                            {/* Lock Icon for locked badges */}
                            {!badge.unlocked && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                    <Lock className="w-3 h-3 text-gray-600" />
                                </div>
                            )}

                            {/* Rarity Indicator */}
                            {badge.unlocked && (
                                <div
                                    className="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: getRarityColor(badge.rarity) }}
                                >
                                    <Sparkles className="w-3 h-3 text-white" />
                                </div>
                            )}

                            {/* Badge Icon */}
                            <div className="text-5xl mb-3 text-center">
                                {badge.icon}
                            </div>

                            {/* Badge Title */}
                            <h4 className="text-sm font-bold text-gray-900 text-center mb-1 line-clamp-2">
                                {badge.title}
                            </h4>

                            {/* XP */}
                            <div className="flex items-center justify-center gap-1 text-xs">
                                <Sparkles className="w-3 h-3 text-mint-500" />
                                <span className="font-semibold text-mint-600">+{badge.xp} XP</span>
                            </div>

                            {/* Rarity Tag */}
                            <div className="mt-2 text-center">
                                <span
                                    className="inline-block px-2 py-0.5 rounded text-xs font-medium uppercase"
                                    style={{
                                        backgroundColor: `${getRarityColor(badge.rarity)}20`,
                                        color: getRarityColor(badge.rarity),
                                    }}
                                >
                                    {badge.rarity}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredBadges.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No badges found</h3>
                    <p className="text-gray-600">Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
}
