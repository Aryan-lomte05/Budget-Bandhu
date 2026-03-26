'use client';

import { motion } from 'framer-motion';
import {
    TrendingUp,
    Target,
    Award,
    Calendar,
    DollarSign,
    Zap,
    Trophy,
    Star,
    Edit,
    Share2,
    Settings,
    ChevronRight,
} from 'lucide-react';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import Link from 'next/link';

export default function ProfilePage() {
    const { profile } = useSettingsStore();

    const stats = [
        { label: 'Total Savings', value: '₹2,45,680', change: '+12.5%', icon: DollarSign, color: 'from-emerald-500 to-green-600' },
        { label: 'Goals Achieved', value: '8/12', change: '67%', icon: Target, color: 'from-blue-500 to-cyan-600' },
        { label: 'XP Points', value: '4,250', change: 'Level 12', icon: Zap, color: 'from-purple-500 to-pink-600' },
        { label: 'Streak Days', value: '45', change: 'Record!', icon: Trophy, color: 'from-orange-500 to-red-600' },
    ];

    const achievements = [
        { id: 1, name: 'Early Bird', description: 'Saved for 30 days straight', icon: '🌅', unlocked: true },
        { id: 2, name: 'Budget Master', description: 'Stayed under budget 3 months', icon: '💰', unlocked: true },
        { id: 3, name: 'Goal Crusher', description: 'Achieved 5 financial goals', icon: '🎯', unlocked: true },
        { id: 4, name: 'Investor Pro', description: 'Made first SIP investment', icon: '📈', unlocked: true },
        { id: 5, name: 'Savings King', description: 'Save ₹1,00,000 in one month', icon: '👑', unlocked: false },
        { id: 6, name: 'Debt Free', description: 'Pay off all debts', icon: '🎉', unlocked: false },
    ];

    const recentActivity = [
        { id: 1, action: 'Completed goal', description: 'Emergency Fund', time: '2 hours ago', icon: Target, color: 'text-emerald-600' },
        { id: 2, action: 'Earned badge', description: 'Budget Master', time: '1 day ago', icon: Award, color: 'text-purple-600' },
        { id: 3, action: 'Level up!', description: 'Reached Level 12', time: '3 days ago', icon: Zap, color: 'text-orange-600' },
        { id: 4, action: 'Added transaction', description: 'Groceries - ₹2,500', time: '5 days ago', icon: DollarSign, color: 'text-blue-600' },
    ];

    const financialGoals = [
        { name: 'Emergency Fund', current: 45000, target: 50000, progress: 90 },
        { name: 'New Laptop', current: 35000, target: 80000, progress: 44 },
        { name: 'Vacation', current: 15000, target: 40000, progress: 38 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/50 p-8"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        {/* Profile Info */}
                        <div className="flex items-center gap-6">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative"
                            >
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                                    {profile.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg border-4 border-white">
                                    12
                                </div>
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
                                <p className="text-gray-600">{profile.email}</p>
                                <p className="text-sm text-gray-500 mt-1">{profile.bio}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">
                                        Joined {new Date(profile.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Link href="/settings">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 rounded-xl bg-white/50 border border-gray-200 hover:bg-white hover:shadow-md transition-all"
                                >
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-3 rounded-xl bg-white/50 border border-gray-200 hover:bg-white hover:shadow-md transition-all"
                            >
                                <Share2 className="w-5 h-5 text-gray-600" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/50 p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-semibold text-emerald-600">{stat.change}</span>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Achievements */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/50 p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Achievements</h2>
                            <Link href="/gamification" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {achievements.map((achievement) => (
                                <motion.div
                                    key={achievement.id}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className={`relative p-4 rounded-xl border-2 transition-all ${achievement.unlocked
                                            ? 'bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200'
                                            : 'bg-gray-50 border-gray-200 opacity-50'
                                        }`}
                                >
                                    <div className="text-4xl mb-2 text-center">{achievement.icon}</div>
                                    <h4 className="text-xs font-semibold text-gray-800 text-center">{achievement.name}</h4>
                                    {achievement.unlocked && (
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                            <Star className="w-3 h-3 text-white fill-white" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/50 p-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
                        <div className="space-y-4">
                            {recentActivity.map((activity) => {
                                const Icon = activity.icon;
                                return (
                                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/50 hover:bg-white transition-all">
                                        <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${activity.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">{activity.action}</h4>
                                            <p className="text-sm text-gray-600">{activity.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-400">{activity.time}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                {/* Financial Goals Progress */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/50 p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Active Goals</h2>
                        <Link href="/goals" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                            Manage Goals
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {financialGoals.map((goal, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-white/50">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                                    <span className="text-sm text-gray-600">
                                        ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                                    </span>
                                </div>
                                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${goal.progress}%` }}
                                        transition={{ duration: 1, delay: idx * 0.2 }}
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">{goal.progress}% complete</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
