"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
    active: boolean;
    onComplete?: () => void;
}

export function Confetti({ active, onComplete }: ConfettiProps) {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string }>>([]);

    useEffect(() => {
        if (active) {
            const colors = ['#10B981', '#3B82F6', '#F59E0B', '#A78BFA', '#EC4899'];
            const newParticles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * window.innerWidth,
                color: colors[Math.floor(Math.random() * colors.length)],
            }));
            setParticles(newParticles);

            setTimeout(() => {
                setParticles([]);
                onComplete?.();
            }, 3000);
        }
    }, [active, onComplete]);

    if (!active || particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                        backgroundColor: particle.color,
                        left: particle.x,
                        top: -20,
                    }}
                    initial={{ y: 0, opacity: 1, rotate: 0 }}
                    animate={{
                        y: window.innerHeight + 20,
                        opacity: 0,
                        rotate: Math.random() * 360,
                    }}
                    transition={{
                        duration: 2 + Math.random(),
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
}
