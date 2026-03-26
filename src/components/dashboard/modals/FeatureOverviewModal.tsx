'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageSquare, TrendingUp, Shield, PiggyBank, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FeatureOverviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Feature Overview Modal
 * 
 * Opens when user clicks "Learn More" in Hero section.
 * Choice rationale: Modal keeps user in context without page navigation,
 * provides a premium feel with animations, and can later link to a full page if needed.
 */
export function FeatureOverviewModal({ isOpen, onClose }: FeatureOverviewModalProps) {
    const features = [
        {
            icon: Sparkles,
            title: 'AI-Powered Insights',
            description: 'Get personalized financial advice powered by advanced AI',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            icon: TrendingUp,
            title: 'Smart Analytics',
            description: 'Track spending patterns and predict future expenses',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Shield,
            title: 'Budget Protection',
            description: 'Stay on track with intelligent overspending alerts',
            gradient: 'from-emerald-500 to-green-500',
        },
        {
            icon: PiggyBank,
            title: 'Automated Savings',
            description: 'Reach your goals faster with smart saving recommendations',
            gradient: 'from-orange-500 to-red-500',
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
                        {/* Header */}
                        <div className="relative p-6 bg-gradient-to-br from-mm-purple to-mm-lavender rounded-t-3xl">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                            <div className="text-center text-white">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center"
                                >
                                    <Sparkles className="w-8 h-8" />
                                </motion.div>
                                <h2 className="text-2xl font-bold mb-2">How Budget Bandhu Works</h2>
                                <p className="text-white/80">Your AI-powered financial companion</p>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="p-6 space-y-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{feature.title}</h3>
                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="p-6 pt-0">
                            <Link href="/chat" onClick={onClose}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-mm-purple to-mm-lavender text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Start Chatting with AI
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
