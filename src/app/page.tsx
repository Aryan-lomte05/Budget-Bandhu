"use client";

import { useEffect, useState, useRef } from "react";
import { HeroSection } from "@/components/metamask-ui/HeroSection";
import { Logo3D } from "@/components/shared/Logo3D";
import { OpeningAnimation } from "@/components/animations/OpeningAnimation";
import { RotatingCard } from "@/components/animations/RotatingCard";
import BounceDashboardCards from "@/components/animations/BounceDashboardCards";
import { SpendingSparkline } from "@/components/dashboard/SpendingSparkline";
import { BudgetHealthGauge } from "@/components/dashboard/BudgetHealthGauge";
import { UpcomingBillsCarousel } from "@/components/dashboard/UpcomingBillsCarousel";
import { SpendingDonutChart } from "@/components/dashboard/SpendingDonutChart";
import { CashflowLineChart } from "@/components/dashboard/CashflowLineChart";
import { BudgetProgressBars } from "@/components/dashboard/BudgetProgressBars";
import { EmergencyFundBarometer } from "@/components/dashboard/EmergencyFundBarometer";
import { SpendingInsights } from "@/components/dashboard/SpendingInsights";
import { FinancialTimeMachine } from "@/components/dashboard/FinancialTimeMachine";
import { TaxOptimizerDashboard } from "@/components/dashboard/TaxOptimizerDashboard";
import { CrystalBall } from "@/components/shared/CrystalBall";
import { mockData } from "@/lib/api/mock-data";
import { useDashboard } from "@/lib/hooks/useMLApi";
import { useUserStore } from "@/lib/store/useUserStore";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { TrendingUp, Wallet, Target, Sparkles, PiggyBank, Shield, Loader2, Coins } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { getETHBalance, formatCryptoBalance } from "@/lib/utils/web3";

// Demo user ID - replace with actual user from auth
const DEMO_USER_ID = "696a022c3c758e29b2ca8d50";
const MM_EASING = [0.16, 1, 0.3, 1] as const;

