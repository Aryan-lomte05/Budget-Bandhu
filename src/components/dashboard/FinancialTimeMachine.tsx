'use client';

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, TrendingDown, ArrowRight, Zap, PiggyBank, Wallet, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { mockData } from '@/lib/api/mock-data';

interface TimeComparison {
    period: string;
    label: string;
    current: { income: number; expenses: number; savings: number; balance: number; };
    past: { income: number; expenses: number; savings: number; balance: number; };
}

interface FinancialTimeMachineProps {
    forecast?: {
        horizon: string;
        predicted_savings: number;
        confidence: number;
    };
}

export const FinancialTimeMachine = memo(function FinancialTimeMachine({ forecast }: FinancialTimeMachineProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year' | 'future'>('month');
    const [currentPage, setCurrentPage] = useState(0);

    // Construct data including Future Forecast if available
    const comparisons: Record<string, TimeComparison> = {
        ...mockData.financialHistory as any,
        future: forecast ? {
            period: 'Next 30 Days',
            label: 'AI Forecast',
            current: {
                income: 0, // Placeholder
                expenses: 0, // Placeholder
                savings: 0,
                balance: 0
            },
            past: {
                income: 0,
                expenses: 0,
                savings: forecast.predicted_savings,
                balance: 0
            }
        } : null
    };

    const data = comparisons[selectedPeriod] || comparisons['month'];

    const calculateChange = (current: number, past: number) => {
        const change = current - past;
        const percentage = ((change / past) * 100).toFixed(1);
        return { change, percentage, isPositive: change >= 0 };
    };

    const allMetrics = [
        { name: 'Income', current: data.current.income, past: data.past.income, icon: TrendingUp, color: 'bg-emerald-500', barColor: 'bg-emerald-400', goodDirection: 'up' },
        { name: 'Expenses', current: data.current.expenses, past: data.past.expenses, icon: Wallet, color: 'bg-rose-500', barColor: 'bg-rose-400', goodDirection: 'down' },
        { name: 'Savings', current: data.current.savings, past: data.past.savings, icon: PiggyBank, color: 'bg-cyan-500', barColor: 'bg-cyan-400', goodDirection: 'up' },
        { name: 'Balance', current: data.current.balance, past: data.past.balance, icon: Zap, color: 'bg-amber-500', barColor: 'bg-amber-400', goodDirection: 'up' },
    ];

    // Show 4 metrics per page
    const totalPages = Math.ceil(allMetrics.length / 4);
    const metrics = allMetrics.slice(currentPage * 4, (currentPage + 1) * 4);

    const handlePrev = () => {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative rounded-3xl overflow-hidden p-6 h-full"
            style={{
                background: 'linear-gradient(145deg, #0F766E 0%, #0D9488 100%)',
                boxShadow: '0 20px 50px rgba(13, 148, 136, 0.3)'
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center"
                    >
                        <Clock className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                        <h3 className="text-xl font-black text-white">Time Machine</h3>
                        <p className="text-sm text-teal-100">Compare your journey</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 p-1 bg-white/20 rounded-xl">
                    {(['month', 'quarter', 'year', 'future'] as const).map((period) => {
                        if (period === 'future' && !forecast) return null;
                        return (
                            <motion.button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${selectedPeriod === period
                                    ? 'bg-white text-teal-700'
                                    : 'text-white/80 hover:text-white'
                                    }`}
                            >
                                {period === 'month' ? '1M' : period === 'quarter' ? '3M' : period === 'year' ? '1Y' : '🔮 Future'}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Time Comparison Label */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-3 mb-6"
            >
                <div className="px-3 py-1.5 bg-white/20 rounded-lg">
                    <span className="text-sm font-semibold text-white">Current {data.period}</span>
                </div>
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <ArrowRight className="w-4 h-4 text-teal-200" />
                </motion.div>
                <div className="px-3 py-1.5 bg-white/10 rounded-lg">
                    <span className="text-sm text-teal-100">{data.label}</span>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${selectedPeriod}-${currentPage}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-2 gap-3"
                >
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;

                        // Special handling for Future Forecast
                        if (selectedPeriod === 'future') {
                            if (metric.name === 'Savings') {
                                return (
                                    <motion.div
                                        key={metric.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="col-span-2 p-4 bg-white rounded-2xl border-2 border-teal-400 shadow-lg"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
                                                <Sparkles className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">AI Predicted Savings</p>
                                                <p className="text-2xl font-black text-gray-900">₹{metric.past.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-teal-600 font-medium bg-teal-50 p-2 rounded-lg">
                                            Based on your recent spending habits (LSTM Model)
                                        </div>
                                    </motion.div>
                                );
                            }
                            return null; // Hide other metrics for now
                        }

                        const change = calculateChange(metric.current, metric.past);
                        const isGood = metric.goodDirection === 'up' ? change.isPositive : !change.isPositive;

                        return (
                            <motion.div
                                key={metric.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                                whileHover={{ y: -3 }}
                                className="p-4 bg-white rounded-2xl"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                        className={`w-9 h-9 rounded-xl ${metric.color} flex items-center justify-center`}
                                    >
                                        <Icon className="w-4 h-4 text-white" />
                                    </motion.div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${isGood ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                                    >
                                        {change.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {change.percentage}%
                                    </motion.div>
                                </div>

                                <p className="text-xs text-gray-500 mb-1">{metric.name}</p>
                                <p className="text-xl font-black text-gray-900">₹{metric.current.toLocaleString('en-IN')}</p>

                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((metric.current / Math.max(metric.current, metric.past)) * 100, 100)}%` }}
                                        transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                                        className={`h-full ${metric.barColor} rounded-full`}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
                <motion.button
                    onClick={handlePrev}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </motion.button>
                <div className="flex gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <motion.div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${i === currentPage ? 'bg-white' : 'bg-white/40'}`}
                            whileHover={{ scale: 1.2 }}
                            onClick={() => setCurrentPage(i)}
                            style={{ cursor: 'pointer' }}
                        />
                    ))}
                </div>
                <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
});
