"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sunset, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default function RetirementCalculator() {
    const router = useRouter();
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(60);
    const [currentSavings, setCurrentSavings] = useState(500000);
    const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
    const [inflationRate, setInflationRate] = useState(6);
    const [returnRate, setReturnRate] = useState(12);

    const calculateRetirement = () => {
        const yearsToRetirement = retirementAge - currentAge;
        const retirementYears = 85 - retirementAge; // Assume living till 85

        // Future value of current expenses (accounting for inflation)
        const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);

        // Required corpus using 4% rule (or 25x annual expenses)
        const annualExpensesAtRetirement = futureMonthlyExpenses * 12;
        const requiredCorpus = annualExpensesAtRetirement * 25;

        // Future value of current savings
        const futureValueOfSavings = currentSavings * Math.pow(1 + returnRate / 100, yearsToRetirement);

        // Shortfall
        const shortfall = Math.max(0, requiredCorpus - futureValueOfSavings);

        // Monthly SIP required to meet shortfall
        const monthlyRate = returnRate / 12 / 100;
        const months = yearsToRetirement * 12;
        const monthlySIPRequired = months > 0
            ? shortfall / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
            : 0;

        // First year withdrawal (4% of corpus)
        const firstYearWithdrawal = requiredCorpus * 0.04;

        return {
            yearsToRetirement,
            retirementYears,
            futureMonthlyExpenses,
            requiredCorpus,
            futureValueOfSavings,
            shortfall,
            monthlySIPRequired,
            firstYearWithdrawal,
        };
    };

    const data = calculateRetirement();

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
                        <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center">
                            <Sunset className="w-6 h-6 text-coral-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Retirement Planner</h1>
                            <p className="text-sm text-gray-600">Plan your golden years</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Current Age */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Age
                            </label>
                            <Input
                                type="number"
                                value={currentAge}
                                onChange={(e) => setCurrentAge(Number(e.target.value))}
                                className="mb-3"
                            />
                            <Slider
                                value={currentAge}
                                onChange={setCurrentAge}
                                min={20}
                                max={60}
                                step={1}
                            />
                        </div>

                        {/* Retirement Age */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Retirement Age
                            </label>
                            <Input
                                type="number"
                                value={retirementAge}
                                onChange={(e) => setRetirementAge(Number(e.target.value))}
                                className="mb-3"
                            />
                            <Slider
                                value={retirementAge}
                                onChange={setRetirementAge}
                                min={currentAge + 1}
                                max={75}
                                step={1}
                            />
                        </div>

                        {/* Current Savings */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Retirement Savings
                            </label>
                            <Input
                                type="number"
                                value={currentSavings}
                                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                            />
                        </div>

                        {/* Monthly Expenses */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Monthly Expenses
                            </label>
                            <Input
                                type="number"
                                value={monthlyExpenses}
                                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                            />
                        </div>

                        {/* Inflation Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expected Inflation Rate (%)
                            </label>
                            <Input
                                type="number"
                                value={inflationRate}
                                onChange={(e) => setInflationRate(Number(e.target.value))}
                                className="mb-3"
                                step="0.5"
                            />
                            <Slider
                                value={inflationRate}
                                onChange={setInflationRate}
                                min={3}
                                max={10}
                                step={0.5}
                            />
                        </div>

                        {/* Expected Return */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expected Return Rate (%)
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
                                min={6}
                                max={18}
                                step={0.5}
                            />
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {/* Required Corpus */}
                    <motion.div
                        key={data.requiredCorpus}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="glass p-8 rounded-2xl border-2 border-white/50 text-center"
                    >
                        <p className="text-sm text-gray-600 mb-2">Required Retirement Corpus</p>
                        <motion.h2
                            className="text-5xl font-bold bg-gradient-to-r from-coral-600 to-lavender-600 bg-clip-text text-transparent mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {formatCurrency(data.requiredCorpus)}
                        </motion.h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Current Savings</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(currentSavings)}
                                </p>
                            </div>
                            <div className="p-4 bg-mint-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Future Value</p>
                                <p className="text-lg font-bold text-mint-600">
                                    {formatCurrency(data.futureValueOfSavings)}
                                </p>
                            </div>
                        </div>

                        {data.shortfall > 0 && (
                            <div className="p-4 bg-coral-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Shortfall to Cover</p>
                                <p className="text-2xl font-bold text-coral-600">
                                    {formatCurrency(data.shortfall)}
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Monthly SIP Required */}
                    {data.shortfall > 0 && (
                        <div className="glass p-6 rounded-2xl border-2 border-mint-200 bg-mint-50">
                            <div className="flex items-center gap-3 mb-4">
                                <TrendingUp className="w-6 h-6 text-mint-600" />
                                <div>
                                    <h3 className="font-bold text-gray-900">Start Investing Today!</h3>
                                    <p className="text-sm text-gray-600">Monthly SIP Required</p>
                                </div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl">
                                <p className="text-4xl font-bold text-mint-600">
                                    {formatCurrency(data.monthlySIPRequired)}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">per month for {data.yearsToRetirement} years</p>
                            </div>
                        </div>
                    )}

                    {/* Retirement Summary */}
                    <div className="glass p-6 rounded-2xl border-2 border-white/50">
                        <h3 className="font-bold text-gray-900 mb-4">Retirement Summary</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Years to Retirement</span>
                                <span className="font-semibold text-gray-900">{data.yearsToRetirement} years</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Retirement Duration</span>
                                <span className="font-semibold text-gray-900">{data.retirementYears} years</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Current Monthly Expenses</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(monthlyExpenses)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Future Monthly Expenses</span>
                                <span className="font-semibold text-coral-600">
                                    {formatCurrency(data.futureMonthlyExpenses)}
                                </span>
                            </div>
                            <div className="h-px bg-gray-200" />
                            <div className="flex justify-between">
                                <span className="text-gray-600">First Year Withdrawal (4% Rule)</span>
                                <span className="font-semibold text-gray-900">
                                    {formatCurrency(data.firstYearWithdrawal)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Monthly Income in Retirement</span>
                                <span className="font-semibold text-mint-600">
                                    {formatCurrency(data.firstYearWithdrawal / 12)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 4% Rule Explanation */}
                    <div className="glass p-6 rounded-2xl border-2 border-skyBlue-200 bg-skyBlue-50">
                        <p className="text-sm text-skyBlue-900">
                            💡 <strong>The 4% Rule:</strong> Withdraw 4% of your retirement corpus in the first year, then adjust annually for inflation. This strategy aims to make your money last 30+ years!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
