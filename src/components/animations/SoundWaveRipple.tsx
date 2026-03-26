"use client";

import { motion } from "framer-motion";

interface SoundWaveRippleProps {
    color?: string;
    maxRadius?: number;
    speed?: number;
}

export function SoundWaveRipple({
    color = "#A78BFA",
    maxRadius = 80,
    speed = 2
}: SoundWaveRippleProps) {
    const ripples = [0, 1, 2];

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {ripples.map((index) => (
                <motion.div
                    key={index}
                    className="absolute rounded-full border-2"
                    style={{
                        borderColor: color,
                    }}
                    initial={{
                        width: 0,
                        height: 0,
                        opacity: 0.8,
                    }}
                    animate={{
                        width: maxRadius * 2,
                        height: maxRadius * 2,
                        opacity: 0,
                    }}
                    transition={{
                        duration: speed,
                        delay: index * 0.4,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />
            ))}

            {/* Center pulse */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    background: `radial-gradient(circle, ${color}80 0%, transparent 70%)`,
                }}
                initial={{
                    width: 40,
                    height: 40,
                    opacity: 0.6,
                }}
                animate={{
                    width: [40, 50, 40],
                    height: [40, 50, 40],
                    opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}
