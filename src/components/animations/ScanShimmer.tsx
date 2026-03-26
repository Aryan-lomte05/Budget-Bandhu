"use client";

import { motion } from "framer-motion";

interface ScanShimmerProps {
    isActive: boolean;
}

export function ScanShimmer({ isActive }: ScanShimmerProps) {
    return (
        <>
            {isActive && (
                <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.4) 50%, transparent 70%)",
                            width: "200%",
                            height: "200%",
                        }}
                        initial={{ x: "-100%", y: "-100%" }}
                        animate={{ x: "0%", y: "0%" }}
                        transition={{
                            duration: 1.2,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            )}
        </>
    );
}
