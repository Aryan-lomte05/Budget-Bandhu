'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';

interface Shape {
    id: number;
    type: 'circle' | 'square' | 'triangle';
    size: number;
    color: string;
    x: number;
    y: number;
    speed: number;
    rotate: number;
}

export function ParallaxBackground() {
    const ref = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    // Don't render on auth pages
    if (isAuthPage) return null;

    const shapes: Shape[] = [
        // Layer 1 - Slow (Background)
        { id: 1, type: 'circle', size: 120, color: 'rgba(16, 185, 129, 0.1)', x: 10, y: 10, speed: 0.2, rotate: 0 },
        { id: 2, type: 'square', size: 80, color: 'rgba(59, 130, 246, 0.08)', x: 80, y: 20, speed: 0.15, rotate: 45 },
        { id: 3, type: 'circle', size: 150, color: 'rgba(139, 92, 246, 0.06)', x: 70, y: 60, speed: 0.1, rotate: 0 },

        // Layer 2 - Medium
        { id: 4, type: 'triangle', size: 100, color: 'rgba(245, 158, 11, 0.12)', x: 20, y: 40, speed: 0.3, rotate: 30 },
        { id: 5, type: 'circle', size: 90, color: 'rgba(236, 72, 153, 0.1)', x: 85, y: 70, speed: 0.35, rotate: 0 },
        { id: 6, type: 'square', size: 70, color: 'rgba(16, 185, 129, 0.08)', x: 50, y: 85, speed: 0.25, rotate: 15 },

        // Layer 3 - Fast (Foreground)
        { id: 7, type: 'circle', size: 60, color: 'rgba(59, 130, 246, 0.15)', x: 15, y: 75, speed: 0.5, rotate: 0 },
        { id: 8, type: 'triangle', size: 80, color: 'rgba(139, 92, 246, 0.12)', x: 90, y: 45, speed: 0.45, rotate: 60 },
        { id: 9, type: 'square', size: 50, color: 'rgba(245, 158, 11, 0.1)', x: 40, y: 15, speed: 0.4, rotate: 25 },
    ];

    return (
        <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {shapes.map((shape) => {
                const y = useTransform(scrollYProgress, [0, 1], [0, shape.speed * 1000]);
                const rotate = useTransform(scrollYProgress, [0, 1], [shape.rotate, shape.rotate + 360]);

                return (
                    <motion.div
                        key={shape.id}
                        style={{
                            position: 'absolute',
                            left: `${shape.x}%`,
                            top: `${shape.y}%`,
                            width: shape.size,
                            height: shape.size,
                            y,
                            rotate,
                        }}
                    >
                        {shape.type === 'circle' && (
                            <div
                                className="w-full h-full rounded-full blur-2xl"
                                style={{ backgroundColor: shape.color }}
                            />
                        )}
                        {shape.type === 'square' && (
                            <div
                                className="w-full h-full blur-2xl"
                                style={{ backgroundColor: shape.color }}
                            />
                        )}
                        {shape.type === 'triangle' && (
                            <div
                                className="w-full h-full blur-2xl"
                                style={{
                                    backgroundColor: shape.color,
                                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                                }}
                            />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
