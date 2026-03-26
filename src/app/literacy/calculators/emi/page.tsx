"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default function EMICalculator() {
    const router = useRouter();
    const [loanAmount, setLoanAmount] = useState(2500000);
    const [interestRate, setInterestRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);

    const calculateEMI = () => {
        const principal = loanAmount;
        const monthlyRate = interestRate / (12 * 100);
        const months = tenure * 12;

        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
            (Math.pow(1 + monthlyRate, months) - 1);

        const totalAmount = emi * months;
        const totalInterest = totalAmount - principal;

        return { emi, totalAmount, totalInterest };
    };

    const { emi, totalAmount, totalInterest } = calculateEMI();

    // Year-wise breakdown
    const getYearlyBreakdown = () => {
        const breakdown = [];
        let balance = loanAmount;
        const monthlyRate = interestRate / (12 * 100);

        for (let year = 1; year <= tenure; year++) {
            let yearlyPrincipal = 0;
            let yearlyInterest = 0;

            for (let month = 1; month <= 12; month++) {
                const interest = balance * monthlyRate;
                const principal = emi - interest;

                yearlyInterest += interest;
                yearlyPrincipal += principal;
                balance -= principal;
            }

            breakdown.push({
                year,
                principal: yearlyPrincipal,
                interest: yearlyInterest,
                balance: Math.max(0, balance),
            });
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
                        <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center">
                            <Home className="w-6 h-6 text-coral-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">EMI Calculator</h1>
                            <p className="text-sm text-gray-600">Plan your loan repayments</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Loan Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loan Amount
                            </label>
                            <Input
                                type="number"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                className="mb-3"
                            />
                            <Slider
                                value={loanAmount}
                                onChange={setLoanAmount}
                                min={100000}
                                max={50000000}
                                step={100000}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>₹1L</span>
                                <span>₹5Cr</span>
                            </div>
                        </div>

                        {/* Interest Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interest Rate (% p.a.)
                            </label>
                            <Input
                                type="number"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="mb-3"
                                step="0.1"
                            />
                            <Slider
                                value={interestRate}
                                onChange={setInterestRate}
                                min={5}
                                max={15}
                                step={0.1}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>5%</span>
                                <span>15%</span>
                            </div>
                        </div>

                        {/* Loan Tenure */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loan Tenure (Years)
                            </label>
                            <Input
                                type="number"
                                value={tenure}
                                onChange={(e) => setTenure(Number(e.target.value))}
                                className="mb-3"
                            />
                            <Slider
                                value={tenure}
                                onChange={setTenure}
                                min={1}
                                max={30}
                                step={1}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1 Year</span>
                                <span>30 Years</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {/* EMI Card */}
                    <motion.div
                        key={emi}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="glass p-8 rounded-2xl border-2 border-white/50 text-center"
                    >
                        <p className="text-sm text-gray-600 mb-2">Monthly EMI</p>
                        <motion.h2
                            className="text-5xl font-bold bg-gradient-to-r from-coral-600 to-coral-400 bg-clip-text text-transparent mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {formatCurrency(emi)}
                        </motion.h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Principal Amount</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(loanAmount)}
                                </p>
                            </div>
                            <div className="p-4 bg-coral-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Total Interest</p>
                                <p className="text-lg font-bold text-coral-600">
                                    {formatCurrency(totalInterest)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-skyBlue-50 rounded-xl">
                            <p className="text-xs text-gray-600 mb-1">Total Amount Payable</p>
                            <p className="text-2xl font-bold text-skyBlue-900">
                                {formatCurrency(totalAmount)}
                            </p>
                        </div>
                    </motion.div>

                    {/* Breakdown */}
                    <div className="glass p-6 rounded-2xl border-2 border-white/50">
                        <h3 className="font-bold text-gray-900 mb-4">Loan Summary</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Loan Amount</span>
                                <span className="font-semibold text-gray-900">
                                    {formatCurrency(loanAmount)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Interest Rate</span>
                                <span className="font-semibold text-gray-900">{interestRate}% p.a.</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Loan Tenure</span>
                                <span className="font-semibold text-gray-900">{tenure} years ({tenure * 12} months)</span>
                            </div>
                            <div className="h-px bg-gray-200 my-3" />
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Interest Payable</span>
                                <span className="font-semibold text-coral-600">
                                    {formatCurrency(totalInterest)}
                                </span>
                            </div>
                            <div className="flex justify-between text-base">
                                <span className="font-semibold text-gray-900">Total Amount</span>
                                <span className="font-bold text-gray-900">
                                    {formatCurrency(totalAmount)}
                                </span>
                            </div>
                        </div>

                        {/* Principal vs Interest Visualization */}
                        <div className="mt-6">
                            <div className="flex h-4 rounded-full overflow-hidden">
                                <div
                                    className="bg-gray-400"
                                    style={{ width: `${(loanAmount / totalAmount) * 100}%` }}
                                />
                                <div
                                    className="bg-coral-500"
                                    style={{ width: `${(totalInterest / totalAmount) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-400 rounded-sm" />
                                    <span className="text-gray-600">
                                        Principal ({((loanAmount / totalAmount) * 100).toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-coral-500 rounded-sm" />
                                    <span className="text-gray-600">
                                        Interest ({((totalInterest / totalAmount) * 100).toFixed(1)}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="glass p-6 rounded-2xl border-2 border-mint-200 bg-mint-50">
                        <div className="flex gap-3">
                            <TrendingDown className="w-5 h-5 text-mint-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-mint-900">
                                    <strong>Pro Tip:</strong> Making part-prepayments can significantly reduce your total interest burden. Even small additional payments towards principal can save lakhs over the loan tenure!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Year-wise Amortization Table */}
            <div className="mt-6 glass p-6 rounded-2xl border-2 border-white/50">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Year-wise Repayment Schedule</h3>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Year</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Principal Paid</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Interest Paid</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Outstanding Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getYearlyBreakdown().slice(0, 10).map((row) => (
                                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium text-gray-900">{row.year}</td>
                                    <td className="py-3 px-4 text-right text-gray-900">
                                        {formatCurrency(row.principal)}
                                    </td>
                                    <td className="py-3 px-4 text-right text-coral-600">
                                        {formatCurrency(row.interest)}
                                    </td>
                                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                                        {formatCurrency(row.balance)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {tenure > 10 && (
                    <p className="text-xs text-gray-500 mt-3 text-center">
                        Showing first 10 years of {tenure} year tenure
                    </p>
                )}
            </div>
        </div>
    );
}
