"use client";

import { motion } from 'framer-motion';
import { Challenge } from '@/lib/constants/challenges';
import { Clock, Zap, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/utils';

interface ChallengeCardProps {
    challenge: Challenge;
    onComplete?: () => void;
}

export function ChallengeCard({ challenge, onComplete }: ChallengeCardProps) {
    const progress = (challenge.progress / challenge.target) * 100;
    const isCompleted = challenge.completed;
    const daysLeft = Math.ceil(
        (new Date(challenge.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`glass p-5 rounded-xl border-2 transition-all duration-200 relative overflow-hidden ${isCompleted
                    ? 'border-mint-500 bg-mint-50'
                    : challenge.active
                        ? 'border-white/50 hover:border-mint-500/30'
                        : 'border-white/50 opacity-60'
                }`}
        >
            {/* Background gradient */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    background: `radial-gradient(circle at top right, ${challenge.color} 0%, transparent 70%)`,
                }}
            />

            {/* Completed Badge */}
            {isCompleted && (
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-3 right-3 w-8 h-8 bg-mint-500 rounded-full flex items-center justify-center"
                >
                    <CheckCircle className="w-5 h-5 text-white" />
                </motion.div>
            )}

            <div className="relative z-10">
                {/* Icon & Title */}
                <div className="flex items-start gap-3 mb-4">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${challenge.color}20` }}
                    >
                        {challenge.icon}
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{challenge.title}</h3>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">Progress</span>
                        <span className="font-semibold text-gray-900">
                            {challenge.progress} / {challenge.target}
                        </span>
                    </div>
                    <Progress value={challenge.progress} max={challenge.target} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                                {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-mint-500" />
                            <span className="text-sm font-semibold text-mint-600">+{challenge.xp} XP</span>
                        </div>
                    </div>

                    {!isCompleted && challenge.active && (
                        <button
                            onClick={onComplete}
                            className="px-4 py-2 bg-gradient-to-r from-mint-500 to-skyBlue-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
                        >
                            Claim
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
