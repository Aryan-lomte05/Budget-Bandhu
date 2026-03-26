"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/lib/constants/achievements';
import { X, Sparkles } from 'lucide-react';
import { Confetti } from './Confetti';

interface BadgeUnlockModalProps {
    badge: Badge | null;
    onClose: () => void;
}

export function BadgeUnlockModal({ badge, onClose }: BadgeUnlockModalProps) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (badge) {
            setShowConfetti(true);
            // Auto close after 5 seconds
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [badge, onClose]);

    if (!badge) return null;

    return (
        <>
            <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
                    >
                        {/* Background gradient */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                background: `radial-gradient(circle at center, ${badge.color} 0%, transparent 70%)`,
                            }}
                        />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="relative z-10 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-mint-500 to-skyBlue-500 text-white rounded-full text-sm font-semibold mb-6"
                            >
                                <Sparkles className="w-4 h-4" />
                                Badge Unlocked!
                            </motion.div>

                            <motion.div
                                className="text-8xl mb-6"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, type: 'spring', bounce: 0.6 }}
                            >
                                {badge.icon}
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-bold text-gray-900 mb-2"
                            >
                                {badge.title}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-gray-600 mb-6"
                            >
                                {badge.description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-xl"
                            >
                                <span className="text-2xl font-bold text-mint-600">+{badge.xp}</span>
                                <span className="text-gray-600 font-medium">XP</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="mt-6 text-sm text-gray-500"
                            >
                                {badge.rarity.toUpperCase()} • {badge.category.toUpperCase()}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        </>
    );
}
