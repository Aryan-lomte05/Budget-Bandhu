"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default function TaxCalculator() {
    const router = useRouter();
    const [income, setIncome] = useState(1200000);
    const [deductions80C, setDeductions80C] = useState(150000);
    const [hra, setHra] = useState(0);
    const [homeLoanInterest, setHomeLoanInterest] = useState(0);
    const [regime, setRegime] = useState<'new' | 'old'>('new');

    const calculateNewRegimeTax = (taxableIncome: number) => {
        let tax = 0;

        if (taxableIncome <= 400000) {
            tax = 0;
        } else if (taxableIncome <= 800000) {
            tax = (taxableIncome - 400000) * 0.05;
        } else if (taxableIncome <= 1200000) {
            tax = 20000 + (taxableIncome - 800000) * 0.10;
        } else if (taxableIncome <= 1600000) {
            tax = 60000 + (taxableIncome - 1200000) * 0.15;
        } else {
            tax = 120000 + (taxableIncome - 1600000) * 0.20;
        }

        // Standard deduction
        const standardDeduction = 75000;
        return tax;
    };

    const calculateOldRegimeTax = (taxableIncome: number) => {
        let tax = 0;

        if (taxableIncome <= 250000) {
            tax = 0;
        } else if (taxableIncome <= 500000) {
            tax = (taxableIncome - 250000) * 0.05;
        } else if (taxableIncome <= 1000000) {
            tax = 12500 + (taxableIncome - 500000) * 0.20;
        } else {
            tax = 112500 + (taxableIncome - 1000000) * 0.30;
        }

        return tax;
    };

    const calculateTax = () => {
        let grossIncome = income;
        let taxableIncome = grossIncome;
        let totalDeductions = 0;

        if (regime === 'new') {
            // New regime: Standard deduction only
            const standardDeduction = Math.min(75000, grossIncome);
            totalDeductions = standardDeduction;
            taxableIncome = grossIncome - standardDeduction;
        } else {
            // Old regime: All deductions allowed
            const standardDeduction = Math.min(50000, grossIncome);
            totalDeductions = standardDeduction + deductions80C + hra + homeLoanInterest;
            taxableIncome = Math.max(0, grossIncome - totalDeductions);
        }

        const taxBeforeRebate = regime === 'new'
            ? calculateNewRegimeTax(taxableIncome)
            : calculateOldRegimeTax(taxableIncome);

        // Rebate under section 87A
        let rebate = 0;
        if (regime === 'new' && taxableIncome <= 700000) {
            rebate = Math.min(25000, taxBeforeRebate);
        } else if (regime === 'old' && taxableIncome <= 500000) {
            rebate = Math.min(12500, taxBeforeRebate);
        }

        const taxAfterRebate = taxBeforeRebate - rebate;

        // Health & Education Cess (4%)
        const cess = taxAfterRebate * 0.04;

        const totalTax = taxAfterRebate + cess;

        return {
            grossIncome,
            totalDeductions,
            taxableIncome,
            taxBeforeRebate,
            rebate,
            taxAfterRebate,
            cess,
            totalTax,
            takeHome: grossIncome - totalTax,
        };
    };

    const taxData = calculateTax();

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
                            <FileText className="w-6 h-6 text-lavender-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Tax Calculator</h1>
                            <p className="text-sm text-gray-600">FY 2025-26 (AY 2026-27)</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Tax Regime Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select Tax Regime
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setRegime('new')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${regime === 'new'
                                            ? 'bg-mint-50 border-mint-500 text-mint-900'
                                            : 'bg-white border-gray-200 hover:border-mint-500'
                                        }`}
                                >
                                    <div className="font-semibold mb-1">New Regime</div>
                                    <div className="text-xs text-gray-600">Lower rates, fewer deductions</div>
                                </button>
                                <button
                                    onClick={() => setRegime('old')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${regime === 'old'
                                            ? 'bg-skyBlue-50 border-skyBlue-500 text-skyBlue-900'
                                            : 'bg-white border-gray-200 hover:border-skyBlue-500'
                                        }`}
                                >
                                    <div className="font-semibold mb-1">Old Regime</div>
                                    <div className="text-xs text-gray-600">All deductions allowed</div>
                                </button>
                            </div>
                        </div>

                        {/* Annual Income */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Annual Gross Income
                            </label>
                            <Input
                                type="number"
                                value={income}
                                onChange={(e) => setIncome(Number(e.target.value))}
                            />
                        </div>

                        {/* Deductions (Only for Old Regime) */}
                        {regime === 'old' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        80C Deductions (Max ₹1.5L)
                                    </label>
                                    <Input
                                        type="number"
                                        value={deductions80C}
                                        onChange={(e) => setDeductions80C(Math.min(150000, Number(e.target.value)))}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        EPF, PPF, LIC, ELSS, Home Loan Principal
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        HRA Exemption
                                    </label>
                                    <Input
                                        type="number"
                                        value={hra}
                                        onChange={(e) => setHra(Number(e.target.value))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Home Loan Interest (Max ₹2L)
                                    </label>
                                    <Input
                                        type="number"
                                        value={homeLoanInterest}
                                        onChange={(e) => setHomeLoanInterest(Math.min(200000, Number(e.target.value)))}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {/* Tax Payable Card */}
                    <motion.div
                        key={taxData.totalTax}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="glass p-8 rounded-2xl border-2 border-white/50 text-center"
                    >
                        <p className="text-sm text-gray-600 mb-2">Total Tax Payable</p>
                        <motion.h2
                            className="text-5xl font-bold bg-gradient-to-r from-lavender-600 to-coral-600 bg-clip-text text-transparent mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {formatCurrency(taxData.totalTax)}
                        </motion.h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Gross Income</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(taxData.grossIncome)}
                                </p>
                            </div>
                            <div className="p-4 bg-mint-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Take Home</p>
                                <p className="text-lg font-bold text-mint-600">
                                    {formatCurrency(taxData.takeHome)}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tax Breakdown */}
                    <div className="glass p-6 rounded-2xl border-2 border-white/50">
                        <h3 className="font-bold text-gray-900 mb-4">Tax Breakdown</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Gross Income</span>
                                <span className="font-semibold text-gray-900">
                                    {formatCurrency(taxData.grossIncome)}
                                </span>
                            </div>
                            {taxData.totalDeductions > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Deductions</span>
                                    <span className="font-semibold text-mint-600">
                                        - {formatCurrency(taxData.totalDeductions)}
                                    </span>
                                </div>
                            )}
                            <div className="h-px bg-gray-200" />
                            <div className="flex justify-between">
                                <span className="text-gray-600">Taxable Income</span>
                                <span className="font-semibold text-gray-900">
                                    {formatCurrency(taxData.taxableIncome)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax Before Rebate</span>
                                <span className="font-semibold text-gray-900">
                                    {formatCurrency(taxData.taxBeforeRebate)}
                                </span>
                            </div>
                            {taxData.rebate > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Rebate u/s 87A</span>
                                    <span className="font-semibold text-mint-600">
                                        - {formatCurrency(taxData.rebate)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Health & Edu Cess (4%)</span>
                                <span className="font-semibold text-gray-900">
                                    {formatCurrency(taxData.cess)}
                                </span>
                            </div>
                            <div className="h-px bg-gray-200" />
                            <div className="flex justify-between text-base">
                                <span className="font-semibold text-gray-900">Total Tax</span>
                                <span className="font-bold text-lavender-600">
                                    {formatCurrency(taxData.totalTax)}
                                </span>
                            </div>
                            <div className="flex justify-between text-base pt-3 border-t-2 border-gray-200">
                                <span className="font-bold text-gray-900">Take Home Salary</span>
                                <span className="font-bold text-mint-600">
                                    {formatCurrency(taxData.takeHome)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tax Slabs Info */}
                    <div className="glass p-6 rounded-2xl border-2 border-skyBlue-200 bg-skyBlue-50">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-skyBlue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-skyBlue-900">
                                <p className="font-semibold mb-2">
                                    {regime === 'new' ? 'New Regime' : 'Old Regime'} Tax Slabs:
                                </p>
                                {regime === 'new' ? (
                                    <ul className="space-y-1 text-xs">
                                        <li>• Up to ₹4L: Nil</li>
                                        <li>• ₹4L - ₹8L: 5%</li>
                                        <li>• ₹8L - ₹12L: 10%</li>
                                        <li>• ₹12L - ₹16L: 15%</li>
                                        <li>• Above ₹16L: 20%</li>
                                    </ul>
                                ) : (
                                    <ul className="space-y-1 text-xs">
                                        <li>• Up to ₹2.5L: Nil</li>
                                        <li>• ₹2.5L - ₹5L: 5%</li>
                                        <li>• ₹5L - ₹10L: 20%</li>
                                        <li>• Above ₹10L: 30%</li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
