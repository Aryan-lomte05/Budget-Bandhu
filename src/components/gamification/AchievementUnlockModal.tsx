'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Trophy, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/lib/hooks/useWindowSize';
import { Badge } from '@/lib/constants/achievements';

interface AchievementUnlockModalProps {
    badge: Badge | null;
    isOpen: boolean;
    onClose: () => void;
}

export function AchievementUnlockModal({ badge, isOpen, onClose }: AchievementUnlockModalProps) {
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isOpen && badge) {
            setShowConfetti(true);

            // Stop confetti after 5 seconds
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, badge]);

    if (!badge) return null;

    const rarityColors = {
        common: 'from-slate-400 to-slate-600',
        rare: 'from-blue-400 to-blue-600',
        epic: 'from-purple-500 to-purple-700',
        legendary: 'from-amber-400 via-orange-500 to-yellow-600',
    };

    const rarityGlow = {
        common: 'shadow-slate-500/50',
        rare: 'shadow-blue-500/50',
        epic: 'shadow-purple-500/50',
        legendary: 'shadow-amber-500/50',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Confetti */}
                    {showConfetti && (
                        <Confetti
                            width={width}
                            height={height}
                            recycle={false}
                            numberOfPieces={500}
                            gravity={0.3}
                            colors={['#10B981', '#3B82F6', '#A78BFA', '#F59E0B', '#EC4899']}
                        />
                    )}

                    {/* Modal Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: 'spring', duration: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative"
                        >
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${rarityColors[badge.rarity]} blur-3xl opacity-50 animate-pulse`} />

                            {/* Card */}
                            <div className="relative backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border-2 border-white/50 p-8 max-w-md w-full">
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>

                                {/* Content */}
                                <div className="text-center">
                                    {/* Achievement Unlocked Badge */}
                                    <motion.div
                                        initial={{ scale: 0, y: -20 }}
                                        animate={{ scale: 1, y: 0 }}
                                        transition={{ delay: 0.3, type: 'spring' }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Achievement Unlocked!
                                    </motion.div>

                                    {/* Icon with Particles */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                                        className="relative inline-block mb-6"
                                    >
                                        {/* Rotating Stars */}
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute"
                                                style={{
                                                    top: '50%',
                                                    left: '50%',
                                                }}
                                                animate={{
                                                    rotate: 360,
                                                    x: Math.cos((i * Math.PI * 2) / 8) * 80,
                                                    y: Math.sin((i * Math.PI * 2) / 8) * 80,
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: 'linear',
                                                }}
                                            >
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            </motion.div>
                                        ))}

                                        {/* Main Icon */}
                                        <motion.div
                                            animate={{
                                                rotate: [0, 10, -10, 10, 0],
                                                scale: [1, 1.1, 1.1, 1.1, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatDelay: 1,
                                            }}
                                            className={`w-32 h-32 rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]} flex items-center justify-center text-6xl shadow-2xl ${rarityGlow[badge.rarity]}`}
                                        >
                                            {badge.icon}
                                        </motion.div>
                                    </motion.div>

                                    {/* Achievement Name */}
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                        className="text-3xl font-bold text-gray-800 mb-3"
                                    >
                                        {badge.title}
                                    </motion.h2>

                                    {/* Rarity Badge */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${rarityColors[badge.rarity]} text-white text-sm font-bold mb-4 shadow-lg capitalize`}
                                    >
                                        {badge.rarity}
                                    </motion.div>

                                    {/* Category */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.85 }}
                                        className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium mb-4 ml-2"
                                    >
                                        {badge.category}
                                    </motion.div>

                                    {/* Description */}
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.9 }}
                                        className="text-gray-600 mb-6"
                                    >
                                        {badge.description}
                                    </motion.p>

                                    {/* XP Reward */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1 }}
                                        className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200"
                                    >
                                        <Trophy className="w-6 h-6 text-emerald-600" />
                                        <span className="text-2xl font-bold text-emerald-600">+{badge.xp} XP</span>
                                    </motion.div>

                                    {/* Close Button */}
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.2 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onClose}
                                        className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Awesome! 🎉
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
