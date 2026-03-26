"use client";

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target, AlertCircle, Calculator, Calendar } from 'lucide-react';

const queries = [
    { text: "What's my food budget?", icon: Target, color: 'mint-500' },
    { text: "Can I afford ₹15K laptop?", icon: Calculator, color: 'skyBlue-500' },
    { text: "Show savings forecast", icon: TrendingUp, color: 'lavender-500' },
    { text: "Analyze my spending", icon: Sparkles, color: 'coral-500' },
    { text: "Budget alert status", icon: AlertCircle, color: 'coral-600' },
    { text: "Upcoming bills", icon: Calendar, color: 'skyBlue-600' },
];

interface SuggestedQueriesProps {
    onSelect: (query: string) => void;
    disabled?: boolean;
}

export function SuggestedQueries({ onSelect, disabled }: SuggestedQueriesProps) {
    const getColorClasses = (color: string) => {
        const baseColor = color.split('-')[0];
        return {
            icon: `text-${color}`,
            hover: `hover:border-${baseColor}-300 hover:bg-${baseColor}-50`,
        };
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Sparkles className="w-4 h-4 text-mint-500" />
                <span>Try asking...</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {queries.map((query, index) => {
                    const colors = getColorClasses(query.color);
                    return (
                        <motion.button
                            key={query.text}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => !disabled && onSelect(query.text)}
                            disabled={disabled}
                            className={`flex items-center gap-2 px-4 py-2.5 glass border-2 border-gray-200 rounded-full text-sm font-medium text-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${colors.hover}`}
                        >
                            <query.icon className={`w-4 h-4 ${colors.icon}`} />
                            {query.text}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
