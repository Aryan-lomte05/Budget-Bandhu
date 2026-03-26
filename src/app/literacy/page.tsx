'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    TrendingUp,
    PiggyBank,
    Wallet,
    Calculator,
    Trophy,
    Sparkles,
    MessageCircle,
    Brain,
    Zap,
    Target,
    Shield,
    ArrowRight,
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { AILearningModal } from '../../components/literacy/AILearningModal';

interface LearningTopic {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    gradient: string;
    lessons: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedTime: string;
}

export default function LiteracyPage() {
    const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const topics: LearningTopic[] = [
        {
            id: 'budgeting',
            title: 'Smart Budgeting',
            description: 'Learn to create and manage budgets based on YOUR spending patterns',
            icon: Wallet,
            color: 'text-emerald-600',
            gradient: 'from-emerald-500 to-green-600',
            lessons: 8,
            difficulty: 'Beginner',
            estimatedTime: '15 mins',
        },
        {
            id: 'investing',
            title: 'Investment Basics',
            description: 'Understand SIP, mutual funds, and stocks with personalized examples',
            icon: TrendingUp,
            color: 'text-blue-600',
            gradient: 'from-blue-500 to-cyan-600',
            lessons: 12,
            difficulty: 'Intermediate',
            estimatedTime: '25 mins',
        },
        {
            id: 'savings',
            title: 'Savings Strategy',
            description: 'Build emergency funds and savings plans tailored to your income',
            icon: PiggyBank,
            color: 'text-purple-600',
            gradient: 'from-purple-500 to-pink-600',
            lessons: 6,
            difficulty: 'Beginner',
            estimatedTime: '12 mins',
        },
        {
            id: 'taxes',
            title: 'Tax Planning',
            description: 'Maximize deductions and understand tax-saving investments',
            icon: Calculator,
            color: 'text-orange-600',
            gradient: 'from-orange-500 to-red-600',
            lessons: 10,
            difficulty: 'Advanced',
            estimatedTime: '30 mins',
        },
        {
            id: 'debt',
            title: 'Debt Management',
            description: 'Learn strategies to manage EMIs and become debt-free',
            icon: Shield,
            color: 'text-red-600',
            gradient: 'from-red-500 to-pink-600',
            lessons: 7,
            difficulty: 'Intermediate',
            estimatedTime: '18 mins',
        },
        {
            id: 'goals',
            title: 'Financial Goals',
            description: 'Set and achieve short-term and long-term financial goals',
            icon: Target,
            color: 'text-indigo-600',
            gradient: 'from-indigo-500 to-purple-600',
            lessons: 9,
            difficulty: 'Beginner',
            estimatedTime: '20 mins',
        },
    ];

    const calculators = [
        { name: 'SIP Calculator', href: '/literacy/calculators/sip', icon: TrendingUp, color: 'from-emerald-500 to-blue-500' },
        { name: 'EMI Calculator', href: '/literacy/calculators/emi', icon: Calculator, color: 'from-blue-500 to-purple-500' },
        { name: 'Tax Calculator', href: '/literacy/calculators/tax', icon: Wallet, color: 'from-purple-500 to-pink-500' },
        { name: 'Compound Interest', href: '/literacy/calculators/compound', icon: Sparkles, color: 'from-orange-500 to-red-500' },
        { name: 'Retirement Planner', href: '/literacy/calculators/retirement', icon: Target, color: 'from-pink-500 to-red-500' },
        { name: 'Lumpsum Calculator', href: '/literacy/calculators/lumpsum', icon: PiggyBank, color: 'from-cyan-500 to-blue-500' },
    ];

    const handleTopicClick = (topic: LearningTopic) => {
        setSelectedTopic(topic);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/50 p-8 overflow-hidden relative"
            >
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden opacity-10">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"
                            style={{
                                width: Math.random() * 100 + 50,
                                height: Math.random() * 100 + 50,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                x: [0, 10, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: Math.random() * 5 + 5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-xl">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                    AI Learning Hub
                                </h1>
                                <p className="text-sm text-gray-600">Powered by Phi3 Model</p>
                            </div>
                        </div>
                        <p className="text-gray-700 text-lg mb-4">
                            Learn financial literacy with personalized lessons generated from YOUR transaction data and spending patterns.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl">
                                <Sparkles className="w-5 h-5 text-emerald-600" />
                                <span className="text-sm font-semibold text-emerald-700">100% Personalized</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                                <Zap className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-semibold text-blue-700">Interactive AI Chat</span>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative"
                    >
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-2xl">
                            <MessageCircle className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-lg">
                            AI
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* How It Works */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/50 p-6"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">How AI Learning Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { step: '1', title: 'Choose Topic', desc: 'Select what you want to learn', icon: BookOpen },
                        { step: '2', title: 'AI Analyzes', desc: 'Phi3 studies your financial data', icon: Brain },
                        { step: '3', title: 'Custom Lesson', desc: 'Get personalized explanations', icon: Sparkles },
                        { step: '4', title: 'Interactive Quiz', desc: 'Test with real scenarios', icon: Trophy },
                    ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className="relative p-4 rounded-xl bg-white/50 border border-gray-200">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg">
                                    {item.step}
                                </div>
                                <Icon className="w-6 h-6 text-gray-600 mb-2" />
                                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                                {idx < 3 && (
                                    <ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Learning Topics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Choose Your Learning Path</h2>
                    <span className="text-sm text-gray-500">{topics.length} topics available</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topics.map((topic, idx) => {
                        const Icon = topic.icon;
                        return (
                            <motion.button
                                key={topic.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleTopicClick(topic)}
                                className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/50 p-6 text-left hover:shadow-2xl transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                        topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {topic.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                                    {topic.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">{topic.description}</p>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" />
                                        {topic.lessons} lessons
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Zap className="w-4 h-4" />
                                        {topic.estimatedTime}
                                    </span>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                                        <Brain className="w-4 h-4" />
                                        AI Powered
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Financial Calculators */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/50 p-6"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Financial Calculators</h2>
                <p className="text-gray-600 mb-6">
                    Plan your investments and understand returns with our interactive calculators
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {calculators.map((calc, idx) => {
                        const Icon = calc.icon;
                        return (
                            <Link key={idx} href={calc.href}>
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-4 rounded-xl bg-white/50 border border-gray-200 hover:bg-white hover:shadow-lg transition-all text-center group"
                                >
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${calc.color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                                        {calc.name}
                                    </h3>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </motion.div>

            {/* AI Learning Modal */}
            <AnimatePresence>
                {isModalOpen && selectedTopic && (
                    <AILearningModal
                        topic={selectedTopic}
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedTopic(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
