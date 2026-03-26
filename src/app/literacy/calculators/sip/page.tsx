"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default function SIPCalculator() {
    const router = useRouter();
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [returnRate, setReturnRate] = useState(12);
    const [years, setYears] = useState(10);

    const calculateSIP = () => {
        const monthlyRate = returnRate / 12 / 100;
        const months = years * 12;

        const futureValue = monthlyInvestment *
            (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

        const invested = monthlyInvestment * months;
        const returns = futureValue - invested;

        return { futureValue, invested, returns };
    };

    const { futureValue, invested, returns } = calculateSIP();

    return (
        <div className="max-w-5xl mx-auto">
            <Button onClick={() => router.back()} variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="bg-[#FFF1EB] shadow-sm p-8 rounded-2xl border-2 border-white/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-mint-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-mint-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-mm-purple">SIP Calculator</h1>
                            <p className="text-sm text-gray-600">Calculate your mutual fund returns</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Monthly Investment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Monthly Investment
                            </label>
                            <Input
                                type="number"
                                value={monthlyInvestment}
                                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                                className="mb-3"
                            />
                            <Slider
                                value={monthlyInvestment}
                                onChange={setMonthlyInvestment}
                                min={500}
                                max={100000}
                                step={500}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>₹500</span>
                                <span>₹1,00,000</span>
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
                    {/* Summary Card */}
                    <motion.div
                        key={futureValue}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="bg-[#FFF1EB] shadow-sm p-8 rounded-2xl border-2 border-white/50 text-center"
                    >
                        <p className="text-sm text-gray-600 mb-2">Future Value</p>
                        <motion.h2
                            className="text-5xl font-bold bg-gradient-to-r from-mint-600 to-skyBlue-600 bg-clip-text text-transparent mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {formatCurrency(futureValue)}
                        </motion.h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Total Invested</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {formatCurrency(invested)}
                                </p>
                            </div>
                            <div className="p-4 bg-mint-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Est. Returns</p>
                                <p className="text-xl font-bold text-mint-600">
                                    {formatCurrency(returns)}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Breakdown */}
                    <div className="bg-[#FFF1EB] shadow-sm p-6 rounded-2xl border-2 border-white/50">
                        <h3 className="font-bold text-gray-900 mb-4">Investment Breakdown</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Monthly Investment</span>
                                <span className="font-semibold text-gray-900">
                                    {formatCurrency(monthlyInvestment)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Months</span>
                                <span className="font-semibold text-gray-900">{years * 12}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Expected Return</span>
                                <span className="font-semibold text-gray-900">{returnRate}% p.a.</span>
                            </div>
                            <div className="h-px bg-gray-200 my-3" />
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-900">Wealth Gain</span>
                                <span className="font-bold text-mint-600">
                                    {((returns / invested) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="glass p-6 rounded-2xl border-2 border-skyBlue-200 bg-skyBlue-50">
                        <p className="text-sm text-skyBlue-900">
                            💡 <strong>Pro Tip:</strong> Starting SIPs early and staying invested for long durations can significantly multiply your wealth due to the power of compounding!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