export default function DashboardPage() {
  // Get user from store or use demo
  const { userId, walletAddress } = useUserStore();
  const activeUserId = userId || DEMO_USER_ID;

  // Crypto state
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [ethPriceINR, setEthPriceINR] = useState<number>(250000); // Fallback price
  const [isCryptoLoading, setIsCryptoLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      fetchCryptoData();
    }
  }, [walletAddress]);

  const fetchCryptoData = async () => {
    setIsCryptoLoading(true);
    try {
      // Fetch balance
      const balance = await getETHBalance(walletAddress!);
      setEthBalance(balance);

      // Fetch price from CoinGecko
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
      const data = await response.json();
      if (data.ethereum?.inr) {
        setEthPriceINR(data.ethereum.inr);
      }
    } catch (error) {
      console.error("Error fetching crypto data", error);
    } finally {
      setIsCryptoLoading(false);
    }
  };

  // Fetch real dashboard data from API
  const { data: apiData, loading, error, refetch } = useDashboard(activeUserId);

  // Determine if we should use real data (logged in user) or mock (demo)
  const shouldUseRealData = activeUserId !== DEMO_USER_ID;

  const dashboardData = (apiData || shouldUseRealData) ? {
    currentBalance: apiData?.stats.current_balance || 0,
    monthSpent: apiData?.stats.month_spent || 0,
    monthSaved: apiData?.stats.month_saved || 0,
    savingsRate: apiData?.stats.savings_rate || 0,
    budgetAdherence: 0,
    financialScore: apiData?.stats.financial_score || 0,
    trend: {
      balance: '+0%',
      spending: '+0%',
      savings: '+0%',
    },
    category_breakdown: apiData?.category_breakdown || {},
    insights: apiData?.insights || [],
    forecast: apiData?.forecast || undefined,
  } : {
    ...mockData.dashboardSummary,
    category_breakdown: mockData.budget.allocations.reduce<Record<string, { total: number; count: number }>>((acc, curr) => ({
      ...acc,
      [curr.category]: { total: curr.spent, count: 1 }
    }), {}),
    // Copy insights to mutable array
    insights: [...mockData.insights],
    // Transform forecast
    forecast: {
      horizon: '30 days',
      predicted_savings: mockData.savingsForecast['30day'].predicted,
      confidence: mockData.savingsForecast['30day'].confidence
    }
  };

  const [spendingTrend, setSpendingTrend] = useState<Array<{ date: string; amount: number }>>([]);
  const [budget, setBudget] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    // Mock trend data for now if not available
    if (!spendingTrend.length) {
      setSpendingTrend(mockData.spendingTrend);
    }
  }, []);


  // Find Emergency Fund goal
  const emergencyFundGoal = goals.find(g => g.name.toLowerCase().includes('emergency') || g.priority === 'high');

  // Calculate budget progress
  const budgetAllocations = budget?.allocations || [];
  const totalBudget = budget?.total_income || 50000; // Fallback or use income

  // Footer year
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  return (
    <>
      {/* Fullscreen 3D Logo Canvas - Always On Top (MetaMask Style) */}
      <Logo3D />

      <div className="space-y-0 px-6 max-w-[1920px] mx-auto overflow-x-hidden">
        {/* SECTION 1: Hero - Cream Background */}
        <section className="mm-section-cream mm-section-spacing relative">
          {/* Logo Target - Center Right */}
          <div data-logo-target="hero" className="absolute right-1/4 top-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none z-10" />

          <HeroSection />
        </section>

        {/* SECTION 2: Your Finances - Mint Green Background */}
        <section className="mm-section-mint mm-section-spacing scroll-reveal relative overflow-hidden">
          {/* Logo Target - CENTER */}
          <div data-logo-target="card" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none z-20" />

          <div className="mm-container py-12 w-full max-w-7xl mx-auto relative">
            {/* Headline */}
            <div className="mb-12 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="mm-section-heading text-center lg:text-left max-w-2xl leading-none">
                  YOUR FINANCES
                  <br />
                  UNDER CONTROL
                </h2>
                {/* Live Data Indicator */}
                {loading ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    LOADING...
                  </span>
                ) : apiData ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    LIVE DATA
                  </span>
                ) : null}
              </div>
            </div>

            {/* EXACT MetaMask 2-Column Grid */}
            <div className="metamask-exact-grid gap-6">
              {/* LEFT COLUMN */}
              <div className="mm-left-column space-y-6">
                {/* Purple Card 1 */}
                <div className="mm-card-purple-top mm-card-hover cursor-pointer rounded-3xl p-8 transform-gpu" style={{ backgroundColor: '#3C154E' }}>
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                        <Wallet className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Total Balance</h3>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-white mb-2 font-display">
                        <NumericFormat
                          value={dashboardData.currentBalance}
                          displayType="text"
                          thousandSeparator=","
                          prefix="₹"
                          renderText={(value) => <span>{value}</span>}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-emerald-300 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>+12% this month</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purple Card 2 */}
                <div className="mm-card-purple-bottom mm-card-hover cursor-pointer rounded-3xl p-6 bg-gradient-to-br from-purple-700 to-purple-900 transform-gpu mb-6">
                  <div className="flex items-center justify-between h-full">
                    <div>
                      <Sparkles className="w-10 h-10 text-white mb-2" />
                      <h3 className="text-lg font-bold text-white">Financial Score</h3>
                    </div>
                    <div className="text-5xl font-black text-white">{dashboardData.financialScore}</div>
                  </div>
                </div>

                {/* Crypto Assets Card - Only if wallet connected */}
                {walletAddress && (
                  <div className="mm-card-orange mm-card-hover cursor-pointer rounded-3xl p-6 bg-gradient-to-br from-orange-500 to-orange-700 transform-gpu shadow-xl border border-orange-400/30">
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <Coins className="w-7 h-7 text-white" />
                        </div>
                        {isCryptoLoading && <Loader2 className="w-4 h-4 text-white/50 animate-spin" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">Crypto Assets</h3>
                        <div className="text-3xl font-black text-white mb-1 font-display">
                          <NumericFormat
                            value={Number(ethBalance) * ethPriceINR}
                            displayType="text"
                            thousandSeparator=","
                            prefix="₹"
                            renderText={(value) => <span>{value}</span>}
                          />
                        </div>
                        <div className="flex items-center justify-between text-white/80 text-sm font-bold">
                          <span>{formatCryptoBalance(ethBalance)} ETH</span>
                          <span className="text-white/60">@ ₹{ethPriceINR.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="mm-right-column">
                <div className="mm-card-teal-tall mm-card-hover cursor-pointer rounded-3xl p-8 transform-gpu" style={{ background: '#0D4F4F' }}>
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="text-6xl mb-4">💰</div>
                      <h3 className="text-2xl font-bold text-white mb-3">Monthly Savings</h3>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-white mb-2 font-display">
                        <NumericFormat
                          value={dashboardData.monthSaved}
                          displayType="text"
                          thousandSeparator=","
                          prefix="₹"
                          renderText={(value) => <span>{value}</span>}
                        />
                      </div>
                      <div className="text-3xl font-black text-white">{Number(dashboardData.savingsRate).toFixed(1)}%</div>
                      <div className="text-sm text-white/80">Savings Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Analytics - Compact Background */}
        <section
          className="mm-section-spacing scroll-reveal relative overflow-hidden bg-[#FFF7ED]"
        >
          {/* Logo Target - Bottom Right */}
          <div data-logo-target="analytics" className="absolute right-1/3 bottom-1/4 w-48 h-48 pointer-events-none z-10" />

          <div className="mm-container px-6 py-12 w-full max-w-7xl mx-auto relative z-10">
            {/* Section Title */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-none">Your Financial Dashboard</h2>
              <p className="text-xl text-gray-700">Track, analyze, and optimize your spending</p>
            </div>

            {/* 3-Column Dashboard Cards */}
            <BounceDashboardCards
              enableHover
              initialRotations={[-3, 0, 3]}
              initialTranslateX={[-20, 0, 20]}
              pushDistance={60}
              className="gap-6"
            >
              <SpendingSparkline data={spendingTrend} />
              <BudgetHealthGauge spent={dashboardData.monthSpent} budget={totalBudget} />
              <UpcomingBillsCarousel />
            </BounceDashboardCards>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 mt-12">
              <div className="card-3d transform-gpu">
                <SpendingDonutChart data={dashboardData.category_breakdown} />
              </div>

              <div className="card-3d transform-gpu font-display">
                <CashflowLineChart data={spendingTrend} />
              </div>
            </div>

            <div className="mb-12 scroll-reveal">
              <BudgetProgressBars allocations={budgetAllocations} />
            </div>

            <div className="mb-12 scroll-reveal">
              <EmergencyFundBarometer goal={emergencyFundGoal} />
            </div>
          </div>
        </section>

        {/* SECTION 4: Insights - Background Gradient */}
        <section
          className="mm-section-spacing scroll-reveal relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #FDF4F0 0%, #FEE2E2 100%)'
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_30%_20%,rgba(139,92,246,0.1)_0%,transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(168,85,247,0.08)_0%,transparent_50%)]" />

          {/* Floating orbs */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />

          <div className="mm-container px-6 w-full max-w-7xl mx-auto relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-none tracking-tight">Financial Intelligence</h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">Get personalized advice and see into your financial future with our AI engine.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <div className="scroll-reveal" style={{ transitionDelay: '0.1s' }}>
                <SpendingInsights insights={dashboardData.insights} />
              </div>
              <div className="scroll-reveal" style={{ transitionDelay: '0.2s' }}>
                <FinancialTimeMachine forecast={dashboardData.forecast} />
              </div>
            </div>

            <div className="mt-12 scroll-reveal text-center" style={{ transitionDelay: '0.3s' }}>
              <TaxOptimizerDashboard />
            </div>
          </div>
        </section>

        {/* SECTION: Crystal Ball AI Forecast */}
        <section className="bg-white scroll-reveal">
          <CrystalBall 
            forecast={dashboardData.forecast} 
            isLoading={loading} 
          />
        </section>

        {/* SECTION 5: Trust Elements - Mint Gradient */}
        <section className="mm-section-mint mm-section-spacing scroll-reveal relative overflow-hidden">
          {/* Logo Target - Top Right Corner */}
          <div data-logo-target="features" className="absolute right-1/4 top-1/4 w-56 h-56 pointer-events-none z-10" />

          <div className="mm-container px-6 py-12 w-full max-w-7xl mx-auto">
            <h2 className="text-6xl md:text-[140px] font-black text-purple-900 leading-[0.85] tracking-tighter mb-16">
              RELIABLE.
              <br />
              SECURE.
              <br />
              SMART.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'BANK-GRADE SECURITY', desc: 'Your data is encrypted with AES-256 and never sold to third parties.' },
                { title: 'REAL-TIME SYNC', desc: 'Connect your accounts and see your wealth update in milliseconds.' },
                { title: 'AI ADVISOR', desc: 'Get tax-saving tips and investment suggestions tailored to your goals.' }
              ].map((feature, i) => (
                <div key={i} className="scroll-reveal p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-white/50" style={{ transitionDelay: `${0.1 * i}s` }}>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-700">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: CTA - Cream Background */}
        <section className="mm-section-cream mm-section-spacing scroll-reveal relative">
          {/* Logo Target - Center Left */}
          <div data-logo-target="cta" className="absolute left-1/3 top-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none z-10" />

          <div className="mm-container text-center px-4">
            <div className="scroll-reveal">
              <h2 className="mm-mega-heading mb-12">
                START YOUR
                <br />
                JOURNEY TODAY
              </h2>
              <button className="mm-btn mm-btn-primary text-xl px-12 py-6">
                GET STARTED
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white py-12 border-t border-gray-100">
          <div className="mm-container px-6 w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg" />
                <span className="text-xl font-black tracking-tighter text-gray-900">BUDGET BANDHU</span>
              </div>
              <div className="flex gap-8 text-sm font-bold text-gray-500">
                <a href="#" className="hover:text-purple-600 transition-colors">PRIVACY</a>
                <a href="#" className="hover:text-purple-600 transition-colors">TERMS</a>
                <a href="#" className="hover:text-purple-600 transition-colors">CONTACT</a>
              </div>
              <div className="text-sm font-bold text-gray-400">
                © {currentYear} BUDGET BANDHU. ALL RIGHTS RESERVED.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
