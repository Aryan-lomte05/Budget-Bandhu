'use client';

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Zap, Wifi, Phone, Home, CreditCard, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface Bill {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    category: 'electricity' | 'internet' | 'phone' | 'rent' | 'other';
    status: 'upcoming' | 'due-soon' | 'overdue';
    daysUntilDue: number;
}

const mockBills: Bill[] = [
    {
        id: '1',
        name: 'Electricity Bill',
        amount: 2450,
        dueDate: 'Dec 28, 2025',
        category: 'electricity',
        status: 'due-soon',
        daysUntilDue: 4,
    },
    {
        id: '2',
        name: 'Internet - Airtel Fiber',
        amount: 999,
        dueDate: 'Dec 30, 2025',
        category: 'internet',
        status: 'upcoming',
        daysUntilDue: 6,
    },
    {
        id: '3',
        name: 'Mobile Recharge',
        amount: 599,
        dueDate: 'Jan 5, 2026',
        category: 'phone',
        status: 'upcoming',
        daysUntilDue: 12,
    },
    {
        id: '4',
        name: 'House Rent',
        amount: 15000,
        dueDate: 'Jan 1, 2026',
        category: 'rent',
        status: 'upcoming',
        daysUntilDue: 8,
    },
    {
        id: '5',
        name: 'Credit Card Payment',
        amount: 8750,
        dueDate: 'Dec 26, 2025',
        category: 'other',
        status: 'due-soon',
        daysUntilDue: 2,
    },
];

const categoryIcons = {
    electricity: Zap,
    internet: Wifi,
    phone: Phone,
    rent: Home,
    other: CreditCard,
};

export const UpcomingBillsCarousel = memo(function UpcomingBillsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextBill = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % mockBills.length);
    };

    const prevBill = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + mockBills.length) % mockBills.length);
    };

    const currentBill = mockBills[currentIndex];
    const Icon = categoryIcons[currentBill.category];

    const getStatusBadge = (status: Bill['status'], days: number) => {
        if (status === 'overdue') {
            return { text: 'Overdue', bg: 'bg-red-500' };
        } else if (status === 'due-soon') {
            return { text: `${days} days left`, bg: 'bg-amber-500' };
        } else {
            return { text: `${days} days left`, bg: 'bg-emerald-500' };
        }
    };

    const statusBadge = getStatusBadge(currentBill.status, currentBill.daysUntilDue);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 150 : -150,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 150 : -150,
            opacity: 0,
        }),
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative rounded-3xl overflow-hidden h-full min-h-[420px]"
            style={{
                background: 'linear-gradient(145deg, #1E1B4B 0%, #312E81 50%, #3730A3 100%)',
                boxShadow: '0 20px 40px rgba(30, 27, 75, 0.4), 0 0 0 1px rgba(255,255,255,0.05)'
            }}
        >
            <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"
                        >
                            <Calendar className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Upcoming Bills</h3>
                            <p className="text-sm text-indigo-300">{mockBills.length} bills pending</p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, type: 'spring' }}
                        className="text-right"
                    >
                        <p className="text-xs text-indigo-300 uppercase tracking-wider">Total Due</p>
                        <p className="text-xl font-bold text-white">
                            ₹{mockBills.reduce((sum, bill) => sum + bill.amount, 0).toLocaleString('en-IN')}
                        </p>
                    </motion.div>
                </div>

                {/* Bill Card Display - Fixed Height */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="relative flex-1 overflow-hidden mb-4">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: 'spring', stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.15 },
                                }}
                                className="absolute inset-0 flex flex-col justify-center"
                            >
                                {/* Bill Card */}
                                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-indigo-200" />
                                        </div>
                                        <div className={`px-3 py-1 rounded-full ${statusBadge.bg} text-white text-xs font-bold`}>
                                            {statusBadge.text}
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-bold text-white mb-1">
                                        {currentBill.name}
                                    </h4>

                                    <div className="flex items-center gap-2 text-indigo-300 text-sm mb-3">
                                        <Clock className="w-4 h-4" />
                                        Due: {currentBill.dueDate}
                                    </div>

                                    <div className="text-3xl font-black text-white">
                                        ₹{currentBill.amount.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation - Fixed at bottom */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevBill}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </motion.button>

                        <div className="flex items-center gap-2">
                            {mockBills.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setDirection(idx > currentIndex ? 1 : -1);
                                        setCurrentIndex(idx);
                                    }}
                                    className="group"
                                >
                                    <motion.div
                                        className={`h-2 rounded-full transition-all ${idx === currentIndex
                                            ? 'w-6 bg-white'
                                            : 'w-2 bg-white/30 group-hover:bg-white/50'
                                            }`}
                                        whileHover={{ scale: 1.2 }}
                                    />
                                </button>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextBill}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </motion.button>
                    </div>

                    {/* Pay Now Button - Always at bottom */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-xl font-bold text-indigo-900 bg-white shadow-xl"
                    >
                        Pay Now
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
});
