'use client';

import { motion } from 'framer-motion';
import { Gauge, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { memo } from 'react';

interface BudgetHealthGaugeProps {
    spent: number;
    budget: number;
}

export const BudgetHealthGauge = memo(function BudgetHealthGauge({ spent, budget }: { spent: number; budget: number }) {
    const percentage = Math.min((spent / budget) * 100, 100);
    const remaining = Math.max(budget - spent, 0);
    const remainingPercentage = Math.max(100 - percentage, 0);

    const getHealthStatus = () => {
        if (percentage < 50) {
            return {
                status: 'Excellent',
                color: 'text-emerald-600',
                bgColor: 'bg-emerald-100',
                icon: CheckCircle,
                message: 'You are well within budget! Keep it up! 🎉',
            };
        } else if (percentage < 75) {
            return {
                status: 'Good',
                color: 'text-blue-600',
                bgColor: 'bg-blue-100',
                icon: TrendingUp,
                message: 'Spending on track. Stay mindful! 👍',
            };
        } else if (percentage < 90) {
            return {
                status: 'Caution',
                color: 'text-amber-600',
                bgColor: 'bg-amber-100',
                icon: AlertTriangle,
                message: 'Approaching budget limit. Watch spending! ⚠️',
            };
        } else {
            return {
                status: 'Critical',
                color: 'text-red-600',
                bgColor: 'bg-red-100',
                icon: AlertTriangle,
                message: 'Budget nearly exhausted! Reduce spending! 🚨',
            };
        }
    };

    const health = getHealthStatus();
    const StatusIcon = health.icon;
    const needleRotation = (percentage / 100) * 180 - 90;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative rounded-3xl overflow-hidden h-full min-h-[420px]"
            style={{
                background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.04)'
            }}
        >
            <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.4, type: 'spring' }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                        >
                            <Gauge className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Budget Health</h3>
                            <p className="text-sm text-gray-500">This month's status</p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${health.bgColor} shadow-sm`}
                    >
                        <StatusIcon className={`w-4 h-4 ${health.color}`} />
                        <span className={`font-bold text-sm ${health.color}`}>{health.status}</span>
                    </motion.div>
                </div>

                {/* Gauge Section - Separate from percentage */}
                <div className="relative flex flex-col items-center mb-4">
                    {/* Gauge SVG */}
                    <div className="relative w-full h-24 flex items-end justify-center overflow-hidden">
                        <svg width="200" height="100" viewBox="0 0 200 100" className="overflow-visible">
                            {/* Background arc */}
                            <path
                                d="M 15 90 A 85 85 0 0 1 185 90"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="14"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="gaugeGradientFixed" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#10B981" />
                                    <stop offset="40%" stopColor="#3B82F6" />
                                    <stop offset="70%" stopColor="#F59E0B" />
                                    <stop offset="100%" stopColor="#EF4444" />
                                </linearGradient>
                            </defs>
                            <motion.path
                                d="M 15 90 A 85 85 0 0 1 185 90"
                                fill="none"
                                stroke="url(#gaugeGradientFixed)"
                                strokeWidth="14"
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                            />
                            {/* Center pivot */}
                            <circle cx="100" cy="90" r="8" fill="#1F2937" />
                            <circle cx="100" cy="90" r="4" fill="#fff" />
                            {/* Needle */}
                            <motion.g
                                initial={{ rotate: -90 }}
                                animate={{ rotate: needleRotation }}
                                transition={{
                                    duration: 2,
                                    delay: 1.5,
                                    type: 'spring',
                                    stiffness: 50,
                                    damping: 12,
                                }}
                                style={{ transformOrigin: '100px 90px' }}
                            >
                                <line
                                    x1="100"
                                    y1="90"
                                    x2="100"
                                    y2="25"
                                    stroke="#1F2937"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <circle cx="100" cy="25" r="4" fill="#EF4444" />
                            </motion.g>
                        </svg>
                    </div>

                    {/* Percentage Display - Below gauge, not overlapping */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 2, type: 'spring' }}
                        className="text-center mt-2"
                    >
                        <div className="text-4xl font-black text-gray-900 leading-none">
                            {percentage.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500 font-medium mt-1">Budget Used</div>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2 }}
                    className="grid grid-cols-2 gap-3 mb-4"
                >
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Total Budget</p>
                        <p className="text-lg font-bold text-gray-900">
                            ₹{budget.toLocaleString('en-IN')}
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Spent</p>
                        <p className={`text-lg font-bold ${health.color}`}>
                            ₹{spent.toLocaleString('en-IN')}
                        </p>
                    </div>
                </motion.div>

                {/* Remaining Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.4 }}
                    className={`p-4 rounded-xl ${health.bgColor} border flex-1`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Remaining</span>
                        <span className={`text-sm font-bold ${health.color} px-2 py-0.5 rounded-full bg-white/70`}>
                            {remainingPercentage.toFixed(0)}%
                        </span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 mb-2">
                        ₹{remaining.toLocaleString('en-IN')}
                    </div>
                    <div className="h-2 bg-white/70 rounded-full overflow-hidden mb-2">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${remainingPercentage}%` }}
                            transition={{ duration: 1.5, delay: 2.6 }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                        />
                    </div>
                    <p className="text-sm text-gray-600">{health.message}</p>
                </motion.div>
            </div>
        </motion.div>
    );
});
