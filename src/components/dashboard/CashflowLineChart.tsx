'use client';

import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Brush } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Waves } from 'lucide-react';

interface CashflowData {
    date: string;
    income: number;
    expenses: number;
    netFlow: number;
}

interface CashflowLineChartProps {
    data?: Array<{ date: string; amount: number }>;
}

export const CashflowLineChart = memo(function CashflowLineChart({ data: spendingData }: CashflowLineChartProps) {
    const [selectedRange, setSelectedRange] = useState<[number, number]>([0, 29]);
    const [demoData, setDemoData] = useState<CashflowData[]>([]);

    useEffect(() => {
        if (!spendingData || spendingData.length === 0) {
            setDemoData(generateCashflowData());
        }
    }, [spendingData]);

    // Transform spending data or use fallback
    const allData: CashflowData[] = spendingData && spendingData.length > 0
        ? spendingData.map(d => ({
            date: d.date,
            income: Math.round(d.amount * 1.2), // Simulated income for now (until API update)
            expenses: d.amount,
            netFlow: Math.round(d.amount * 0.2)
        }))
        : demoData;

    function generateCashflowData(): CashflowData[] {
        const data: CashflowData[] = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const income = Math.floor(Math.random() * 15000) + 5000;
            const expenses = Math.floor(Math.random() * 12000) + 3000;
            data.push({
                date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                income,
                expenses,
                netFlow: income - expenses,
            });
        }
        return data;
    }
    const displayData = allData.slice(selectedRange[0], selectedRange[1] + 1);

    const totalIncome = displayData.reduce((sum, d) => sum + d.income, 0);
    const totalExpenses = displayData.reduce((sum, d) => sum + d.expenses, 0);
    const netCashflow = totalIncome - totalExpenses;
    const isPositive = netCashflow >= 0;

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border-2 border-cyan-200 rounded-xl p-4 shadow-xl"
                >
                    <p className="text-xs text-gray-600 mb-3 font-medium">{data.date}</p>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-emerald-600">Income</span>
                            <span className="text-sm font-bold text-emerald-700">₹{data.income.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-red-600">Expenses</span>
                            <span className="text-sm font-bold text-red-700">₹{data.expenses.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="pt-2 border-t">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm font-semibold">Net Flow</span>
                                <span className={`font-bold ${data.netFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {data.netFlow >= 0 ? '+' : ''}₹{data.netFlow.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.5, type: 'spring' }}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-3xl overflow-hidden p-6"
            style={{
                background: 'linear-gradient(145deg, #BFDBFE 0%, #93C5FD 50%, #60A5FA 100%)',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(255,255,255,0.2)'
            }}
        >
            {/* Floating decorative elements */}
            <motion.div
                className="absolute -top-10 -left-10 w-40 h-40 bg-white/30 rounded-full blur-3xl"
                animate={{ scale: [1, 1.3, 1], y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
                className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-300/40 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2] }}
                transition={{ duration: 8, repeat: Infinity }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.6, type: 'spring' }}
                        className="w-12 h-12 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg"
                    >
                        <Waves className="w-6 h-6 text-blue-700" />
                    </motion.div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Cashflow Trends</h3>
                        <p className="text-sm text-blue-800/70">Income vs Expenses over time</p>
                    </div>
                </div>
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl shadow"
                >
                    <Calendar className="w-4 h-4 text-blue-700" />
                    <span className="text-sm font-medium text-gray-700">Last {displayData.length} days</span>
                </motion.div>
            </div>

            {/* Summary Cards */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20, rotateZ: -5 }}
                    animate={{ opacity: 1, y: 0, rotateZ: 0 }}
                    whileHover={{ y: -5, rotateZ: 2 }}
                    transition={{ delay: 0.6 }}
                    className="p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg"
                        >
                            <TrendingUp className="w-5 h-5 text-white" />
                        </motion.div>
                        <p className="text-xs text-emerald-700 font-medium">Total Income</p>
                    </div>
                    <p className="text-2xl font-black text-emerald-800">₹{totalIncome.toLocaleString('en-IN')}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ delay: 0.7 }}
                    className="p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shadow-lg"
                        >
                            <TrendingDown className="w-5 h-5 text-white" />
                        </motion.div>
                        <p className="text-xs text-red-700 font-medium">Total Expenses</p>
                    </div>
                    <p className="text-2xl font-black text-red-800">₹{totalExpenses.toLocaleString('en-IN')}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20, rotateZ: 5 }}
                    animate={{ opacity: 1, y: 0, rotateZ: 0 }}
                    whileHover={{ y: -5, rotateZ: -2 }}
                    transition={{ delay: 0.8 }}
                    className="p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                            className={`w-10 h-10 rounded-xl ${isPositive ? 'bg-blue-500' : 'bg-orange-500'} flex items-center justify-center shadow-lg`}
                        >
                            <DollarSign className="w-5 h-5 text-white" />
                        </motion.div>
                        <p className={`text-xs ${isPositive ? 'text-blue-700' : 'text-orange-700'} font-medium`}>Net Cashflow</p>
                    </div>
                    <p className={`text-2xl font-black ${isPositive ? 'text-blue-800' : 'text-orange-800'}`}>
                        {isPositive ? '+' : ''}₹{netCashflow.toLocaleString('en-IN')}
                    </p>
                </motion.div>
            </div>

            {/* Main Chart */}
            <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="relative z-10 h-64 bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-4"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayData}>
                        <defs>
                            <linearGradient id="incomeGradientBlue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="expensesGradientBlue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} fill="url(#incomeGradientBlue)" animationDuration={1500} />
                        <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} fill="url(#expensesGradientBlue)" animationDuration={1500} />
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Legend */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="relative z-10 flex items-center justify-center gap-6"
            >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-sm text-gray-700 font-medium">Income</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-700 font-medium">Expenses</span>
                </div>
            </motion.div>
        </motion.div>
    );
});
