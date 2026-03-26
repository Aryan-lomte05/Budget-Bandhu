'use client';

import { motion, Variants } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { NumericFormat } from 'react-number-format';

interface QuickStatsProps {
    monthSpent: number;
    monthSaved: number;
    savingsRate: number;
}

export function QuickStats({ monthSpent, monthSaved, savingsRate }: QuickStatsProps) {
    const stats = [
        {
            id: 1,
            label: 'MONTH SPENT',
            value: monthSpent,
            emoji: '💸',
            trend: 'down',
            trendValue: 8,
            cardClass: 'mm-card-orange',
        },
        {
            id: 2,
            label: 'MONTH SAVED',
            value: monthSaved,
            emoji: '💰',
            trend: 'up',
            trendValue: 15,
            cardClass: 'mm-card-green',
        },
        {
            id: 3,
            label: 'SAVINGS RATE',
            value: savingsRate,
            emoji: '📈',
            trend: 'up',
            trendValue: 5,
            cardClass: 'mm-card-blue',
            isPercentage: true,
        },
    ];

    // Staggered animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.9,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 12,
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mm-grid-3"
        >
            {stats.map((stat, index) => {
                const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;

                return (
                    <motion.div
                        key={stat.id}
                        variants={itemVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.05,
                            transition: { type: 'spring', stiffness: 300 }
                        }}
                        className={`mm-card-colored ${stat.cardClass} text-center`}
                    >
                        {/* Emoji Icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: 0.3 + index * 0.15,
                                type: 'spring',
                                stiffness: 200,
                            }}
                            className="text-7xl mb-4"
                        >
                            {stat.emoji}
                        </motion.div>

                        {/* Value */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 + index * 0.15, type: 'spring' }}
                            className="text-4xl font-bold mb-2"
                        >
                            {stat.isPercentage ? (
                                <span>{stat.value}%</span>
                            ) : (
                                <NumericFormat
                                    value={stat.value}
                                    displayType="text"
                                    thousandSeparator=","
                                    prefix="₹"
                                    renderText={(value) => <span>{value}</span>}
                                />
                            )}
                        </motion.div>

                        {/* Label */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.15 }}
                            className="text-sm font-bold tracking-wider mb-4 uppercase"
                        >
                            {stat.label}
                        </motion.div>

                        {/* Trend Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.15 }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full"
                        >
                            <TrendIcon className="w-4 h-4" />
                            <span className="text-sm font-bold">
                                {stat.trend === 'up' ? '+' : '-'}{stat.trendValue}%
                            </span>
                        </motion.div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
