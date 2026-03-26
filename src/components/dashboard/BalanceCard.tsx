'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, TrendingUp, ArrowUpRight, Send, Plus, } from 'lucide-react';
import { NumericFormat } from 'react-number-format';

interface BalanceCardProps {
    balance: number;
    trend: 'up' | 'down';
    trendPercentage: number;
}

export function BalanceCard({ balance, trend, trendPercentage }: BalanceCardProps) {
    const [showBalance, setShowBalance] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mm-card"
        >
            <div className="space-y-6">
                {/* Header with Wallet Icon and Title */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-mm-purple rounded-xl flex items-center justify-center">
                            <span className="text-2xl">💼</span>
                        </div>
                        <div>
                            <h3 className="mm-heading-md text-lg">My Wallet</h3>
                            <p className="text-sm text-gray-500">Total Balance</p>
                        </div>
                    </div>

                    {/* Show/Hide Toggle */}
                    <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        {showBalance ? (
                            <Eye className="w-5 h-5 text-gray-600" />
                        ) : (
                            <EyeOff className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* Balance Display */}
                <div className="py-4">
                    <AnimatePresence mode="wait">
                        {showBalance ? (
                            <motion.div
                                key="visible"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-5xl font-bold text-mm-purple mb-2">
                                    <NumericFormat
                                        value={balance}
                                        displayType="text"
                                        thousandSeparator=","
                                        prefix="₹"
                                        renderText={(value) => <span>{value}</span>}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${trend === 'up'
                                            ? 'bg-mm-green/20 text-mm-green'
                                            : 'bg-red-100 text-red-600'
                                        }`}>
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm font-bold">
                                            +{trendPercentage}% this month
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="hidden"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-5xl font-bold text-mm-purple"
                            >
                                ₹••••••
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Quick Actions */}
                <div className="pt-6 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span>⚡</span> Quick Actions
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-mm-purple hover:bg-mm-purple/5 transition-all">
                            <Plus className="w-5 h-5 text-mm-purple" />
                            <span className="text-xs font-medium text-gray-700">Add Money</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-mm-purple hover:bg-mm-purple/5 transition-all">
                            <Send className="w-5 h-5 text-mm-purple" />
                            <span className="text-xs font-medium text-gray-700">Transfer</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-mm-purple hover:bg-mm-purple/5 transition-all">
                            <ArrowUpRight className="w-5 h-5 text-mm-purple" />
                            <span className="text-xs font-medium text-gray-700">Pay Bills</span>
                        </button>
                    </div>
                </div>

                {/* View Details Link */}
                <button className="w-full py-3 text-mm-purple font-semibold hover:bg-mm-purple/5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    View Details
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}
