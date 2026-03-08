// app/components/trading/MetricsCards.tsx
"use client";

import { motion } from "framer-motion";
import { DollarSign, Target, TrendingUp, Plus } from "lucide-react";

interface MetricsCardsProps {
  currentCapital: number;
  totalReturn: number;
  winRate: number;
  totalFeesPaid: number;
  tradesCount: number;
  formatNumber: (num: number) => string;
}

export default function MetricsCards({
  currentCapital,
  totalReturn,
  winRate,
  totalFeesPaid,
  tradesCount,
  formatNumber,
}: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
      {/* Capital */}
      <motion.div
        whileHover={{ scale: 1.06, y: -8 }}
        className="group relative rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 text-center cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <DollarSign className="w-10 h-10 text-cyan-400 mx-auto mb-4 transition-transform group-hover:scale-110" />
        <p className="text-white/60 text-sm uppercase tracking-wider">
          Capital
        </p>
        <p className="text-5xl font-bold text-cyan-400 transition-all group-hover:text-cyan-300">
          {formatNumber(currentCapital)}
        </p>
      </motion.div>

      {/* Return */}
      <motion.div
        whileHover={{ scale: 1.06, y: -8 }}
        className="group relative rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 text-center cursor-pointer overflow-hidden"
      >
        <div
          className={`absolute inset-0 bg-linear-to-br ${
            totalReturn >= 0 ? "from-emerald-500/20" : "from-red-500/20"
          } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
        <TrendingUp
          className={`w-10 h-10 mx-auto mb-4 ${
            totalReturn >= 0 ? "text-emerald-400" : "text-red-400"
          } transition-transform group-hover:scale-110`}
        />
        <p className="text-white/60 text-sm uppercase tracking-wider">Return</p>
        <p
          className={`text-5xl font-bold transition-all ${
            totalReturn >= 0
              ? "text-emerald-400 group-hover:text-emerald-300"
              : "text-red-400 group-hover:text-red-300"
          }`}
        >
          {totalReturn >= 0 ? "+" : ""}
          {totalReturn.toFixed(1)}%
        </p>
      </motion.div>

      {/* Win Rate */}
      <motion.div
        whileHover={{ scale: 1.06, y: -8 }}
        className="group relative rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 text-center cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Target className="w-10 h-10 text-purple-400 mx-auto mb-4 transition-transform group-hover:scale-110" />
        <p className="text-white/60 text-sm uppercase tracking-wider">
          Win Rate
        </p>
        <p className="text-5xl font-bold text-purple-400 transition-all group-hover:text-purple-300">
          {tradesCount === 0 ? "—" : `${winRate.toFixed(0)}%`}
        </p>
      </motion.div>

      {/* Fees Paid */}
      <motion.div
        whileHover={{ scale: 1.06, y: -8 }}
        className="group relative rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 text-center cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <DollarSign className="w-10 h-10 text-orange-400 mx-auto mb-4 transition-transform group-hover:scale-110" />
        <p className="text-white/60 text-sm uppercase tracking-wider">
          Fees Paid
        </p>
        <p className="text-5xl font-bold text-orange-400 transition-all group-hover:text-orange-300">
          {formatNumber(totalFeesPaid)}
        </p>
      </motion.div>

      {/* Trades */}
      <motion.div
        whileHover={{ scale: 1.06, y: -8 }}
        className="group relative rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 text-center cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-fuchsia-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Plus className="w-10 h-10 text-fuchsia-400 mx-auto mb-4 transition-transform group-hover:scale-110" />
        <p className="text-white/60 text-sm uppercase tracking-wider">Trades</p>
        <p className="text-5xl font-bold text-fuchsia-400 transition-all group-hover:text-fuchsia-300">
          {tradesCount}
        </p>
      </motion.div>
    </div>
  );
}
