'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, PiggyBank, TrendingUp, Shield, Home, GraduationCap, Building, Heart } from 'lucide-react';

interface AddInvestmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (investment: { category: string; amount: number; name: string }) => void;
}

const categories = [
    { id: 'ppf', label: 'PPF', icon: PiggyBank, color: 'from-emerald-500 to-green-600' },
    { id: 'elss', label: 'ELSS', icon: TrendingUp, color: 'from-blue-500 to-cyan-600' },
    { id: 'insurance', label: 'Life Insurance', icon: Shield, color: 'from-purple-500 to-pink-600' },
    { id: 'homeloan', label: 'Home Loan', icon: Home, color: 'from-orange-500 to-red-600' },
    { id: 'tuition', label: 'Tuition Fees', icon: GraduationCap, color: 'from-indigo-500 to-purple-600' },
    { id: 'nps', label: 'NPS', icon: Building, color: 'from-teal-500 to-cyan-600' },
    { id: 'health', label: 'Health Insurance', icon: Heart, color: 'from-pink-500 to-rose-600' },
];

export function AddInvestmentModal({ isOpen, onClose, onAdd }: AddInvestmentModalProps) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setError('');

        if (!selectedCategory) {
            setError('Please select a category');
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        const investmentName = name || categories.find(c => c.id === selectedCategory)?.label || 'Investment';

        onAdd({
            category: selectedCategory,
            amount: parseFloat(amount),
            name: investmentName
        });

        // Reset form
        setSelectedCategory('');
        setAmount('');
        setName('');
        onClose();
    };

    const handleClose = () => {
        setSelectedCategory('');
        setAmount('');
        setName('');
        setError('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="relative p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-t-3xl">
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>

                            <div className="text-center text-white pt-2">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="w-14 h-14 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center"
                                >
                                    <Plus className="w-7 h-7" />
                                </motion.div>
                                <h2 className="text-xl font-bold mb-1">Add Investment</h2>
                                <p className="text-white/80 text-sm">Track your tax-saving investments</p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-5">
                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Select Category
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {categories.map((cat) => (
                                        <motion.button
                                            key={cat.id}
                                            type="button"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`p-3 rounded-xl border-2 transition-all ${selectedCategory === cat.id
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2`}>
                                                <cat.icon className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-xs font-medium text-gray-700">{cat.label}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Investment Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Investment Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., SBI PPF Account"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 outline-none transition-colors"
                                />
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Amount (₹)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="50,000"
                                        className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 outline-none transition-colors"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Max 80C limit: ₹1,50,000</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={handleClose}
                                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-shadow"
                            >
                                Add Investment
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
