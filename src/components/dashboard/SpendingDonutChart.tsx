'use client';

import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { ShoppingBag, Utensils, Car, Home, Heart, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { mockData } from '@/lib/api/mock-data';

interface SpendingCategory {
    name: string;
    value: number;
    color: string;
    icon: any;
    percentage: number;
    [key: string]: any;
}

interface SpendingDonutChartProps {
    data?: Record<string, { total: number; count: number }>;
}

export const SpendingDonutChart = memo(function SpendingDonutChart({ data: categoryBreakdown }: SpendingDonutChartProps) {
    const PieComponent = Pie as any;
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

    const getCategoryDetails = (category: string) => {
        switch (category) {
            case 'Shopping': return { icon: ShoppingBag, color: '#EC4899' };
            case 'Food & Dining': return { icon: Utensils, color: '#F59E0B' };
            case 'Transport': return { icon: Car, color: '#3B82F6' };
            case 'Bills & Utilities': return { icon: Zap, color: '#10B981' };
            case 'Housing': return { icon: Home, color: '#8B5CF6' };
            case 'Healthcare': return { icon: Heart, color: '#EF4444' };
            default: return { icon: TrendingUp, color: '#6B7280' };
        }
    };

    // Transform API data or use fallback
    const chartData: SpendingCategory[] = categoryBreakdown
        ? Object.entries(categoryBreakdown)
            .map(([name, stats]) => {
                const details = getCategoryDetails(name);
                return {
                    name,
                    value: stats.total,
                    color: details.color,
                    icon: details.icon,
                    percentage: 0 // Calculated below
                };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 6)
        : [];

    const totalSpending = chartData.reduce((sum, item) => sum + item.value, 0) || 1;
    chartData.forEach(item => item.percentage = (item.value / totalSpending) * 100);

    const data = chartData.length > 0 ? chartData : [
        { name: 'No Data', value: 1, color: '#E5E7EB', icon: TrendingUp, percentage: 100 }
    ];

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 15}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    className="drop-shadow-2xl"
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius - 2}
                    outerRadius={innerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill="#fff"
                />
            </g>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.4, type: 'spring' }}
            whileHover={{ scale: 1.02, rotateY: 2 }}
            className="relative rounded-3xl overflow-hidden p-6"
            style={{
                background: 'linear-gradient(145deg, #E9D5FF 0%, #DDD6FE 50%, #C4B5FD 100%)',
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(255,255,255,0.2)'
            }}
        >
            {/* Floating decorative elements */}
            <motion.div
                className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/30 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2] }}
                transition={{ duration: 6, repeat: Infinity }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="w-12 h-12 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg"
                    >
                        <Sparkles className="w-6 h-6 text-purple-700" />
                    </motion.div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Spending Breakdown</h3>
                        <p className="text-sm text-purple-700/70">By category this month</p>
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-right px-4 py-2 rounded-xl bg-white/40 backdrop-blur-sm"
                >
                    <p className="text-xs text-purple-700/70 uppercase tracking-wider">Total Spent</p>
                    <p className="text-2xl font-black text-gray-900">
                        ₹{totalSpending.toLocaleString('en-IN')}
                    </p>
                </motion.div>
            </div>

            {/* Chart Container */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donut Chart */}
                <div className="relative">
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <PieComponent
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                onMouseEnter={(_: any, index: number) => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(undefined)}
                                animationDuration={800}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        className="cursor-pointer transition-all"
                                        style={{ filter: activeIndex === index ? 'brightness(1.1)' : 'brightness(1)' }}
                                    />
                                ))}
                            </PieComponent>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Text */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: 'spring' }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div className="text-center bg-white/60 backdrop-blur-sm rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-lg">
                            {activeIndex !== undefined ? (
                                <>
                                    <motion.div
                                        key={activeIndex}
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="text-3xl font-black"
                                        style={{ color: data[activeIndex].color }}
                                    >
                                        {data[activeIndex].percentage.toFixed(0)}%
                                    </motion.div>
                                    <p className="text-xs text-gray-600 font-medium">{data[activeIndex].name}</p>
                                </>
                            ) : (
                                <>
                                    <div className="text-2xl font-black text-gray-900">100%</div>
                                    <p className="text-xs text-gray-500">Hover to explore</p>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Category List */}
                <div className="space-y-2">
                    {data.map((category, index) => {
                        const Icon = category.icon;
                        const isActive = activeIndex === index;

                        return (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(undefined)}
                                whileHover={{ x: 5, scale: 1.02 }}
                                className={`p-3 rounded-xl transition-all cursor-pointer ${isActive
                                    ? 'bg-white shadow-lg'
                                    : 'bg-white/50 hover:bg-white/80'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <motion.div
                                            animate={{ rotate: isActive ? 360 : 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: category.color + '20' }}
                                        >
                                            <Icon className="w-4 h-4" style={{ color: category.color }} />
                                        </motion.div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{category.name}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold" style={{ color: isActive ? category.color : '#111827' }}>
                                        ₹{category.value.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${category.percentage}%` }}
                                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: category.color }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
});
