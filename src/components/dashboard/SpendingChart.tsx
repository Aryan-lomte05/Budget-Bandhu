"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SpendingChartProps {
    data: Array<{ date: string; amount: number }>;
}

export function SpendingChart({ data }: SpendingChartProps) {
    return (
        <div className="glass p-6 rounded-2xl border-2 border-white/50">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Spending Trend</h3>
                    <p className="text-sm text-gray-600">Last 30 days</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-mint-500" />
                        <span className="text-sm text-gray-600">Spending</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                        dataKey="date"
                        stroke="#9CA3AF"
                        style={{ fontSize: "12px" }}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        style={{ fontSize: "12px" }}
                        tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value: number | undefined) => [
                            `₹${(value || 0).toLocaleString("en-IN")}`,
                            "Spent",
                        ]}
                    />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#10B981"
                        strokeWidth={2}
                        fill="url(#colorAmount)"
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
