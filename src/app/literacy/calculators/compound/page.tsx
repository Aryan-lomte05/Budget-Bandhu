"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default function CompoundCalculator() {
    const router = useRouter();
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(8);
    const [time, setTime] = useState(10);
    const [frequency, setFrequency] = useState(12); // monthly

    const calculateCompound = () => {
        const amount = principal * Math.pow(1 + rate / (frequency * 100), frequency * time);
        const interest = amount - principal;
        return { amount, interest };
    };

    const { amount, interest } = calculateCompound();

    return (
        <div className="max-w-5xl mx-auto">
            <Button onClick={() => router.back()} variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="glass p-8 rounded-2xl border-2 border-white/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-skyBlue-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-skyBlue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Compound Interest</h1>
                            <p className="text-sm text-gray-600">See how your money grows</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Principal Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Principal Amount
                            </label>
                            <Input
                                type="number"
                                value={principal}
                                onChange={(e) => setPrincipal(Number(e.target.value))}
                                className="mb-3"
                            />
                            <Slider
                                value={principal}
                                onChange={setPrincipal}
                                min={10000}
                                max={10000000}
                                step={10000}
                            />
                        </div>

                        {/* Interest Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Annual Interest Rate (%)
                            </label>
                            <Input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                                className="mb-3"
                            />
                            <Slider value={rate} onChange={setRate} min={1} max={20} step={0.1} />
                        </div>

                        {/* Time Period */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Time Period (Years)
                            </label>
                            <Input
                                type="number"
                                value={time}
                                onChange={(e) => setTime(Number(e.target.value))}
                                className="mb-3"
                            />
                            <Slider value={time} onChange={setTime} min={1} max={50} step={1} />
                        </div>

                        {/* Compounding Frequency */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Compounding Frequency
                            </label>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-transparent"
                            >
                                <option value={1}>Annually</option>
                                <option value={2}>Semi-Annually</option>
                                <option value={4}>Quarterly</option>
                                <option value={12}>Monthly</option>
                                <option value={365}>Daily</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    <motion.div
                        key={amount}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="glass p-8 rounded-2xl border-2 border-white/50 text-center"
                    >
                        <p className="text-sm text-gray-600 mb-2">Maturity Amount</p>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-skyBlue-600 to-lavender-600 bg-clip-text text-transparent mb-6">
                            {formatCurrency(amount)}
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Principal</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {formatCurrency(principal)}
                                </p>
                            </div>
                            <div className="p-4 bg-skyBlue-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Interest Earned</p>
                                <p className="text-xl font-bold text-skyBlue-600">
                                    {formatCurrency(interest)}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="glass p-6 rounded-2xl border-2 border-white/50">
                        <h3 className="font-bold text-gray-900 mb-4">Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Initial Investment</span>
                                <span className="font-semibold">{formatCurrency(principal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Interest Rate</span>
                                <span className="font-semibold">{rate}% p.a.</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Time Period</span>
                                <span className="font-semibold">{time} years</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Growth Factor</span>
                                <span className="font-semibold">{(amount / principal).toFixed(2)}x</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
