'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

interface SpendingSparklineProps {
    data: Array<{ date: string; amount: number }>;
}

export const SpendingSparkline = memo(function SpendingSparkline({ data, height = 60 }: { data: any[]; height?: number }) {
    const firstValue = data[0]?.amount || 0;
    const lastValue = data[data.length - 1]?.amount || 0;
    const percentChange = ((lastValue - firstValue) / firstValue) * 100;
    const isPositive = percentChange >= 0;

    const total = data.reduce((sum, item) => sum + item.amount, 0);
    const average = Math.round(total / data.length);
    const max = Math.max(...data.map(d => d.amount));
    const min = Math.min(...data.map(d => d.amount));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-900 rounded-xl px-4 py-2 shadow-xl border border-gray-800"
                >
                    <p className="text-xs text-gray-400 mb-1">{payload[0].payload.date}</p>
                    <p className="text-lg font-bold text-white">
                        ₹{payload[0].value.toLocaleString('en-IN')}
                    </p>
                </motion.div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden h-full min-h-[420px]"
            style={{
                background: 'linear-gradient(145deg, #BFFF00 0%, #D4FF33 50%, #E8FF80 100%)',
                boxShadow: '0 20px 40px rgba(191, 255, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)'
            }}
        >
            <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Header */}
                <div className="mb-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gray-900/10 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-gray-900" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Spending Trend</h3>
                            <p className="text-sm text-gray-700">Last 30 days analytics</p>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-between mb-4"
                >
                    <div>
                        <p className="text-xs text-gray-600 mb-1 uppercase tracking-wider font-semibold">Daily Average</p>
                        <p className="text-3xl font-black text-gray-900">
                            ₹{average.toLocaleString('en-IN')}
                        </p>
                    </div>

                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full shadow-lg ${isPositive
                                ? 'bg-red-500 text-white'
                                : 'bg-emerald-500 text-white'
                            }`}
                    >
                        {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="text-sm font-bold">
                            {Math.abs(percentChange).toFixed(1)}%
                        </span>
                    </motion.div>
                </motion.div>

                {/* High/Low Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-between mb-4 text-sm"
                >
                    <div className="px-3 py-1.5 rounded-lg bg-gray-900/10">
                        <span className="text-gray-600">Highest: </span>
                        <span className="font-bold text-gray-900">₹{max.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-gray-900/10">
                        <span className="text-gray-600">Lowest: </span>
                        <span className="font-bold text-gray-900">₹{min.toLocaleString('en-IN')}</span>
                    </div>
                </motion.div>

                {/* Sparkline Chart */}
                <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex-1 min-h-[100px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                            <defs>
                                <linearGradient id="limeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#1f2937" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#1f2937" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <Tooltip content={<CustomTooltip />} cursor={false} />

                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#1f2937"
                                strokeWidth={3}
                                fill="url(#limeAreaGradient)"
                                dot={false}
                                activeDot={{
                                    r: 6,
                                    fill: '#1f2937',
                                    stroke: '#BFFF00',
                                    strokeWidth: 3,
                                }}
                                animationDuration={1500}
                                animationEasing="ease-in-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Bottom Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center gap-2 mt-4 py-3 rounded-xl bg-gray-900/10"
                >
                    <span className="text-sm text-gray-700">
                        {isPositive
                            ? '📈 Spending increased compared to last period'
                            : '📉 Great! You reduced spending compared to last period'
                        }
                    </span>
                </motion.div>
            </div>
        </motion.div>
    );
});
