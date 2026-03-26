"use client";

import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
    return (
        <div className="flex gap-3 mb-6">
            {/* Avatar */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-lavender-500 to-skyBlue-500">
                <Bot className="w-5 h-5 text-white" />
            </div>

            {/* Typing Bubble */}
            <div className="glass border-2 border-white/50 px-5 py-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{
                                y: [0, -8, 0],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
