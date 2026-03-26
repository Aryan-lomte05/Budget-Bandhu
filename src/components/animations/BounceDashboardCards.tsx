'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import './BounceDashboardCards.css';

interface BounceDashboardCardsProps {
    children: ReactNode[];
    className?: string;
    enableHover?: boolean;
    initialRotations?: number[];
    initialTranslateX?: number[];
    pushDistance?: number;
}

export default function BounceDashboardCards({
    children,
    className = '',
    enableHover = true,
    initialRotations = [-3, 0, 3],
    initialTranslateX = [-30, 0, 30],
    pushDistance = 80
}: BounceDashboardCardsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Generate transform strings from rotation and translateX values
    const transformStyles = children.map((_, i) => {
        const rotation = initialRotations[i] || 0;
        const translateX = initialTranslateX[i] || 0;
        return `rotate(${rotation}deg) translateX(${translateX}px)`;
    });

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial bounce-in animation
            gsap.fromTo(
                '.bounce-dashboard-card',
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    stagger: 0.08,
                    ease: 'elastic.out(1, 0.7)',
                    delay: 0.3,
                    duration: 1.2
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const getNoRotationTransform = (transformStr: string) => {
        const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
        if (hasRotate) {
            return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
        }
        return transformStr === 'none' ? 'rotate(0deg)' : `${transformStr} rotate(0deg)`;
    };

    const getPushedTransform = (baseTransform: string, offsetX: number) => {
        const translateRegex = /translateX\(([-0-9.]+)px\)/;
        const match = baseTransform.match(translateRegex);
        if (match) {
            const currentX = parseFloat(match[1]);
            const newX = currentX + offsetX;
            return baseTransform.replace(translateRegex, `translateX(${newX}px)`);
        }
        return baseTransform === 'none' ? `translateX(${offsetX}px)` : `${baseTransform} translateX(${offsetX}px)`;
    };

    const pushSiblings = (hoveredIdx: number) => {
        if (!enableHover || !containerRef.current) return;

        const q = gsap.utils.selector(containerRef);

        children.forEach((_, i) => {
            const target = q(`.bounce-dashboard-card-${i}`);
            gsap.killTweensOf(target);

            const baseTransform = transformStyles[i] || 'none';

            if (i === hoveredIdx) {
                // Hovered card: remove rotation, scale up slightly
                const noRotationTransform = getNoRotationTransform(baseTransform);
                gsap.to(target, {
                    transform: noRotationTransform,
                    scale: 1.05,
                    zIndex: 10,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    duration: 0.4,
                    ease: 'back.out(1.4)',
                    overwrite: 'auto'
                });
            } else {
                // Sibling cards: push away
                const offsetX = i < hoveredIdx ? -pushDistance : pushDistance;
                const pushedTransform = getPushedTransform(baseTransform, offsetX);

                const distance = Math.abs(hoveredIdx - i);
                const delay = distance * 0.05;

                gsap.to(target, {
                    transform: pushedTransform,
                    scale: 0.95,
                    opacity: 0.7,
                    duration: 0.4,
                    ease: 'back.out(1.4)',
                    delay,
                    overwrite: 'auto'
                });
            }
        });
    };

    const resetSiblings = () => {
        if (!enableHover || !containerRef.current) return;

        const q = gsap.utils.selector(containerRef);

        children.forEach((_, i) => {
            const target = q(`.bounce-dashboard-card-${i}`);
            gsap.killTweensOf(target);
            const baseTransform = transformStyles[i] || 'none';
            gsap.to(target, {
                transform: baseTransform,
                scale: 1,
                opacity: 1,
                zIndex: 1,
                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
                duration: 0.4,
                ease: 'back.out(1.4)',
                overwrite: 'auto'
            });
        });
    };

    return (
        <div
            className={`bounce-dashboard-container ${className}`}
            ref={containerRef}
        >
            {children.map((child, idx) => (
                <div
                    key={idx}
                    className={`bounce-dashboard-card bounce-dashboard-card-${idx}`}
                    style={{
                        transform: transformStyles[idx] ?? 'none'
                    }}
                    onMouseEnter={() => pushSiblings(idx)}
                    onMouseLeave={resetSiblings}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}
