"use client";

import { useRef } from "react";
import { TrendingUp, AlertCircle, Sparkles, TrendingDown } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Logo3D } from "@/components/shared/Logo3D";
import { RotatingCard } from "@/components/animations/RotatingCard";

export default function InsightsPage() {
    const insights = [
        { icon: TrendingUp, title: "Spending Up 40%", desc: "Shopping increased this week", color: "mm-orange" },
        { icon: AlertCircle, title: "Budget Alert", desc: "Food budget 90% used", color: "mm-orange" },
        { icon: Sparkles, title: "Great Job!", desc: "Savings up 15% this month", color: "mm-green" },
    ];

    // Scroll animations
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start end", "end start"]
    });

    const textScale = useSpring(
        useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.5, 0.75, 0.95, 1.0]),
        { stiffness: 100, damping: 30 }
    );
    const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5]);

    const cardScale = useSpring(
        useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 0.98, 1.0]),
        { stiffness: 100, damping: 30 }
    );

    return (
        <>
            {/* Fullscreen 3D Logo Canvas */}
            <Logo3D />

            <div className="space-y-0">
                {/* SECTION 1: Hero - Orange Background */}
                <section ref={heroRef} className="mm-section-orange mm-section-spacing relative perspective-container overflow-hidden">
                    {/* Logo Target - Top Center */}
                    <div data-logo-target="insights-hero" className="absolute left-1/2 top-1/3 -translate-x-1/2 w-64 h-64 pointer-events-none z-10" />

                    <div className="mm-container px-8 py-16 w-full max-w-7xl mx-auto">
                        <motion.div
                            style={{
                                scale: textScale,
                                opacity: textOpacity
                            }}
                            className="mb-16"
                        >
                            <h1 className="mm-section-heading text-center">
                                SMART INSIGHTS
                                <br />
                                AI POWERED
                            </h1>
                            <p className="text-center text-xl text-gray-700 mt-6 max-w-2xl mx-auto">
                                Deep analysis of your spending patterns and financial behavior
                            </p>
                        </motion.div>

                        {/* Insights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {insights.map((item, index) => {
                                // Wrap first card with RotatingCard
                                if (index === 0) {
                                    return (
                                        <RotatingCard
                                            key={item.title}
                                            initialRotation={-22}
                                            finalRotation={4}
                                            className="z-10"
                                        >
                                            <motion.div
                                                style={{ scale: cardScale }}
                                                initial={{ opacity: 0, y: 60 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            >
                                                <div className="mm-card card-3d h-full">
                                                    <div className={`w-16 h-16 bg-${item.color}/10 rounded-2xl flex items-center justify-center mb-6`}>
                                                        <item.icon className={`w-8 h-8 text-${item.color}`} />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-mm-black mb-3">{item.title}</h3>
                                                    <p className="text-lg text-gray-600">{item.desc}</p>
                                                </div>
                                            </motion.div>
                                        </RotatingCard>
                                    );
                                }

                                return (
                                    <motion.div
                                        key={item.title}
                                        style={{ scale: cardScale }}
                                        initial={{ opacity: 0, y: 60 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="mm-card card-3d"
                                    >
                                        <div className={`w-16 h-16 bg-${item.color}/10 rounded-2xl flex items-center justify-center mb-6`}>
                                            <item.icon className={`w-8 h-8 text-${item.color}`} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-mm-black mb-3">{item.title}</h3>
                                        <p className="text-lg text-gray-600">{item.desc}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* SECTION 2: CTA - Cream Background */}
                <section className="mm-section-cream mm-section-spacing relative">
                    {/* Logo Target - Center */}
                    <div data-logo-target="insights-cta" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none z-10" />

                    <div className="mm-container px-8 py-16 w-full max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h2 className="text-5xl md:text-6xl font-black text-mm-black mb-6 leading-tight">
                                Get Full
                                <br />
                                Report
                            </h2>
                            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                                Deep dive into your financial data with our comprehensive analysis
                            </p>
                            <button className="mm-btn mm-btn-primary text-lg px-12 py-6">
                                <Sparkles className="w-6 h-6" />
                                View Full Analysis
                            </button>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
}
