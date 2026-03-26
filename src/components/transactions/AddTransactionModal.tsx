'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, Calendar, IndianRupee, Tag, FileText, AlertTriangle } from 'lucide-react';
import { useUserStore } from '@/lib/store/useUserStore';
import { useTransactions } from '@/lib/hooks/useMLApi';
import toast from 'react-hot-toast';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        amount?: number;
        description?: string;
        date?: string;
        category?: string;
    } | null;
}

export function AddTransactionModal({ isOpen, onClose, initialData }: AddTransactionModalProps) {
    const { userId } = useUserStore();
    const { addTransaction } = useTransactions(userId);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        type: 'debit' as 'debit' | 'credit',
        notes: ''
    });

    // Update form when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                amount: initialData.amount ? initialData.amount.toString() : prev.amount,
                description: initialData.description || prev.description,
                date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : prev.date,
                category: initialData.category || prev.category
            }));
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.amount || !formData.description) {
            toast.error('Please fill in required fields');
            return;
        }

        setIsLoading(true);
        try {
            await addTransaction({
                amount: parseFloat(formData.amount),
                description: formData.description,
                category: formData.category,
                date: formData.date,
                type: formData.type,
                notes: formData.notes
            });

            toast.success('Transaction added successfully! 🎉');
            resetForm();
            onClose();
        } catch (error) {
            console.error('Failed to add transaction:', error);
            toast.error('Failed to save transaction');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            amount: '',
            description: '',
            category: 'Other',
            date: new Date().toISOString().split('T')[0],
            type: 'debit',
            notes: ''
        });
    };

    const categories = [
        "Food & Drink", "Transportation", "Shopping", "Housing",
        "Utilities", "Healthcare", "Entertainment", "Personal Care",
        "Education", "Investments", "Income", "Other"
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {initialData ? 'Scanned Transaction' : 'New Transaction'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Amount & Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Type</label>
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'debit' })}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${formData.type === 'debit'
                                        ? 'bg-white text-red-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'credit' })}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${formData.type === 'credit'
                                        ? 'bg-white text-emerald-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Income
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Amount</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    placeholder="0.00"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                placeholder="Store name or item..."
                                required
                            />
                        </div>
                    </div>

                    {/* Category & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all appearance-none bg-white"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* ML Nudge */}
                    {initialData?.category && (
                        <div className="flex items-center gap-2 p-3 bg-indigo-50 text-indigo-700 rounded-xl text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Category auto-detected by AI</span>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="w-5 h-5" />
                                Save Transaction
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
