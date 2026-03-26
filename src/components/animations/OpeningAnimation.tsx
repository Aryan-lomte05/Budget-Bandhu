'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OpeningAnimationProps {
    duration?: number;
}

export function OpeningAnimation({
    duration = 1800
}: OpeningAnimationProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    // MetaMask's EXACT easing with slight overshoot
    // This creates the smooth "bounce" effect
    const metaMaskEasing = [0.25, 0.46, 0.45, 0.94] as const;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 0.98 // Slight scale down like MetaMask
                    }}
                    transition={{
                        duration: 0.95, // MetaMask's exact 0.95s
                        ease: metaMaskEasing as any
                    }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    style={{
                        background: '#3D065F' // MetaMask's exact purple
                    }}
                >
                    {/* Text with MetaMask's exact font */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        <h1
                            style={{
                                // MetaMask's exact font stack
                                fontFamily: '"Euclid Circular B", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                fontSize: '28px', // MetaMask's exact size
                                fontWeight: 600, // Semi-bold
                                color: '#F5F0E8', // MetaMask's exact cream color
                                letterSpacing: '0.02em',
                                textRendering: 'optimizeLegibility',
                                WebkitFontSmoothing: 'antialiased',
                                MozOsxFontSmoothing: 'grayscale'
                            }}
                        >
                            Budget Bandhu
                        </h1>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
