'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Lightbulb, Star, Sparkles } from 'lucide-react';
import { mockData } from '@/lib/api/mock-data';

interface Insight {
    id: string;
    type: 'warning' | 'tip' | 'achievement' | 'trend';
    title: string;
    message: string;
    icon: any;
    iconBg: string;
}

interface SpendingInsightsProps {
    insights?: any[];
}

export const SpendingInsights = memo(function SpendingInsights({ insights: apiInsights }: SpendingInsightsProps) {
    const getInsightStyles = (type: string) => {
        switch (type) {
            case 'spending_spike':
            case 'warning':
                return { type: 'warning', icon: AlertCircle, iconBg: 'bg-orange-500' };
            case 'achievement':
                return { type: 'achievement', icon: Star, iconBg: 'bg-amber-500' };
            case 'forecast':
            case 'trend':
                return { type: 'trend', icon: TrendingUp, iconBg: 'bg-cyan-500' };
            default:
                return { type: 'tip', icon: Lightbulb, iconBg: 'bg-violet-500' };
        }
    };

    // Map API insights to UI format or use mock if empty
    const displayInsights: Insight[] = (apiInsights && apiInsights.length > 0) ? apiInsights.map((i: any, index: number) => {
        let type = 'tip';
        let icon = Lightbulb;
        let iconBg = 'bg-violet-500';

        if (i.type === 'warning' || i.type === 'budget_alert' || i.type === 'anomaly') {
            type = 'warning';
            icon = AlertCircle;
            iconBg = 'bg-orange-500';
        } else if (i.type === 'achievement') {
            type = 'achievement';
            icon = Star;
            iconBg = 'bg-amber-500';
        } else if (i.type === 'top_spending') {
            type = 'trend';
            icon = TrendingUp;
            iconBg = 'bg-cyan-500';
        }

        return {
            id: `insight-${index}`,
            type: type as any,
            title: i.title,
            message: i.description,
            icon: icon,
            iconBg: iconBg
        };
    }) : mockData.insights.map(i => {
        const styles = getInsightStyles(i.type);
        return {
            id: i.id,
            type: styles.type as any,
            title: i.title,
            message: i.description,
            icon: styles.icon,
            iconBg: styles.iconBg,
        };
    });

    const insights = displayInsights;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative rounded-3xl overflow-hidden p-6 h-full bg-white"
            style={{
                boxShadow: '0 20px 50px rgba(139, 92, 246, 0.15)'
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"
                    >
                        <Sparkles className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900">Smart Insights</h3>
                        <p className="text-sm text-gray-500">AI-powered analysis</p>
                    </div>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full"
                >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-emerald-700">{insights.length} Active</span>
                </motion.div>
            </div>

            {/* Insights Cards */}
            <div className="space-y-3">
                {insights.slice(0, 3).map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ x: 5, scale: 1.02 }}
                            className="p-4 rounded-2xl bg-gray-50 hover:bg-violet-50 transition-all cursor-pointer border border-gray-100"
                        >
                            <div className="flex items-start gap-4">
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className={`w-10 h-10 rounded-xl ${insight.iconBg} flex items-center justify-center shadow-lg flex-shrink-0`}
                                >
                                    <Icon className="w-5 h-5 text-white" />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">{insight.title}</h4>
                                    <p className="text-xs text-gray-600 line-clamp-2">{insight.message}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-white font-semibold">Weekly Summary</p>
                        <p className="text-xs text-white/80">
                            Save up to <span className="font-bold text-white">₹5,300/month</span>! 💰
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
});
