"use client";

import { motion } from "framer-motion";
import { CheckCircle, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface GoalCardProps {
    goal: {
        id: string;
        name: string;
        icon: string;
        target: number;
        current: number;
        deadline: string;
        priority: string;
        color: string;
        milestones?: Array<{
            amount: number;
            reached: boolean;
            date: string | null;
        }>;
    };
    onAddMoney?: (goalId: string, amount: number) => void;
}

export function GoalCard({ goal, onAddMoney }: GoalCardProps) {
    const percentage = (goal.current / goal.target) * 100;
    const isComplete = percentage >= 100;

    const handleQuickAdd = (amount: number) => {
        if (onAddMoney && !isComplete) {
            onAddMoney(goal.id, amount);
        }
    };

    return (
        <motion.div
            className={`relative overflow-hidden rounded-3xl border transition-all duration-300 group ${isComplete
                ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                : 'bg-white/10 backdrop-blur-md border-white/20 hover:border-white/30 hover:bg-white/15 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)]'
                }`}
            whileHover={{ y: -5, scale: 1.01 }}
        >
            {/* Complete Badge */}
            {isComplete && (
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.3 }}
                    className="absolute top-4 right-4 z-10"
                >
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                </motion.div>
            )}

            <div className="p-6 lg:p-7">
                {/* Category Icon & Name */}
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 flex items-center justify-center text-4xl bg-white/10 rounded-2xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
                        {goal.icon}
                    </div>
                    <div className="flex-1 mt-1">
                        <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">{goal.name}</h3>
                        <p className="text-sm text-gray-300 font-medium">
                            Target: {new Date(goal.deadline).toLocaleDateString('en-IN', {
                                month: 'short',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300 uppercase tracking-widest text-[10px]">Progress</span>
                        <span className={`text-sm font-bold ${isComplete ? 'text-emerald-400' : 'text-white'
                            }`}>
                            {percentage.toFixed(1)}%
                        </span>
                    </div>

                    <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className={`h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] ${isComplete
                                ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                                : 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400'
                                }`}
                        />
                    </div>
                </div>

                {/* Amount Display */}
                <div className="mb-6 bg-black/20 rounded-xl p-4 border border-white/10">
                    <div className="text-3xl font-black text-white tracking-tight">
                        {formatCurrency(goal.current)}
                    </div>
                    <div className="text-sm text-gray-300 mt-1">
                        of {formatCurrency(goal.target)}
                        <span className="mx-2 text-gray-500">•</span>
                        <span className="text-emerald-400 font-medium">
                            {formatCurrency(goal.target - goal.current)} remaining
                        </span>
                    </div>
                </div>

                {/* Quick Add Buttons - Only show if not complete */}
                {!isComplete && onAddMoney && (
                    <div className="grid grid-cols-3 gap-2">
                        {[1000, 5000, 10000].map(amount => (
                            <motion.button
                                key={amount}
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.25)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleQuickAdd(amount)}
                                className="py-3 px-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs lg:text-sm font-bold text-white transition-all flex items-center justify-center gap-1 border border-white/10 shadow-sm"
                            >
                                <Plus className="w-3 h-3 text-emerald-400" />
                                ₹{amount >= 1000 ? `${amount / 1000}k` : amount}
                            </motion.button>
                        ))}
                    </div>
                )}

                {/* Complete Message */}
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-3 px-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
                    >
                        <p className="text-emerald-400 font-bold text-lg">
                            🎉 Goal Achieved!
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
