"use client";

import { motion } from 'framer-motion';
import { Calculator } from '@/lib/constants/calculators';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CalculatorCardProps {
    calculator: Calculator;
    index: number;
}

export function CalculatorCard({ calculator, index }: CalculatorCardProps) {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="glass p-5 rounded-xl border-2 border-white/50 hover:border-mint-500/50 transition-all cursor-pointer group"
            onClick={() => router.push(`/literacy/calculators/${calculator.id}`)}
        >
            <div className="flex items-start gap-4">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: `${calculator.color}20` }}
                >
                    {calculator.icon}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-mint-600 transition-colors">
                        {calculator.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {calculator.description}
                    </p>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-mint-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
        </motion.div>
    );
}
