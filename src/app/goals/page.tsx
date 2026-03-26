"use client";

import { useState, useRef, useEffect } from "react";
import { GoalCard } from "@/components/goals/GoalCard";
import { AddGoalModal } from "@/components/goals/AddGoalModal";
import { mockData } from "@/lib/api/mock-data";
import { useGoals } from "@/lib/hooks/useMLApi";
import { useUserStore } from "@/lib/store/useUserStore";
import { Target, Trophy, TrendingUp, Plus, Sparkles, Wallet, Lightbulb, AlertTriangle, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { useConfetti } from "@/lib/hooks/useConfetti";
import { useFireworks } from "@/lib/hooks/useFireworks";
import { useBalloons } from "@/lib/hooks/useBalloons";
import { FireworksEffect } from "@/components/animations/FireworksEffect";
import { useXPTriggers } from "@/lib/hooks/useXPTriggers";
import { Balloons } from "@/components/animations/Balloons";

// Demo user ID
const DEMO_USER_ID = "696a022c3c758e29b2ca8d50";

export interface Goal {
    id: string;
    name: string;
    icon: string;
    target: number;
    current: number;
    deadline: string;
    priority: string;
    color: string;
    milestones: Array<{
        amount: number;
        reached: boolean;
        date: string | null;
    }>;
    // ML Forecast Data
    eta_days?: number | null;
    on_track?: boolean;
}

export default function GoalsPage() {
    // Get user from store or use demo
    const { userId } = useUserStore();
    const activeUserId = userId || DEMO_USER_ID;

    // Fetch real goals from API
    const {
        goals: apiGoals,
        loading,
        refetch,
        createGoal: createGoalApi,
        contributeToGoal
    } = useGoals(activeUserId);

    // Use API data if available, fallback to mock for UI
    const [goals, setGoals] = useState<Goal[]>(mockData.goals as unknown as Goal[]);

    // Sync API goals to local state when available
    useEffect(() => {
        if (apiGoals.length > 0) {
            setGoals(apiGoals.map(g => ({
                id: g.id,
                name: g.name,
                icon: g.icon,
                target: g.target,
                current: g.current,
                deadline: g.deadline,
                priority: g.priority,
                color: g.color,
                milestones: g.milestones || [],
                eta_days: g.eta_days,
                on_track: g.on_track
            })));
        }
    }, [apiGoals]);
    const { fireCelebration, fireConfetti } = useConfetti();
    const { isActive: fireworksActive, launch: launchFireworks } = useFireworks();
    const { isActive: balloonsActive, launch: launchBalloons } = useBalloons();

    const { onGoalContribution, onGoalCompleted } = useXPTriggers();

    // Add Goal Modal State
    const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

    const handleAddGoal = async (newGoal: Omit<Goal, 'id' | 'current' | 'milestones'>) => {
        try {
            const created = await createGoalApi({
                name: newGoal.name,
                target: newGoal.target,
                deadline: newGoal.deadline,
                icon: newGoal.icon,
                priority: newGoal.priority.toLowerCase() as 'low' | 'medium' | 'high',
                color: newGoal.color
            });

            // Re-fetch handled by hook or add manually if needed
            // But hook should auto-update if it refetches. 
            // Better to trust re-fetch or optimistically update.
            // For now, let's call refetch
            refetch();

            fireConfetti({ particleCount: 100, spread: 70, origin: { x: 0.5, y: 0.5 } });
        } catch (error) {
            console.error("Failed to create goal", error);
        }
    };

    const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
    const totalCurrent = goals.reduce((acc, g) => acc + g.current, 0);
    const overallProgress = (totalCurrent / totalTarget) * 100;

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

    const checkMilestones = (goal: Goal, oldCurrent: number, newCurrent: number) => {
        const milestones = [25, 50, 75];
        for (const milestone of milestones) {
            const oldPercentage = (oldCurrent / goal.target) * 100;
            const newPercentage = (newCurrent / goal.target) * 100;
            if (oldPercentage < milestone && newPercentage >= milestone) {
                return milestone;
            }
        }
        return null;
    };

    const handleAddMoney = async (goalId: string, amount: number) => {
        try {
            const result = await contributeToGoal(goalId, amount);

            // Find goal for animation logic
            const goal = goals.find(g => g.id === goalId);
            if (!goal) return;

            const oldCurrent = goal.current;
            const newCurrent = result.new_current;

            // Trigger animations
            onGoalContribution(amount);
            const milestoneReached = checkMilestones(goal, oldCurrent, newCurrent);
            if (milestoneReached) {
                setTimeout(() => launchBalloons(5000), 200);
            }
            if (result.is_complete || (newCurrent >= goal.target && oldCurrent < goal.target)) {
                setTimeout(() => onGoalCompleted(), 500);
                setTimeout(() => fireCelebration(), 300);

                // Check all complete
                // This is hard to do with just one update, but we can approximate or refetch
            } else if (!milestoneReached) {
                fireConfetti({
                    particleCount: 50,
                    spread: 50,
                    origin: { x: 0.5, y: 0.7 },
                });
            }

            refetch();

        } catch (error) {
            console.error("Contribution failed", error);
        }
    };

    const getGoalInsight = (goal: Goal) => {
        const percentage = (goal.current / goal.target) * 100;
        const remaining = goal.target - goal.current;

        // 1. Goal Achieved
        if (percentage >= 100) return {
            title: "Goal Achieved!",
            message: "Great job! Consider moving these funds to a high-yield instrument.",
            type: "success",
            icon: CheckCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-100"
        };

        // 2. ML Forecast: Not on Track
        if (goal.on_track === false && goal.eta_days) {
            const delayDays = goal.eta_days - 30; // Rough estimate of delay
            return {
                title: "Risk of Delay",
                message: `Forecast suggests you might miss the deadline by ~${Math.max(5, Math.round(delayDays))} days. Increase contribution!`,
                type: "warning",
                icon: AlertTriangle,
                color: "text-amber-600",
                bg: "bg-amber-100"
            };
        }

        // 3. ML Forecast: On Track
        if (goal.on_track === true) {
            return {
                title: "On Track (AI Verified)",
                message: `You are projected to hit this goal in ${goal.eta_days} days. Keep it up!`,
                type: "success",
                icon: Sparkles,
                color: "text-indigo-600",
                bg: "bg-indigo-100"
            };
        }

        // 4. Fallback Rules
        if (goal.priority === "High" && percentage < 40) return {
            title: "Boost Required",
            message: `Increase monthly savings by ₹${Math.round(remaining / 12)} to hit target on time.`,
            type: "warning",
            icon: AlertTriangle,
            color: "text-amber-600",
            bg: "bg-amber-100"
        };

        if (goal.name.toLowerCase().includes("trip") || goal.icon === "✈️") return {
            title: "Travel Hack",
            message: "Book flights 3 months in advance to save up to 20%.",
            type: "tips",
            icon: Lightbulb,
            color: "text-blue-600",
            bg: "bg-blue-100"
        };

        if (goal.name.toLowerCase().includes("home") || goal.icon === "🏠") return {
            title: "Market Watch",
            message: "Home loan interest rates have stabilized. Good time to review options.",
            type: "tips",
            icon: TrendingUp,
            color: "text-purple-600",
            bg: "bg-purple-100"
        };

        return {
            title: "On Track",
            message: "Consistent contributions will get you there. Keep it up!",
            type: "info",
            icon: Sparkles,
            color: "text-indigo-600",
            bg: "bg-indigo-100"
        };
    };

    return (
        <>
            <div className="space-y-0">
                {/* SECTION 1: Hero - Mint Background */}
                <section ref={heroRef} className="mm-section-mint relative perspective-container overflow-hidden">
                    <div className="mm-container px-8 pt-8 pb-2 w-full max-w-7xl mx-auto">
                        {/* Hero Two-Column Layout */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-2">
                            {/* Left: Massive Headline */}
                            <motion.div
                                style={{
                                    scale: textScale,
                                    opacity: textOpacity
                                }}
                                className="flex-1"
                            >
                                <h1 className="mm-section-heading !text-left leading-none tracking-tight pl-0 ml-0">
                                    <span className="text-7xl lg:text-8xl xl:text-9xl block text-mm-black mb-2 pl-0 ml-0">DREAM BIG</span>
                                    <span className="text-7xl lg:text-8xl xl:text-9xl block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent transform origin-left hover:scale-[1.02] transition-transform duration-300 cursor-default pl-0 ml-0">
                                        SAVE SMART
                                    </span>
                                </h1>
                                <p className="text-left text-2xl lg:text-3xl text-mm-black/70 mt-6 max-w-2xl font-medium leading-relaxed pl-0 ml-0">
                                    Turning your financial dreams into achievable milestones
                                </p>
                            </motion.div>

                            {/* Right: Stats Card - Premium Interactions */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 lg:p-10 flex flex-col gap-6 min-w-[320px] self-start mt-8 lg:mt-12 mr-8 lg:mr-12 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                            >
                                {/* Stat 1 - Active Goals */}
                                <div className="group flex items-center gap-5 cursor-default">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: -5, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)" }}
                                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg transition-all duration-300"
                                    >
                                        <Target className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <div>
                                        <span className="text-3xl font-black text-mm-black group-hover:text-purple-600 transition-colors">{goals.length}</span>
                                        <span className="text-gray-500 ml-2 font-bold text-sm uppercase tracking-wider block">Active Goals</span>
                                    </div>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                                {/* Stat 2 - Saved */}
                                <div className="group flex items-center gap-5 cursor-default">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)" }}
                                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg transition-all duration-300"
                                    >
                                        <Wallet className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <div>
                                        <span className="text-3xl font-black text-mm-black group-hover:text-emerald-600 transition-colors">{formatCurrency(totalCurrent)}</span>
                                        <span className="text-gray-500 ml-2 font-bold text-sm uppercase tracking-wider block">Total Saved</span>
                                    </div>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                                {/* Stat 3 - On Track */}
                                <div className="group flex items-center gap-5 cursor-default">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: -5, boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.4)" }}
                                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg transition-all duration-300"
                                    >
                                        <TrendingUp className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <div>
                                        <span className="text-3xl font-black text-mm-black group-hover:text-orange-600 transition-colors">{goals.filter(g => (g.current / g.target) >= 0.4).length}</span>
                                        <span className="text-gray-500 ml-2 font-bold text-sm uppercase tracking-wider block">On Track</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Overall Progress Card - Redesigned */}
                        <motion.div
                            style={{ scale: cardScale }}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="mm-card-colored bg-gradient-to-br from-emerald-500 from-10% via-emerald-600 to-teal-700 shadow-2xl shadow-emerald-900/20 card-3d p-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                                {/* Left: Progress Circle (Expanded) */}
                                <div className="lg:col-span-5 flex items-center justify-center p-4">
                                    <div className="relative w-64 h-64 lg:w-72 lg:h-72">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                stroke="currentColor"
                                                strokeWidth="12"
                                                fill="transparent"
                                                className="text-emerald-900/30"
                                            />
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                stroke="currentColor"
                                                strokeWidth="12"
                                                fill="transparent"
                                                strokeDasharray={440}
                                                strokeDashoffset={440 - (440 * overallProgress) / 100}
                                                className="text-white transition-all duration-1000 ease-out"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-6xl font-black text-white">{overallProgress.toFixed(0)}%</span>
                                            <span className="text-sm font-medium text-white/80 mt-1 uppercase tracking-widest">Goal Completion</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Center: Stat Bubbles (Expanded to Right) */}
                                <div className="lg:col-span-7 flex flex-col gap-6 justify-center">
                                    {/* Total Saved Bubble */}
                                    <motion.div
                                        className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-3xl p-4 lg:p-5 hover:from-white/70 hover:to-white/40 transition-all cursor-pointer group shadow-xl"
                                        whileHover={{ scale: 1.02, y: -2 }}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg coin-wiggle relative sparkle-on-hover shrink-0">
                                                <span className="text-xl">💰</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] lg:text-xs font-bold text-emerald-900/70 uppercase tracking-wider">Total Saved</p>
                                                <h3 className="text-2xl lg:text-3xl font-black text-emerald-900 mt-0.5">{formatCurrency(totalCurrent)}</h3>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Goal Distance Bubble */}
                                    <motion.div
                                        className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-3xl p-4 lg:p-5 hover:from-white/70 hover:to-white/40 transition-all cursor-pointer group shadow-xl"
                                        whileHover={{ scale: 1.02, y: -2 }}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg group-hover:animate-pulse shrink-0">
                                                <span className="text-xl">🎯</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] lg:text-xs font-bold text-emerald-900/70 uppercase tracking-wider">Goal Distance</p>
                                                <h3 className="text-2xl lg:text-3xl font-black text-emerald-900 mt-0.5">{formatCurrency(totalTarget - totalCurrent)}</h3>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* On Track Message */}
                                    <motion.div
                                        className="bg-emerald-800/20 backdrop-blur-sm rounded-2xl px-6 py-4 hover:bg-emerald-800/30 transition-all cursor-pointer border border-emerald-400/30"
                                        whileHover={{ scale: 1.01 }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <TrendingUp className="w-6 h-6 text-white" />
                                            <span className="text-white font-medium text-lg">
                                                On track to hit <strong className="text-yellow-200">Emergency Fund</strong> by July 2024!
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* SECTION 2: Active Milestones - Premium Light */}
                <section className="mm-section-midnight overflow-hidden relative bg-[#0f0f13]">
                    {/* Massive Cosmic Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0f0f13] to-[#0f0f13] pointer-events-none" />

                    <div className="mm-container px-8 py-16 w-full max-w-7xl mx-auto relative z-10">
                        {/* Header Row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div>
                                <h2 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">
                                    Active Milestones
                                </h2>
                                <p className="text-gray-400 text-lg">Tracks your progress towards your dreams</p>
                            </div>
                            <button
                                onClick={() => setIsAddGoalOpen(true)}
                                className="mm-btn py-4 px-8 rounded-2xl bg-white text-black font-bold flex items-center gap-2 hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all group"
                            >
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                Add New Goal
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {goals.map((goal, index) => (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <GoalCard
                                        goal={goal}
                                        onAddMoney={handleAddMoney}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 3: AI Coach - Vibrant Peach/Orange */}
                <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white py-20">
                    {/* Floating background elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <div className="mm-container px-8 w-full max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-orange-100 rounded-full text-sm font-bold text-orange-600 mb-6 shadow-md hover:shadow-lg transition-all"
                            >
                                <Sparkles className="w-4 h-4" />
                                AI WEALTH COACH
                            </motion.div>

                            <h3 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
                                <span className="text-gray-900 block mb-2">Personalized Strategy</span>
                                <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                                    Tailored Financial Advice
                                </span>
                            </h3>

                            <p className="text-gray-600 font-medium text-xl max-w-2xl mx-auto leading-relaxed">
                                Smart insights derived from your spending patterns to accelerate your goals
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {goals.map((goal, index) => {
                                const insight = getGoalInsight(goal);
                                return (
                                    <motion.div
                                        key={goal.id}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: index * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
                                        whileHover={{ y: -12, scale: 1.02 }}
                                        className="bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all border border-orange-50/50 flex flex-col relative overflow-hidden group"
                                    >
                                        {/* Hover Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{goal.icon}</div>
                                                    <h4 className="font-bold text-xl text-gray-900 line-clamp-1">{goal.name}</h4>
                                                </div>
                                                <div className={`p-3 rounded-2xl ${insight.bg} border border-transparent group-hover:scale-110 transition-transform`}>
                                                    <insight.icon className={`w-6 h-6 ${insight.color}`} />
                                                </div>
                                            </div>

                                            <h5 className={`font-bold text-lg mb-3 ${insight.color}`}>{insight.title}</h5>
                                            <p className="text-gray-500 text-base leading-relaxed mb-8 flex-1 font-medium">
                                                {insight.message}
                                            </p>

                                            <button className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:bg-orange-600 group-hover:shadow-lg shadow-gray-900/10">
                                                Action Plan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>

            {/* Animations */}
            <FireworksEffect isActive={fireworksActive} duration={8000} />
            <Balloons isActive={balloonsActive} duration={5000} count={15} />

            {/* Modals */}
            <AddGoalModal
                isOpen={isAddGoalOpen}
                onClose={() => setIsAddGoalOpen(false)}
                onAddGoal={handleAddGoal}
            />
        </>
    );
}
