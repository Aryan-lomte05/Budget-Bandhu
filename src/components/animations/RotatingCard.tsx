'use client';

import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

interface RotatingCardProps {
    children: ReactNode;
    initialRotation?: number;
    finalRotation?: number;
    textOverlay?: string;
    parallaxSpeed?: number;
    className?: string;
}

export function RotatingCard({
    children,
    initialRotation = -30,
    finalRotation = 5,
    textOverlay,
    parallaxSpeed = 0.5,
    className = ''
}: RotatingCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Scroll-driven animations
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Smooth rotation with spring physics
    const rotateX = useSpring(
        useTransform(
            scrollYProgress,
            [0, 0.3, 0.7, 1],
            [initialRotation, 0, 0, finalRotation]
        ),
        { stiffness: 100, damping: 30, restDelta: 0.001 }
    );

    // Parallax effect for text overlay
    const textX = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [-100 * parallaxSpeed, 0, 50 * parallaxSpeed]
    );

    const textOpacity = useTransform(
        scrollYProgress,
        [0, 0.3, 0.7, 1],
        [0, 1, 1, 0.5]
    );

    return (
        <div
            ref={ref}
            className={`relative ${className}`}
            style={{ perspective: '1500px' }}
        >
            {/* Text Overlay with Parallax */}
            {textOverlay && (
                <motion.div
                    style={{
                        x: textX,
                        opacity: textOpacity
                    }}
                    className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                >
                    <h3
                        className="font-display font-black text-white text-center drop-shadow-2xl"
                        style={{
                            fontSize: 'clamp(32px, 8vw, 120px)',
                            lineHeight: 0.9,
                            letterSpacing: '-0.02em',
                            textTransform: 'uppercase',
                            textShadow: '0 10px 40px rgba(0,0,0,0.3), 0 0 80px rgba(139, 92, 246, 0.5)'
                        }}
                    >
                        {textOverlay}
                    </h3>
                </motion.div>
            )}

            {/* Rotating Card */}
            <motion.div
                style={{
                    rotateX,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden'
                }}
                className="relative"
            >
                {children}
            </motion.div>
        </div>
    );
}

// Variant: Simple rotation without text overlay
export function SimpleRotatingCard({
    children,
    rotation = 15,
    className = ''
}: {
    children: ReactNode;
    rotation?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    });

    const rotateY = useSpring(
        useTransform(scrollYProgress, [0, 1], [rotation, -rotation]),
        { stiffness: 100, damping: 30 }
    );

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

    return (
        <div ref={ref} className={className} style={{ perspective: '1500px' }}>
            <motion.div
                style={{
                    rotateY,
                    scale,
                    transformStyle: 'preserve-3d'
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}
