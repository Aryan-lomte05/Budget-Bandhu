"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { mockData } from "@/lib/api/mock-data";

interface CrystalBallProps {
  forecast?: {
    predicted_savings: number;
    confidence: number;
    horizon: string;
  };
  isLoading?: boolean;
}

export const CrystalBall = ({ forecast, isLoading }: CrystalBallProps) => {
  // Use mock data as fallback
  const displayForecast = forecast || {
    predicted_savings: mockData.savingsForecast['30day'].predicted,
    confidence: mockData.savingsForecast['30day'].confidence,
    horizon: '30 days'
  };

  // Mock values for the 3 cards
  const predictedSpending = mockData.dashboardSummary.monthSpent * 1.05; // Dummy prediction
  const goalEtaDays = (mockData.goals[0] as any).eta_days || 45;

  return (
    <div className="py-16 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">AI PREDICTION</h2>
        <p className="text-gray-600 mb-12 text-lg">Looking into your financial future...</p>

        {/* The Crystal Ball Orb */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            delay: 0.2 
          }}
          className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-16 rounded-full flex items-center justify-center will-change-transform"
          style={{
            background: "radial-gradient(circle, #7c3aed 0%, #1a0a3d 70%)",
            boxShadow: "0 0 80px rgba(124, 58, 237, 0.4), inset 0 0 40px rgba(255, 255, 255, 0.1)"
          }}
        >
          {/* Shimmer/Glow Layer */}
          <div className="absolute inset-0 rounded-full glow pulse pointer-events-none" />
          
          <div className="text-center relative z-20 px-6">
            <div className="text-purple-200 text-sm font-bold uppercase tracking-widest mb-2">Next Month Savings</div>
            <div className="text-4xl md:text-6xl font-black text-white font-display mb-2 drop-shadow-lg">
              {isLoading ? (
                <Loader2 className="w-12 h-12 animate-spin mx-auto" />
              ) : (
                <NumericFormat
                  value={displayForecast.predicted_savings}
                  displayType="text"
                  thousandSeparator=","
                  prefix="₹"
                  renderText={(value) => <span>{value}</span>}
                />
              )}
            </div>
            <div className="text-purple-300 text-sm font-semibold">
              {(displayForecast.confidence * 100).toFixed(0)}% AI Confidence
            </div>
          </div>
        </motion.div>

        {/* Prediction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              label: "Predicted Spending", 
              value: predictedSpending, 
              icon: TrendingUp, 
              color: "text-red-500",
              bgColor: "bg-red-50",
              unit: "₹"
            },
            { 
              label: "Predicted Savings", 
              value: displayForecast.predicted_savings, 
              icon: TrendingDown, 
              color: "text-emerald-500",
              bgColor: "bg-emerald-50",
              unit: "₹"
            },
            { 
              label: "Goal Completion", 
              value: goalEtaDays, 
              icon: Calendar, 
              color: "text-blue-500",
              bgColor: "bg-blue-50",
              unit: "Days"
            }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover-lift group"
            >
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">{card.label}</h4>
              <div className="text-2xl font-black text-gray-900 font-display">
                {card.unit === "₹" ? (
                  <NumericFormat
                    value={card.value}
                    displayType="text"
                    thousandSeparator=","
                    prefix="₹"
                    renderText={(value) => <span>{value}</span>}
                  />
                ) : (
                  <span>{card.value} {card.unit}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-100/30 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </div>
  );
};
