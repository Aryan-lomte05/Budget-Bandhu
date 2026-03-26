'use client';

import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, AlertCircle, CheckCircle, Plus, Calculator, PiggyBank, Heart, Home, GraduationCap, Shield } from 'lucide-react';
import { mockData } from '@/lib/api/mock-data';

interface TaxInvestment {
    id: string;
    category: string;
    amount: number;
    limit: number;
    icon: any;
    color: string;
    gradient: string;
    description: string;
}

export const TaxOptimizerDashboard = memo(function TaxOptimizerDashboard() {
    const maxLimit80C = mockData.tax.maxLimit80C;

    const getInvestStyle = (category: string) => {
        switch (category) {
            case 'PPF': return { icon: PiggyBank, color: 'emerald', gradient: 'from-emerald-500 to-green-600' };
            case 'ELSS': return { icon: TrendingUp, color: 'blue', gradient: 'from-blue-500 to-cyan-600' };
            case 'Life Insurance': return { icon: Shield, color: 'purple', gradient: 'from-purple-500 to-pink-600' };
            case 'Home Loan': return { icon: Home, color: 'orange', gradient: 'from-orange-500 to-red-600' };
            case 'Tuition Fees': return { icon: GraduationCap, color: 'indigo', gradient: 'from-indigo-500 to-purple-600' };
            default: return { icon: FileText, color: 'gray', gradient: 'from-gray-500 to-gray-600' };
        }
    };

    const investments: TaxInvestment[] = mockData.tax.investments.map(inv => {
        const style = getInvestStyle(inv.category);
        return {
            id: inv.id,
            category: inv.category,
            amount: inv.amount,
            limit: inv.limit,
            description: inv.description,
            icon: style.icon,
            color: style.color,
            gradient: style.gradient
        };
    });

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const remaining = maxLimit80C - totalInvested;
    const percentage = (totalInvested / maxLimit80C) * 100;
    const taxSaved = totalInvested * 0.3; // Assuming 30% tax bracket
    const potentialSavings = remaining * 0.3;

    const getStatusColor = () => {
        if (percentage >= 100) return { color: 'text-emerald-600', bg: 'bg-emerald-50', status: 'Maxed Out!' };
        if (percentage >= 75) return { color: 'text-blue-600', bg: 'bg-blue-50', status: 'Almost There' };
        if (percentage >= 50) return { color: 'text-orange-600', bg: 'bg-orange-50', status: 'Good Progress' };
        return { color: 'text-red-600', bg: 'bg-red-50', status: 'Needs Attention' };
    };

    const status = getStatusColor();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/50 p-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Tax Optimizer</h3>
                        <p className="text-sm text-gray-500">Section 80C Deductions</p>
                    </div>
                </div>

                {/* Status Badge */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: 'spring' }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bg}`}
                >
                    {percentage >= 100 ? (
                        <CheckCircle className={`w-5 h-5 ${status.color}`} />
                    ) : (
                        <AlertCircle className={`w-5 h-5 ${status.color}`} />
                    )}
                    <span className={`font-bold ${status.color}`}>{status.status}</span>
                </motion.div>
            </div>

            {/* Main Progress Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Circular Progress */}
                <div className="flex items-center justify-center">
                    <div className="relative w-64 h-64">
                        {/* SVG Circle */}
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                            {/* Background circle */}
                            <circle
                                cx="100"
                                cy="100"
                                r="85"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="20"
                            />

                            {/* Progress circle */}
                            <motion.circle
                                cx="100"
                                cy="100"
                                r="85"
                                fill="none"
                                stroke="url(#taxGradient)"
                                strokeWidth="20"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: Math.min(percentage / 100, 1) }}
                                transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                                strokeDasharray={2 * Math.PI * 85}
                            />

                            {/* Gradient definition */}
                            <defs>
                                <linearGradient id="taxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#F59E0B" />
                                    <stop offset="100%" stopColor="#EF4444" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Center content */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.5, type: 'spring' }}
                            className="absolute inset-0 flex flex-col items-center justify-center"
                        >
                            <div className="text-5xl font-black text-gray-900 mb-2">
                                {percentage.toFixed(0)}%
                            </div>
                            <div className="text-sm text-gray-600 font-medium mb-1">
                                ₹{totalInvested.toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs text-gray-500">
                                of ₹1,50,000
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="space-y-4">
                    {/* Tax Saved */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-emerald-700 font-medium">Tax Saved</p>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-emerald-800">
                            ₹{taxSaved.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-emerald-600 mt-1">at 30% tax bracket</p>
                    </motion.div>

                    {/* Remaining Limit */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                        className="p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
                                <Calculator className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-orange-700 font-medium">Remaining Limit</p>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-orange-800">
                            ₹{remaining.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                            Save ₹{potentialSavings.toLocaleString('en-IN')} more in tax
                        </p>
                    </motion.div>

                    {/* Financial Year */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                        className="p-4 bg-blue-50 rounded-xl border border-blue-200"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-blue-900">FY 2025-26</span>
                            <span className="text-xs text-blue-600">Due: March 31, 2026</span>
                        </div>
                        <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '65%' }}
                                transition={{ duration: 1.5, delay: 1.3 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"
                            />
                        </div>
                        <p className="text-xs text-blue-600 mt-1">65% of FY elapsed</p>
                    </motion.div>
                </div>
            </div>

            {/* Investment Categories */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Your Investments</h4>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add Investment
                    </motion.button>
                </div>

                <div className="space-y-3">
                    {investments.map((inv, index) => {
                        const Icon = inv.icon;
                        const invPercentage = (inv.amount / maxLimit80C) * 100;

                        return (
                            <motion.div
                                key={inv.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2 + index * 0.1 }}
                                whileHover={{ x: 5 }}
                                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-white hover:border-gray-300 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            whileHover={{ rotate: 10, scale: 1.1 }}
                                            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${inv.gradient} flex items-center justify-center shadow-lg`}
                                        >
                                            <Icon className="w-5 h-5 text-white" />
                                        </motion.div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{inv.category}</p>
                                            <p className="text-xs text-gray-500">{inv.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            ₹{inv.amount.toLocaleString('en-IN')}
                                        </p>
                                        <p className="text-xs text-gray-500">{invPercentage.toFixed(1)}% of limit</p>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${invPercentage}%` }}
                                        transition={{ duration: 1, delay: 1.5 + index * 0.1 }}
                                        className={`h-full bg-gradient-to-r ${inv.gradient} rounded-full relative overflow-hidden`}
                                    >
                                        {/* Shimmer */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: 'linear', repeatDelay: 1 }}
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Recommendation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200"
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">Tax Saving Recommendation 💡</h4>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            {percentage >= 100 ? (
                                <>
                                    Excellent! You've maxed out your 80C deductions. Consider exploring other tax-saving options like
                                    <span className="font-semibold text-orange-600"> 80D (Health Insurance)</span> and
                                    <span className="font-semibold text-orange-600"> NPS (80CCD)</span> for additional savings!
                                </>
                            ) : percentage >= 75 ? (
                                <>
                                    You're close to maximizing your 80C limit! Invest the remaining
                                    <span className="font-bold text-orange-600"> ₹{remaining.toLocaleString('en-IN')}</span> before March 31st
                                    to save an additional <span className="font-bold text-emerald-600">₹{potentialSavings.toLocaleString('en-IN')}</span> in taxes.
                                </>
                            ) : (
                                <>
                                    You have <span className="font-bold text-orange-600">₹{remaining.toLocaleString('en-IN')}</span> remaining in your 80C limit.
                                    Investing this amount could save you <span className="font-bold text-emerald-600">₹{potentialSavings.toLocaleString('en-IN')}</span> in taxes.
                                    Consider PPF, ELSS, or life insurance to maximize savings! 🚀
                                </>
                            )}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                        >
                            Explore Options
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
});
