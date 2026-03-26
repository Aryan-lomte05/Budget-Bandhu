'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface FloatingElement {
    id: number;
    icon: string;
    x: number;
    y: number;
    duration: number;
    delay: number;
    size: number;
}

export function FloatingElements() {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (isAuthPage) return null;

    const elements: FloatingElement[] = [
        { id: 1, icon: '💰', x: 5, y: 10, duration: 20, delay: 0, size: 40 },
        { id: 3, icon: '💳', x: 15, y: 80, duration: 22, delay: 4, size: 38 },
        { id: 5, icon: '💎', x: 50, y: 50, duration: 30, delay: 3, size: 42 },
        { id: 6, icon: '🚀', x: 25, y: 40, duration: 24, delay: 5, size: 34 },
        { id: 7, icon: '⭐', x: 70, y: 60, duration: 26, delay: 2, size: 32 },
    ];

    return (
        <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
            {elements.map((element) => (
                <motion.div
                    key={element.id}
                    initial={{
                        x: `${element.x}vw`,
                        y: `${element.y}vh`,
                        opacity: 0.3,
                        scale: 1,
                    }}
                    animate={{
                        y: [`${element.y}vh`, `${element.y - 15}vh`, `${element.y}vh`],
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: element.duration,
                        delay: element.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute"
                    style={{
                        fontSize: element.size,
                    }}
                >
                    {element.icon}
                </motion.div>
            ))}
        </div>
    );
}
