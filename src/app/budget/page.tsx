"use client";

import { useState, useRef } from "react";
import { CategoryAllocation } from "@/components/budget/CategoryAllocation";
import { ComparisonChart } from "@/components/budget/ComparisonChart";
import { BudgetSlider } from "@/components/budget/BudgetSlider";
import { BudgetRecommendations } from "@/components/budget/BudgetRecommendations";
import { Logo3D } from "@/components/shared/Logo3D";
import { mockData } from "@/lib/api/mock-data";
import { useBudget } from "@/lib/hooks/useMLApi";
import { useUserStore } from "@/lib/store/useUserStore";
import { Target, TrendingDown, IndianRupee, PieChart, Sparkles, TrendingUp, Loader2 } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

// Demo user ID
const DEMO_USER_ID = "696a022c3c758e29b2ca8d50";

export default function BudgetPage() {
    // Get user from store or use demo
    const { userId } = useUserStore();
    const activeUserId = userId || DEMO_USER_ID;

    // Fetch real budget data and recommendations from API
    const {
        budget: apiBudget,
        recommendations,
        savingsPotential,
        loading,
        refetch,
        submitFeedback
    } = useBudget(activeUserId);

    // Use API data if available, fallback to mock
    const budgetData = apiBudget ? {
        totalIncome: apiBudget.total_income,
        allocations: apiBudget.allocations.map(a => ({
            category: a.category,
            allocated: a.allocated,
            spent: a.spent,
            color: '#6366f1' // Default color
        }))
    } : mockData.budget;
    const totalSpent = budgetData.allocations.reduce((acc, curr) => acc + curr.spent, 0);
    const totalAllocated = budgetData.allocations.reduce((acc, curr) => acc + curr.allocated, 0);
    const savingsRate = ((budgetData.totalIncome - totalSpent) / budgetData.totalIncome) * 100;
    const [adjustmentValue, setAdjustmentValue] = useState(2500);

    // Scroll zoom animations for sections
    const heroSectionRef = useRef<HTMLDivElement>(null);
    const cardsSectionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress: heroProgress } = useScroll({
        target: heroSectionRef,
        offset: ["start end", "end start"]
    });

    const heroTextScale = useSpring(
        useTransform(heroProgress, [0, 0.4, 0.8, 1], [0.5, 0.75, 0.95, 1.0]),
        { stiffness: 100, damping: 30 }
    );
    const heroTextOpacity = useTransform(heroProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5]);

    const { scrollYProgress: cardsProgress } = useScroll({
        target: cardsSectionRef,
        offset: ["start end", "end start"]
    });

    const cardsScale = useSpring(
        useTransform(cardsProgress, [0, 0.5, 1], [0.95, 0.98, 1.0]),
        { stiffness: 100, damping: 30 }
    );

    return (
        <>
            {/* Fullscreen 3D Logo Canvas */}
            <Logo3D />

            <div className="space-y-0">
                {/* SECTION 1: Hero - Mint Background */}
                <section ref={heroSectionRef} className="mm-section-mint mm-section-spacing relative perspective-container overflow-hidden">
                    {/* Logo Target */}
                    <div data-logo-target="hero" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none z-10" />

                    <div className="mm-container px-8 py-16 w-full max-w-7xl mx-auto">
                        {/* Massive Headline */}
                        <motion.div
                            style={{
                                scale: heroTextScale,
                                opacity: heroTextOpacity
                            }}
                            className="mb-16"
                        >
                            <h1 className="mm-section-heading text-center">
                                YOUR BUDGET
                                <br />
                                UNDER CONTROL
                            </h1>
                            <p className="text-center text-xl text-gray-700 mt-6 max-w-2xl mx-auto">
                                Manage your limits and optimize your savings with AI-powered insights
                            </p>
                        </motion.div>

                        {/* Quick Stats - Asymmetric Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="mm-card mm-card-medium card-3d"
                            >
                                <div className="w-16 h-16 bg-mm-purple/10 rounded-2xl flex items-center justify-center mb-6">
                                    <IndianRupee className="w-8 h-8 text-mm-purple" />
                                </div>
                                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">Total Spent</p>
                                <h2 className="text-4xl font-black text-mm-purple mb-3">{formatCurrency(totalSpent)}</h2>
                                <p className="text-sm text-gray-500">
                                    Out of {formatCurrency(budgetData.totalIncome)} income
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="mm-card-colored mm-card-green mm-card-medium card-3d"
                            >
                                <div className="text-6xl mb-4">💰</div>
                                <p className="text-sm font-semibold uppercase tracking-wide mb-2">Safe to Spend</p>
                                <h2 className="text-4xl font-black mb-3">{formatCurrency(totalAllocated - totalSpent)}</h2>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm font-semibold">
                                        {((totalSpent / totalAllocated) * 100).toFixed(0)}% through budget
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="mm-card mm-card-medium card-3d bg-gradient-to-br from-mm-purple to-mm-lavender text-white"
                            >
                                <Sparkles className="w-12 h-12 mb-6" />
                                <p className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-90">Savings Rate</p>
                                <h2 className="text-5xl font-black mb-3">{savingsRate.toFixed(1)}%</h2>
                                <p className="text-sm opacity-90">Excellent performance! 🎯</p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: Charts & Allocations - Cream Background */}
                <section ref={cardsSectionRef} className="mm-section-cream mm-section-spacing relative">
                    {/* Logo Target */}
                    <div data-logo-target="card" className="absolute left-1/4 top-1/3 -translate-x-1/2 w-64 h-64 pointer-events-none z-10" />

                    <div className="mm-container px-8 py-16 w-full max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Budget vs Actual Chart */}
                            <motion.div
                                style={{ scale: cardsScale }}
                                initial={{ opacity: 0, x: -60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="mm-card card-3d"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-mm-green/10 rounded-xl flex items-center justify-center">
                                        <PieChart className="w-6 h-6 text-mm-green" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-mm-black">Spending vs Budget</h3>
                                </div>
                                <ComparisonChart />
                            </motion.div>

                            {/* Category Allocations */}
                            <motion.div
                                style={{ scale: cardsScale }}
                                initial={{ opacity: 0, x: 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="mm-card card-3d"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-mm-purple/10 rounded-xl flex items-center justify-center">
                                            <Target className="w-6 h-6 text-mm-purple" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-mm-black">Category Limits</h3>
                                    </div>
                                    <button className="mm-btn-secondary text-sm">Edit All</button>
                                </div>
                                <CategoryAllocation allocations={budgetData.allocations as any} />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: AI Optimization - Orange Background */}
                <section className="mm-section-orange mm-section-spacing relative">
                    {/* Logo Target */}
                    <div data-logo-target="cta" className="absolute right-1/4 top-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none z-10" />

                    <div className="mm-container px-8 py-16 w-full max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center mb-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-bold text-mm-purple shadow-lg mb-6">
                                <Sparkles className="w-4 h-4" />
                                {loading ? 'LOADING AI...' : 'POLICYLEARNER AI'}
                            </div>

                            <h2 className="text-5xl md:text-6xl font-black text-mm-black mb-6 leading-tight">
                                Optimize Your
                                <br />
                                Monthly Savings
                            </h2>

                            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                                AI-powered recommendations based on your spending patterns
                            </p>
                        </motion.div>

                        {/* PolicyLearner Recommendations */}
                        <BudgetRecommendations
                            recommendations={recommendations}
                            savingsPotential={savingsPotential}
                            onAccept={async (category) => await submitFeedback(category, 'accepted')}
                            onReject={async (category) => await submitFeedback(category, 'rejected')}
                            onRefresh={refetch}
                            loading={loading}
                        />

                        {/* Manual Adjustment Fallback */}
                        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-xl mx-auto mt-8">
                            <BudgetSlider
                                label="Emergency Fund Adjustment"
                                value={adjustmentValue}
                                onChange={setAdjustmentValue}
                            />
                            <button className="mm-btn mm-btn-primary w-full mt-6 text-lg">
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
