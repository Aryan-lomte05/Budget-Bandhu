/**
 * Budget Recommendations Card
 * Shows PolicyLearner AI recommendations with accept/reject actions
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, Minus, Check, X, Loader2, RefreshCw } from 'lucide-react';
import { BudgetRecommendation } from '@/lib/api/ml-api';

interface BudgetRecommendationsProps {
    recommendations: BudgetRecommendation[];
    savingsPotential: number;
    onAccept: (category: string) => Promise<void>;
    onReject: (category: string) => Promise<void>;
    onRefresh: () => void;
    loading?: boolean;
}

export function BudgetRecommendations({
    recommendations,
    savingsPotential,
    onAccept,
    onReject,
    onRefresh,
    loading = false
}: BudgetRecommendationsProps) {
    const [processingCategory, setProcessingCategory] = useState<string | null>(null);
    const [dismissedCategories, setDismissedCategories] = useState<Set<string>>(new Set());

    const handleAccept = async (category: string) => {
        setProcessingCategory(category);
        try {
            await onAccept(category);
            setDismissedCategories(prev => new Set(prev).add(category));
        } finally {
            setProcessingCategory(null);
        }
    };

    const handleReject = async (category: string) => {
        setProcessingCategory(category);
        try {
            await onReject(category);
            setDismissedCategories(prev => new Set(prev).add(category));
        } finally {
            setProcessingCategory(null);
        }
    };

    const activeRecommendations = recommendations.filter(
        rec => !dismissedCategories.has(rec.category) && rec.change !== 'maintain'
    );

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

    const getChangeIcon = (change: 'increase' | 'decrease' | 'maintain') => {
        switch (change) {
            case 'increase': return <TrendingUp className="w-4 h-4 text-red-500" />;
            case 'decrease': return <TrendingDown className="w-4 h-4 text-green-500" />;
            default: return <Minus className="w-4 h-4 text-gray-400" />;
        }
    };

    const getChangeColor = (change: 'increase' | 'decrease' | 'maintain') => {
        switch (change) {
            case 'increase': return 'bg-red-50 border-red-200';
            case 'decrease': return 'bg-green-50 border-green-200';
            default: return 'bg-gray-50 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 border border-amber-200">
                <div className="flex items-center gap-3 mb-4">
                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                    <h3 className="text-lg font-bold text-gray-800">Analyzing your spending...</h3>
                </div>
                <p className="text-sm text-gray-600">PolicyLearner is generating personalized recommendations</p>
            </div>
        );
    }

    if (activeRecommendations.length === 0) {
        return (
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 border border-green-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Budget Looking Good!</h3>
                            <p className="text-sm text-gray-600">No adjustments needed right now</p>
                        </div>
                    </div>
                    <button
                        onClick={onRefresh}
                        className="p-2 rounded-lg hover:bg-green-100 transition-colors"
                        title="Refresh recommendations"
                    >
                        <RefreshCw className="w-5 h-5 text-green-600" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 border border-amber-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">AI Budget Recommendations</h3>
                        <p className="text-sm text-gray-600">
                            {activeRecommendations.length} suggestions from PolicyLearner
                        </p>
                    </div>
                </div>
                {savingsPotential > 0 && (
                    <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Savings Potential</p>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(savingsPotential)}</p>
                    </div>
                )}
            </div>

            {/* Recommendations List */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {activeRecommendations.map((rec) => (
                        <motion.div
                            key={rec.category}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className={`rounded-xl p-4 border ${getChangeColor(rec.change)}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {getChangeIcon(rec.change)}
                                        <span className="font-semibold text-gray-800">{rec.category}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-gray-500">
                                            Current: <span className="font-medium">{formatCurrency(rec.current_allocation)}</span>
                                        </span>
                                        <span className="text-gray-400">→</span>
                                        <span className={rec.change === 'decrease' ? 'text-green-600' : 'text-red-600'}>
                                            Suggested: <span className="font-bold">{formatCurrency(rec.recommended)}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {processingCategory === rec.category ? (
                                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleAccept(rec.category)}
                                                className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                                                title="Accept recommendation"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleReject(rec.category)}
                                                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                                                title="Reject recommendation"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-gray-500 mt-4 text-center">
                💡 Your feedback helps PolicyLearner improve future recommendations
            </p>
        </div>
    );
}
