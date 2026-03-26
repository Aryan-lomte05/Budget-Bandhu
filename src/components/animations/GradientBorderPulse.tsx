"use client";

import { motion } from "framer-motion";

interface GradientBorderPulseProps {
    isHovered: boolean;
    color: "orange" | "purple";
}

export function GradientBorderPulse({ isHovered, color }: GradientBorderPulseProps) {
    const gradients = {
        orange: "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FF1744 100%)",
        purple: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C084FC 100%)",
    };

    return (
        <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2, ease: "easeIn" }}
            style={{
                padding: "2px",
                background: gradients[color],
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
            }}
        />
    );
}
