'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Zap, Star, Gift } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useConfetti } from '@/lib/hooks/useConfetti';

interface LevelUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    newLevel: number;
    xpEarned: number;
    xpToNextLevel: number;
    rewards?: string[];
}

export function LevelUpModal({
    isOpen,
    onClose,
    newLevel,
    xpEarned,
    xpToNextLevel,
    rewards = [],
}: LevelUpModalProps) {
    const { fireCelebration } = useConfetti();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Fire confetti celebration
            setTimeout(() => fireCelebration(), 300);

            // Show content with delay
            setTimeout(() => setShowContent(true), 500);

            // Auto-close after 8 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 8000);

            return () => clearTimeout(timer);
        } else {
            setShowContent(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setShowContent(false);
        setTimeout(() => onClose(), 300);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
                            transition={{ type: 'spring', duration: 0.8 }}
                            className="relative w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur-3xl opacity-50 animate-pulse" />

                            {/* Main Card */}
                            <div className="relative bg-gradient-to-br from-white via-amber-50 to-orange-50 rounded-3xl p-8 shadow-2xl border-4 border-amber-300">
                                {/* Close Button */}
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>

                                {/* Trophy Animation */}
                                <motion.div
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, type: 'spring' }}
                                    className="flex justify-center mb-6"
                                >
                                    <motion.div
                                        animate={{
                                            rotate: [0, -10, 10, -10, 0],
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: 'reverse',
                                        }}
                                        className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
                                    >
                                        <Trophy className="w-12 h-12 text-white" />
                                    </motion.div>
                                </motion.div>

                                {/* Title */}
                                <AnimatePresence>
                                    {showContent && (
                                        <>
                                            <motion.h2
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="text-4xl font-black text-center mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
                                            >
                                                LEVEL UP!
                                            </motion.h2>

                                            <motion.p
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                                className="text-center text-gray-600 mb-6"
                                            >
                                                Congratulations! You've reached a new level
                                            </motion.p>

                                            {/* Level Display */}
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2, type: 'spring' }}
                                                className="flex justify-center gap-4 mb-6"
                                            >
                                                <div className="text-center">
                                                    <div className="text-5xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                                        {newLevel - 1}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-medium">Previous</div>
                                                </div>

                                                <motion.div
                                                    animate={{ x: [0, 10, 0] }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                    className="flex items-center"
                                                >
                                                    <div className="text-3xl">→</div>
                                                </motion.div>

                                                <div className="text-center">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ repeat: Infinity, duration: 1 }}
                                                        className="text-5xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
                                                    >
                                                        {newLevel}
                                                    </motion.div>
                                                    <div className="text-xs text-gray-500 font-medium">Current</div>
                                                </div>
                                            </motion.div>

                                            {/* Stats */}
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                                className="bg-white/80 rounded-2xl p-4 mb-6 border-2 border-amber-200"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Zap className="w-5 h-5 text-amber-600" />
                                                        <span className="text-sm font-semibold text-gray-700">XP Progress</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">
                                                        {xpEarned} / {xpToNextLevel}
                                                    </span>
                                                </div>
                                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(xpEarned / xpToNextLevel) * 100}%` }}
                                                        transition={{ delay: 0.5, duration: 1 }}
                                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                                                    />
                                                </div>
                                            </motion.div>

                                            {/* Rewards */}
                                            {rewards.length > 0 && (
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.4 }}
                                                    className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border-2 border-emerald-200"
                                                >
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Gift className="w-5 h-5 text-emerald-600" />
                                                        <span className="text-sm font-bold text-gray-900">Rewards Unlocked!</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {rewards.map((reward, index) => (
                                                            <motion.div
                                                                key={index}
                                                                initial={{ x: -20, opacity: 0 }}
                                                                animate={{ x: 0, opacity: 1 }}
                                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                                className="flex items-center gap-2 text-sm text-gray-700"
                                                            >
                                                                <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                                                                <span>{reward}</span>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Continue Button */}
                                            <motion.button
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.6 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleClose}
                                                className="w-full mt-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                            >
                                                Awesome! Continue
                                            </motion.button>
                                        </>
                                    )}
                                </AnimatePresence>

                                {/* Floating particles */}
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-2 h-2 bg-amber-400 rounded-full"
                                        style={{
                                            left: `${20 + i * 15}%`,
                                            top: `${10 + (i % 3) * 30}%`,
                                        }}
                                        animate={{
                                            y: [-20, 20, -20],
                                            opacity: [0, 1, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.3,
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
