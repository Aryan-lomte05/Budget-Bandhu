"use client";

import { motion } from "framer-motion";

export function MicPulse() {
    return (
        <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
                background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
            }}
            animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
}
