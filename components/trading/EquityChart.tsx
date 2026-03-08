// app/components/trading/EquityChart.tsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { TrendingUp } from "lucide-react"; // ← ADD THIS LINE

interface ChartDataPoint {
  date: string;
  capital: number;
}

interface EquityChartProps {
  chartData: ChartDataPoint[];
  formatNumber: (num: number) => string;
}

export default function EquityChart({
  chartData,
  formatNumber,
}: EquityChartProps) {
  return (
    <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
      <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <TrendingUp className="text-emerald-400" /> Equity Curve
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="equity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06ffa5" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis
            stroke="#94a3b8"
            tickFormatter={(v) => formatNumber(v).replace("$", "")}
          />
          <Tooltip
            formatter={(v: number) => formatNumber(v)}
            contentStyle={{
              background: "#1e293b",
              borderRadius: "12px",
              border: "1px solid #334155",
            }}
          />
          <Area
            type="monotone"
            dataKey="capital"
            stroke="#06ffa5"
            strokeWidth={4}
            fill="url(#equity)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
