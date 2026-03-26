"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default function LumpsumCalculator() {
    const router = useRouter();
    const [investment, setInvestment] = useState(1000000);
    const [returnRate, setReturnRate] = useState(12);
    const [years, setYears] = useState(10);

    const calculateLumpsum = () => {
        const futureValue = investment * Math.pow(1 + returnRate / 100, years);
        const returns = futureValue - investment;

        return { futureValue, returns };
    };

    const { futureValue, returns } = calculateLumpsum();

    // Year-wise breakdown
    const getYearlyBreakdown = () => {
        const breakdown = [];
        for (let year = 1; year <= Math.min(years, 20); year++) {
            const value = investment * Math.pow(1 + returnRate / 100, year);
            const yearReturns = value - investment;
            breakdown.push({ year, value, returns: yearReturns });
        }
        return breakdown;
    };

    return (
        <div className="max-w-7xl mx-auto">
            <Button onClick={() => router.back()} variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="glass p-8 rounded-2xl border-2 border-white/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-lavender-100 rounded-xl flex items-center justify-center">
                            <Gem className="w-6 h-6 text-lavender-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Lumpsum Calculator</h1>
                            <p className="text-sm text-gray-600">One-time investment returns</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Investment Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Investment Amount
                            </label>
                            <Input
                                type="number"
                                value={investment}
                                onChange={(e) => setInvestment(Number(e.target.value))}
                                className="mb-3"
                            />
                            <Slider
                                value={investment}
                                onChange={setInvestment}
                                min={10000}
                                max={10000000}
                                step={10000}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>₹10K</span>
                                <span>₹1Cr</span>
                            </div>
                        </div>

                        {/* Expected Return Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expected Return Rate (% p.a.)
                            </label>
                            <Input
                                type="number"
                                value={returnRate}
                                onChange={(e) => setReturnRate(Number(e.target.value))}
                                className="mb-3"
                                step="0.5"
                            />
                            <Slider
                                value={returnRate}
                                onChange={setReturnRate}
                                min={1}
                                max={30}
                                step={0.5}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1%</span>
                                <span>30%</span>
                            </div>
                        </div>

                        {/* Time Period */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Time Period (Years)
                            </label>
                            <Input
                                type="number"
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className="mb-3"
                            />
                            <Slider
                                value={years}
                                onChange={setYears}
                                min={1}
                                max={40}
                                step={1}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1 Year</span>
                                <span>40 Years</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {/* Future Value Card */}
                    <motion.div
                        key={futureValue}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="glass p-8 rounded-2xl border-2 border-white/50 text-center"
                    >
                        <p className="text-sm text-gray-600 mb-2">Future Value</p>
                        <motion.h2
                            className="text-5xl font-bold bg-gradient-to-r from-lavender-600 to-skyBlue-600 bg-clip-text text-transparent mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {formatCurrency(futureValue)}
                        </motion.h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Investment</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {formatCurrency(investment)}
                                </p>
                            </div>
                            <div className="p-4 bg-lavender-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Total Returns</p>
                                <p className="text-xl font-bold text-lavender-600">
                                    {formatCurrency(returns)}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Summary */}
                    <div className="glass p-6 rounded-2xl border-2 border-white/50">
                        <h3 className="font-bold text-gray-900 mb-4">Investment Summary</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">One-time Investment</span>
                                <span className="font-semibold text-gray-900">
                                    {formatCurrency(investment)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Expected Return</span>
                                <span className="font-semibold text-gray-900">{returnRate}% p.a.</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Time Period</span>
                                <span className="font-semibold text-gray-900">{years} years</span>
                            </div>
                            <div className="h-px bg-gray-200" />
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Gain</span>
                                <span className="font-semibold text-lavender-600">
                                    {formatCurrency(returns)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Growth Multiple</span>
                                <span className="font-semibold text-skyBlue-600">
                                    {(futureValue / investment).toFixed(2)}x
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Absolute Return</span>
                                <span className="font-semibold text-mint-600">
                                    {((returns / investment) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Comparison with SIP */}
                    <div className="glass p-6 rounded-2xl border-2 border-mint-200 bg-mint-50">
                        <p className="text-sm text-mint-900">
                            💡 <strong>Lumpsum vs SIP:</strong> Lumpsum works best when markets are low. If you're unsure, consider splitting your investment into monthly SIPs to average out market volatility!
                        </p>
                    </div>
                </div>
            </div>

            {/* Year-wise Growth Table */}
            <div className="mt-6 glass p-6 rounded-2xl border-2 border-white/50">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Year-wise Growth</h3>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Year</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Investment Value</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Returns</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getYearlyBreakdown().map((row) => (
                                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-900">{row.year}</td>
                                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                                        {formatCurrency(row.value)}
                                    </td>
                                    <td className="py-3 px-4 text-right text-lavender-600 font-semibold">
                                        {formatCurrency(row.returns)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {years > 20 && (
                    <p className="text-xs text-gray-500 mt-3 text-center">
                        Showing first 20 years of {years} year investment
                    </p>
                )}
            </div>
        </div>
    );
}
