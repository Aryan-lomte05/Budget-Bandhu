"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Goal } from '@/app/goals/page';

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddGoal: (goal: Omit<Goal, 'id' | 'current' | 'milestones'>) => void;
}

const ICONS = ["🛡️", "✈️", "💻", "🏠", "🚗", "🎓", "💍", "👶", "🏥", "🏖️"];
const COLORS = [
    "from-purple-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-blue-500 to-cyan-500",
    "from-rose-500 to-pink-600",
    "from-amber-400 to-orange-500"
];

export function AddGoalModal({ isOpen, onClose, onAddGoal }: AddGoalModalProps) {
    const [name, setName] = useState("");
    const [target, setTarget] = useState("");
    const [deadline, setDeadline] = useState("");
    const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddGoal({
            name,
            target: Number(target),
            icon: selectedIcon,
            deadline,
            color: selectedColor,
            priority: "High", // Default
        });
        // Reset and close
        setName("");
        setTarget("");
        setDeadline("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Decorative Gradient Blob */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black text-gray-900 leading-none">
                                    New Goal
                                    <span className="block text-lg font-medium text-gray-400 mt-1">What are you dreaming of?</span>
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Theme Icon Picker */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider">Choose Icon</label>
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {ICONS.map((icon) => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setSelectedIcon(icon)}
                                                className={`flex-shrink-0 w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${selectedIcon === icon
                                                    ? 'bg-gray-900 shadow-lg scale-110'
                                                    : 'bg-gray-50 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Inputs */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Goal Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Tesla Model 3"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-lg placeholder:text-gray-300 outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Target Amount</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                                <input
                                                    type="number"
                                                    value={target}
                                                    onChange={(e) => setTarget(e.target.value)}
                                                    placeholder="5,00,000"
                                                    required
                                                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-lg placeholder:text-gray-300 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Target Date</label>
                                            <input
                                                type="date"
                                                value={deadline}
                                                onChange={(e) => setDeadline(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm text-gray-600 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Color Theme */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider">Color Theme</label>
                                    <div className="flex gap-3">
                                        {COLORS.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} transition-transform ${selectedColor === color ? 'ring-4 ring-gray-200 scale-110' : 'hover:scale-110'
                                                    }`}
                                            >
                                                {selectedColor === color && <Check className="w-5 h-5 text-white mx-auto" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-8"
                                >
                                    Create Goal
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
