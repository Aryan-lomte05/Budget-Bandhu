"use client";

import { motion } from "framer-motion";

interface SparkleParticlesProps {
    count?: number;
    color?: string;
    spread?: number;
}

export function SparkleParticles({
    count = 8,
    color = "#C084FC",
    spread = 60
}: SparkleParticlesProps) {
    const particles = Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const distance = spread;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return { x, y, delay: i * 0.1 };
    });

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{
                        left: '50%',
                        top: '50%',
                        width: 8,
                        height: 8,
                    }}
                    initial={{
                        x: 0,
                        y: 0,
                        scale: 0,
                        opacity: 0
                    }}
                    animate={{
                        x: particle.x,
                        y: particle.y,
                        scale: [0, 1, 0.8, 0],
                        opacity: [0, 1, 0.8, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        delay: particle.delay,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                        ease: "easeOut"
                    }}
                >
                    <svg width="8" height="8" viewBox="0 0 8 8">
                        <motion.circle
                            cx="4"
                            cy="4"
                            r="3"
                            fill={color}
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.3, delay: particle.delay }}
                        />
                        {/* Star points */}
                        <motion.path
                            d="M 4 0 L 4.5 3.5 L 8 4 L 4.5 4.5 L 4 8 L 3.5 4.5 L 0 4 L 3.5 3.5 Z"
                            fill={color}
                            opacity="0.6"
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{
                                scale: [0, 1, 0],
                                rotate: [0, 180, 360]
                            }}
                            transition={{
                                duration: 1.5,
                                delay: particle.delay,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                            }}
                        />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}
