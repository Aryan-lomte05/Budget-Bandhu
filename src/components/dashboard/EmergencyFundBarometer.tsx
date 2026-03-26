'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Calendar } from 'lucide-react';
import { mockData } from '@/lib/api/mock-data';

interface EmergencyFundBarometerProps {
    goal?: any;
}

export const EmergencyFundBarometer = memo(function EmergencyFundBarometer({ goal }: EmergencyFundBarometerProps) {
    const emergencyGoal = goal || mockData.goals.find(g => g.name === 'Emergency Fund') || mockData.goals[0];
    const currentAmount = emergencyGoal.current;
    const targetAmount = emergencyGoal.target;
    const monthlyExpenses = mockData.dashboardSummary.monthSpent; // Ideally pass this too, but mock is fine for now
    const monthsCovered = currentAmount / monthlyExpenses;
    const percentage = (currentAmount / targetAmount) * 100;
    const recommendedMonths = 6;

    const getStatus = () => {
        if (monthsCovered >= 6) {
            return { level: 'Excellent', color: 'text-emerald-600', bgColor: 'bg-emerald-500', thermometerColor: '#10B981', icon: CheckCircle, message: 'Your emergency fund is well-established! 🎉' };
        } else if (monthsCovered >= 4) {
            return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-500', thermometerColor: '#3B82F6', icon: TrendingUp, message: 'Good progress! Keep building your fund. 👍' };
        } else if (monthsCovered >= 2) {
            return { level: 'Fair', color: 'text-orange-600', bgColor: 'bg-orange-500', thermometerColor: '#F59E0B', icon: AlertTriangle, message: 'Getting there! Aim for at least 6 months. ⚠️' };
        } else {
            return { level: 'Critical', color: 'text-red-600', bgColor: 'bg-red-500', thermometerColor: '#EF4444', icon: AlertTriangle, message: 'Priority! Build your emergency fund now. 🚨' };
        }
    };

    const status = getStatus();
    const StatusIcon = status.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
            whileHover={{ scale: 1.01 }}
            className="relative rounded-3xl overflow-hidden p-6"
            style={{
                background: 'linear-gradient(145deg, #1E1B4B 0%, #312E81 50%, #3730A3 100%)',
                boxShadow: '0 20px 40px rgba(30, 27, 75, 0.4), 0 0 0 1px rgba(255,255,255,0.05)'
            }}
        >
            {/* Floating elements */}
            <motion.div
                className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
                className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2] }}
                transition={{ duration: 8, repeat: Infinity }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4, type: 'spring' }}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg"
                    >
                        <Shield className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Emergency Fund</h3>
                        <p className="text-sm text-indigo-300">Your financial safety net</p>
                    </div>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bgColor} text-white shadow-lg`}
                >
                    <StatusIcon className="w-4 h-4" />
                    <span className="font-bold text-sm">{status.level}</span>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thermometer */}
                <div className="flex items-center justify-center">
                    <div className="relative">
                        <div className="relative w-20 h-60 bg-white/10 rounded-full overflow-hidden shadow-inner backdrop-blur-sm">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.min(percentage, 100)}%` }}
                                transition={{ duration: 2, delay: 0.8 }}
                                className="absolute bottom-0 left-0 right-0 rounded-full overflow-hidden"
                                style={{ backgroundColor: status.thermometerColor }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
                                    animate={{ y: [0, -100, 0] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                />
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-2 h-2 bg-white/40 rounded-full"
                                        style={{ left: `${30 + i * 20}%`, bottom: `${i * 30}%` }}
                                        animate={{ y: [0, -200], opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 3 + i, delay: i * 0.5 }}
                                    />
                                ))}
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1, type: 'spring' }}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
                            style={{ backgroundColor: status.thermometerColor }}
                        >
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                <DollarSign className="w-6 h-6 text-white" />
                            </motion.div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.5 }}
                            className="absolute left-full ml-4 top-1/2 -translate-y-1/2 text-center"
                        >
                            <div className="text-4xl font-black text-white">{percentage.toFixed(0)}%</div>
                            <p className="text-xs text-indigo-300">of target</p>
                        </motion.div>
                    </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ delay: 0.6 }}
                        className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10"
                    >
                        <p className="text-xs text-indigo-300 mb-1">Current Balance</p>
                        <p className="text-2xl font-black text-white">₹{currentAmount.toLocaleString('en-IN')}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ delay: 0.7 }}
                        className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10"
                    >
                        <p className="text-xs text-indigo-300 mb-1">Target Amount</p>
                        <p className="text-xl font-bold text-white">₹{targetAmount.toLocaleString('en-IN')}</p>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 2, delay: 0.9 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: status.thermometerColor }}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ delay: 0.8 }}
                        className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-indigo-300" />
                            <p className="text-xs text-indigo-300">Coverage Period</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-white">{monthsCovered.toFixed(1)}</span>
                            <span className="text-sm text-indigo-300">months</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                    >
                        <div className="flex items-start gap-3">
                            <StatusIcon className="w-5 h-5 text-white flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-white mb-1">Status</h4>
                                <p className="text-sm text-indigo-200">{status.message}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
});
