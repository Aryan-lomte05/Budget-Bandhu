'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FireworksProps {
    isActive: boolean;
    duration?: number;
    onComplete?: () => void;
}

export function FireworksEffect({ isActive, duration = 5000, onComplete }: FireworksProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isActive || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Firework particles
        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            color: string;
            size: number;
            life: number;
            maxLife: number;

            constructor(x: number, y: number, color: string) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.color = color;
                this.size = Math.random() * 3 + 2;
                this.life = 0;
                this.maxLife = Math.random() * 60 + 60;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.1; // gravity
                this.life++;
            }

            draw(ctx: CanvasRenderingContext2D) {
                const opacity = 1 - this.life / this.maxLife;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            isDead() {
                return this.life >= this.maxLife;
            }
        }

        // Rocket class
        class Rocket {
            x: number;
            y: number;
            targetY: number;
            vy: number;
            color: string;
            exploded: boolean;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height;
                this.targetY = Math.random() * canvas.height * 0.5 + 50;
                this.vy = -8;
                this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
                this.exploded = false;
            }

            update() {
                this.y += this.vy;
                if (this.y <= this.targetY) {
                    this.exploded = true;
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        let particles: Particle[] = [];
        let rockets: Rocket[] = [];
        let animationId: number;
        let lastRocketTime = 0;
        const startTime = Date.now();

        function animate() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;

            if (elapsed >= duration) {
                cancelAnimationFrame(animationId);
                if (onComplete) onComplete();
                return;
            }

            ctx!.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx!.fillRect(0, 0, canvas.width, canvas.height);

            // Launch new rockets
            if (currentTime - lastRocketTime > 400) {
                rockets.push(new Rocket());
                lastRocketTime = currentTime;
            }

            // Update and draw rockets
            rockets = rockets.filter(rocket => {
                rocket.update();
                if (rocket.exploded) {
                    // Create explosion particles
                    for (let i = 0; i < 100; i++) {
                        particles.push(new Particle(rocket.x, rocket.y, rocket.color));
                    }
                    return false;
                }
                rocket.draw(ctx!);
                return true;
            });

            // Update and draw particles
            particles = particles.filter(particle => {
                particle.update();
                particle.draw(ctx!);
                return !particle.isDead();
            });

            animationId = requestAnimationFrame(animate);
        }

        animate();

        // Resize handler
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, [isActive, duration, onComplete]);

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] pointer-events-none"
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full"
                        style={{ background: 'transparent' }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
