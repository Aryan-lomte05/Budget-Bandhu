import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function useParallax(distance: number = 100) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return { ref, y, opacity };
}
