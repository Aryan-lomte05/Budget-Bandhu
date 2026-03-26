'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Utensils, Car, Home, Heart, Zap, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { mockData } from '@/lib/api/mock-data';

interface BudgetCategory {
    id: string;
    name: string;
    spent: number;
    budget: number;
    icon: any;
    color: string;
    gradient: string;
}

interface BudgetProgressBarsProps {
    allocations?: Array<{ category: string; spent: number; allocated: number }>;
}

const getCategoryStyles = (category: string) => {
    switch (category) {
        case 'Shopping': return { icon: ShoppingBag, color: '#EC4899', gradient: 'from-pink-500 to-rose-600' };
        case 'Food & Dining': return { icon: Utensils, color: '#F59E0B', gradient: 'from-orange-500 to-amber-600' };
        case 'Transport': return { icon: Car, color: '#3B82F6', gradient: 'from-blue-500 to-cyan-600' };
        case 'Bills & Utilities': return { icon: Zap, color: '#10B981', gradient: 'from-emerald-500 to-green-600' };
        case 'Housing': return { icon: Home, color: '#8B5CF6', gradient: 'from-purple-500 to-violet-600' };
        case 'Healthcare': return { icon: Heart, color: '#EF4444', gradient: 'from-red-500 to-pink-600' };
        default: return { icon: TrendingUp, color: '#6B7280', gradient: 'from-gray-500 to-gray-600' };
    }
};

const getStatusColor = (percentage: number) => {
    if (percentage < 70) return 'text-emerald-600';
    if (percentage < 85) return 'text-orange-600';
    return 'text-red-600';
};

const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'from-emerald-400 via-green-500 to-emerald-600';
    if (percentage < 85) return 'from-yellow-400 via-orange-500 to-amber-600';
    return 'from-red-400 via-rose-500 to-red-600';
};

// FIX 1: Extracted as memo — prevents re-render when parent scrolls
const CategoryCard = memo(({ budget, index }: { budget: BudgetCategory; index: number }) => {
    const Icon = budget.icon;
    const percentage = (budget.spent / budget.budget) * 100;
    const remaining = budget.budget - budget.spent;
    const isOver = percentage >= 85;

    return (
        <motion.div
            // FIX 2: use whileInView instead of animate so it only runs once when visible
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}  // once:true = never re-animates
            transition={{
                delay: index * 0.06,
                type: 'spring',
                stiffness: 60,
                damping: 18,
            }}
            // FIX 3: removed whileHover scale (causes layout recalc on every card hover)
            className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md"
            style={{ willChange: 'transform' }}  // promote to GPU layer
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    {/* FIX 4: removed whileHover rotate 360 — was triggering repaints */}
                    <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${budget.gradient} flex items-center justify-center shadow-md`}
                    >
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{budget.name}</p>
                        <p className="text-xs text-gray-500">₹{remaining.toLocaleString('en-IN')} left</p>
                    </div>
                </div>
                {/* FIX 5: removed pulsing scale animation on percentage — fires every second */}
                <div className={`text-lg font-bold ${getStatusColor(percentage)}`}>
                    {percentage.toFixed(0)}%
                </div>
            </div>

            {/* Progress bar — CSS transition only, no framer-motion animate */}
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(percentage)} rounded-full`}
                    style={{
                        width: `${Math.min(percentage, 100)}%`,
                        // FIX 6: CSS transition instead of motion.div animate width
                        // No shimmer overlay — was causing constant repaints
                        transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                />
            </div>
        </motion.div>
    );
});
CategoryCard.displayName = 'CategoryCard';

// FIX 7: Wrap entire component in memo — won't re-render on parent scroll
export const BudgetProgressBars = memo(function BudgetProgressBars({ allocations = [] }: BudgetProgressBarsProps) {
    const budgets: BudgetCategory[] = (allocations.length > 0 ? allocations : mockData.budget.allocations)
        .slice(0, 6)
        .map((allocation, index) => {
            const styles = getCategoryStyles(allocation.category);
            return {
                id: String(index + 1),
                name: allocation.category,
                spent: allocation.spent || 0,
                budget: allocation.allocated || 1,
                icon: styles.icon,
                color: styles.color,
                gradient: styles.gradient,
            };
        });

    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
    const overallPercentage = (totalSpent / totalBudget) * 100;

    return (
        <div
            className="relative rounded-3xl overflow-hidden p-6"
            style={{
                background: 'linear-gradient(145deg, #BFFF00 0%, #D4FF33 50%, #E8FF80 100%)',
                boxShadow: '0 20px 40px rgba(191, 255, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
            }}
        >
            {/* FIX 8: Removed two constantly-animating blur orbs — huge GPU drain */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-green-400/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-900/10 flex items-center justify-center shadow-lg">
                        <Target className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Budget Progress</h3>
                        <p className="text-sm text-gray-700">Track spending across categories</p>
                    </div>
                </div>
                <div className="text-right px-4 py-2 rounded-xl bg-white/50">
                    <p className="text-xs text-gray-600 mb-1">Overall Usage</p>
                    <div className="flex items-center gap-2">
                        <span className={`text-2xl font-black ${getStatusColor(overallPercentage)}`}>
                            {overallPercentage.toFixed(0)}%
                        </span>
                        {overallPercentage >= 85 && <AlertTriangle className="w-5 h-5 text-red-600" />}
                    </div>
                </div>
            </div>

            {/* Overall Summary Bar */}
            <div className="relative z-10 mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Total Budget Usage</span>
                    <span className="text-sm font-bold text-gray-900">
                        ₹{totalSpent.toLocaleString('en-IN')} / ₹{totalBudget.toLocaleString('en-IN')}
                    </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    {/* FIX 9: CSS transition instead of framer-motion animate width + removed shimmer */}
                    <div
                        className={`h-full bg-gradient-to-r ${getProgressColor(overallPercentage)} rounded-full`}
                        style={{
                            width: `${overallPercentage}%`,
                            transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                    />
                </div>
            </div>

            {/* Category Cards Grid */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets.map((budget, index) => (
                    <CategoryCard key={budget.id} budget={budget} index={index} />
                ))}
            </div>
        </div>
    );
});