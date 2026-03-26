"use client";

import { motion } from "framer-motion";

interface RotatingCube3DProps {
    colors?: string[];
    size?: number;
    rotationSpeed?: number;
}

export function RotatingCube3D({
    colors = ["#FF6B35", "#F7931E", "#FF1744", "#E91E63"],
    size = 120,
    rotationSpeed = 3
}: RotatingCube3DProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 right-4 pointer-events-none"
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="cubeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={colors[0]} />
                        <stop offset="100%" stopColor={colors[1]} />
                    </linearGradient>
                    <linearGradient id="cubeGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={colors[1]} />
                        <stop offset="100%" stopColor={colors[2]} />
                    </linearGradient>
                    <linearGradient id="cubeGradient3" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={colors[2]} />
                        <stop offset="100%" stopColor={colors[3]} />
                    </linearGradient>
                </defs>

                {/* Animated rotating cube */}
                <motion.g
                    animate={{
                        rotateX: [0, 360],
                        rotateY: [0, 360],
                    }}
                    transition={{
                        duration: rotationSpeed,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{ transformOrigin: "center", transformBox: "fill-box" }}
                >
                    {/* Front face */}
                    <motion.path
                        d="M 60 80 L 140 80 L 140 160 L 60 160 Z"
                        stroke="url(#cubeGradient1)"
                        strokeWidth="3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Top face */}
                    <motion.path
                        d="M 60 80 L 100 40 L 180 40 L 140 80 Z"
                        stroke="url(#cubeGradient2)"
                        strokeWidth="3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                    />

                    {/* Right face */}
                    <motion.path
                        d="M 140 80 L 180 40 L 180 120 L 140 160 Z"
                        stroke="url(#cubeGradient3)"
                        strokeWidth="3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
                    />

                    {/* Connecting edges */}
                    <motion.line
                        x1="60" y1="80" x2="100" y2="40"
                        stroke={colors[0]}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    />
                    <motion.line
                        x1="140" y1="80" x2="180" y2="40"
                        stroke={colors[1]}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                    />
                    <motion.line
                        x1="140" y1="160" x2="180" y2="120"
                        stroke={colors[2]}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    />
                </motion.g>
            </svg>
        </motion.div>
    );
}
