'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Brain, MessageSquare, ArrowRight, TrendingUp, PiggyBank, Shield, Heart } from 'lucide-react';
import Link from 'next/link';

interface TaxRecommendationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentInvested: number;
    maxLimit: number;
}

/**
 * Tax Recommendations Modal
 * 
 * AI/ML-styled recommendations for tax saving options.
 * Designed for future integration with ML model or Chat page query forwarding.
 */
export function TaxRecommendationsModal({ isOpen, onClose, currentInvested, maxLimit }: TaxRecommendationsModalProps) {
    const remaining = maxLimit - currentInvested;
    const potentialSavings = remaining * 0.3;

    // Mock AI-generated recommendations based on current investment status
    const recommendations = [
        {
            id: 1,
            title: 'ELSS Mutual Funds',
            description: 'Tax-saving with wealth creation potential',
            benefit: 'Up to ₹46,800 tax savings',
            confidence: 94,
            icon: TrendingUp,
            gradient: 'from-blue-500 to-cyan-600',
            tag: 'High Growth',
        },
        {
            id: 2,
            title: 'National Pension System',
            description: 'Additional ₹50,000 deduction under 80CCD(1B)',
            benefit: 'Extra ₹15,600 savings',
            confidence: 89,
            icon: PiggyBank,
            gradient: 'from-emerald-500 to-green-600',
            tag: 'Retirement',
        },
        {
            id: 3,
            title: 'Health Insurance Premium',
            description: 'Section 80D benefits for you and family',
            benefit: 'Up to ₹25,000 deduction',
            confidence: 85,
            icon: Heart,
            gradient: 'from-pink-500 to-rose-600',
            tag: 'Protection',
        },
        {
            id: 4,
            title: 'PPF Investment',
            description: 'Risk-free guaranteed returns with tax benefits',
            benefit: 'Stable 7.1% returns',
            confidence: 92,
            icon: Shield,
            gradient: 'from-orange-500 to-red-600',
            tag: 'Safe',
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with AI Badge */}
                        <div className="relative p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-t-3xl">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>

                            {/* AI Badge */}
                            <motion.div
                                initial={{ scale: 0, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm"
                            >
                                <Brain className="w-4 h-4 text-white" />
                                <span className="text-xs font-semibold text-white">AI Powered</span>
                                <Sparkles className="w-3 h-3 text-yellow-300" />
                            </motion.div>

                            <div className="text-center text-white pt-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: 'spring' }}
                                    className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center"
                                >
                                    <Sparkles className="w-8 h-8" />
                                </motion.div>
                                <h2 className="text-2xl font-bold mb-2">Smart Tax Recommendations</h2>
                                <p className="text-white/80 text-sm">
                                    Personalized suggestions to maximize your savings
                                </p>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="p-6 pb-0">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Remaining 80C Limit</p>
                                        <p className="text-2xl font-bold text-orange-600">₹{remaining.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Potential Tax Savings</p>
                                        <p className="text-2xl font-bold text-emerald-600">₹{potentialSavings.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Recommendations */}
                        <div className="p-6 space-y-3">
                            <p className="text-sm text-gray-500 font-medium mb-4">Based on your profile, we recommend:</p>

                            {recommendations.map((rec, index) => (
                                <motion.div
                                    key={rec.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (0.1 * index) }}
                                    className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rec.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                                            <rec.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-gray-900">{rec.title}</h3>
                                                <span className="px-2 py-0.5 text-xs font-semibold bg-white rounded-full text-gray-600 border">
                                                    {rec.tag}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-semibold text-emerald-600">{rec.benefit}</span>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${rec.confidence}%` }}
                                                            transition={{ delay: 0.5 + (0.1 * index), duration: 0.8 }}
                                                            className={`h-full bg-gradient-to-r ${rec.gradient} rounded-full`}
                                                        />
                                                    </div>
                                                    <span>{rec.confidence}% match</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA - Ask AI */}
                        <div className="p-6 pt-0">
                            <Link href="/chat" onClick={onClose}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Ask AI for Personalized Advice
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                            <p className="text-xs text-gray-400 text-center mt-3">
                                Get detailed explanations and custom investment strategies
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
