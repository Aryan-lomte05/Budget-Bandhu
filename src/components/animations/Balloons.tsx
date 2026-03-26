'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BalloonsProps {
    isActive: boolean;
    duration?: number;
    count?: number;
    onComplete?: () => void;
}

interface Balloon {
    id: number;
    color: string;
    left: number;
    delay: number;
    size: number;
    swayAmount: number;
    riseSpeed: number;
}

export function Balloons({ isActive, duration = 6000, count = 15, onComplete }: BalloonsProps) {
    const [balloons, setBalloons] = useState<Balloon[]>([]);

    useEffect(() => {
        if (!isActive) {
            setBalloons([]);
            return;
        }

        // Generate random balloons
        const colors = [
            '#EF4444', // red
            '#F59E0B', // orange
            '#10B981', // green
            '#3B82F6', // blue
            '#8B5CF6', // purple
            '#EC4899', // pink
            '#F97316', // orange-500
            '#14B8A6', // teal
        ];

        const newBalloons: Balloon[] = Array.from({ length: count }, (_, i) => ({
            id: i,
            color: colors[Math.floor(Math.random() * colors.length)],
            left: Math.random() * 90 + 5, // 5% to 95%
            delay: Math.random() * 2,
            size: Math.random() * 40 + 60, // 60-100px
            swayAmount: Math.random() * 60 - 30, // -30 to 30px
            riseSpeed: Math.random() * 2 + 4, // 4-6 seconds
        }));

        setBalloons(newBalloons);

        // Auto-complete
        const timer = setTimeout(() => {
            setBalloons([]);
            if (onComplete) onComplete();
        }, duration);

        return () => clearTimeout(timer);
    }, [isActive, duration, count, onComplete]);

    return (
        <AnimatePresence>
            {isActive && (
                <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
                    {balloons.map((balloon) => (
                        <motion.div
                            key={balloon.id}
                            initial={{
                                y: '110vh',
                                x: `${balloon.left}vw`,
                                opacity: 0,
                                scale: 0,
                            }}
                            animate={{
                                y: '-20vh',
                                x: [`${balloon.left}vw`, `${balloon.left + balloon.swayAmount}vw`, `${balloon.left}vw`],
                                opacity: [0, 1, 1, 0],
                                scale: [0, 1, 1, 0.8],
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                                duration: balloon.riseSpeed,
                                delay: balloon.delay,
                                ease: 'easeOut',
                                x: {
                                    duration: balloon.riseSpeed * 0.8,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    ease: 'easeInOut',
                                },
                                rotate: {
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    ease: 'easeInOut',
                                },
                            }}
                            className="absolute"
                            style={{
                                width: balloon.size,
                                height: balloon.size * 1.2,
                            }}
                        >
                            {/* Balloon */}
                            <div className="relative w-full h-full">
                                {/* Main balloon body */}
                                <motion.div
                                    animate={{
                                        scaleY: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatType: 'reverse',
                                        ease: 'easeInOut',
                                    }}
                                    className="absolute inset-0 rounded-full shadow-xl"
                                    style={{
                                        background: `radial-gradient(circle at 30% 30%, ${balloon.color}dd, ${balloon.color})`,
                                    }}
                                >
                                    {/* Shine effect */}
                                    <div
                                        className="absolute top-[20%] left-[25%] w-[30%] h-[25%] rounded-full opacity-60"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(255,255,255,0.9), transparent)',
                                        }}
                                    />
                                </motion.div>

                                {/* Balloon knot */}
                                <div
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-3 rounded-b-full"
                                    style={{ backgroundColor: balloon.color }}
                                />

                                {/* String */}
                                <motion.div
                                    animate={{
                                        pathLength: [1, 0.95, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: 'reverse',
                                    }}
                                    className="absolute top-full left-1/2 -translate-x-1/2"
                                    style={{
                                        width: 2,
                                        height: balloon.size * 0.8,
                                        background: `linear-gradient(180deg, ${balloon.color}aa, transparent)`,
                                    }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </AnimatePresence>
    );
}
