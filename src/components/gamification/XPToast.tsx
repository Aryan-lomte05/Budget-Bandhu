'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface XPToastProps {
    xp: number;
    message: string;
}

export function XPToast({ xp, message }: XPToastProps) {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-xl shadow-lg"
        >
            <motion.div
                animate={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 0.5,
                }}
            >
                <Zap className="w-6 h-6 fill-white" />
            </motion.div>
            <div>
                <div className="font-bold text-lg">+{xp} XP</div>
                <div className="text-xs opacity-90">{message}</div>
            </div>
        </motion.div>
    );
}
