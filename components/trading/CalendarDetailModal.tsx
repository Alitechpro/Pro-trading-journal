// app/components/trading/CalendarDetailModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Trade } from "@/components/shared/types";
import TradeCard from "@/components/shared/TradeCard";

interface CalendarDetailModalProps {
  selectedDate: string | null;
  onClose: () => void;
  trades: Trade[];
  formatNumber: (num: number) => string;
}

export default function CalendarDetailModal({
  selectedDate,
  onClose,
  trades,
  formatNumber,
}: CalendarDetailModalProps) {
  if (!selectedDate) return null;

  const dayTrades = trades.filter((t) => t.date === selectedDate);
  const totalPnl = dayTrades.reduce((sum, t) => sum + t.pnlDollar, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="relative max-w-2xl w-full bg-linear-to-br from-slate-900/95 to-black/95 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-4xl p-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/60 hover:text-white"
          >
            <X className="w-8 h-8" />
          </button>

          <h3 className="text-4xl font-black text-center mb-8 bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>

          {dayTrades.length === 0 ? (
            <p className="text-center text-white/40 text-2xl py-20">
              No trades
            </p>
          ) : (
            <>
              {dayTrades.map((trade) => (
                <TradeCard
                  key={trade.id}
                  trade={trade}
                  formatNumber={formatNumber}
                />
              ))}

              <div className="mt-10 p-6 bg-linear-to-r from-cyan-900/30 to-purple-900/30 rounded-2xl border border-white/10 text-center">
                <p className="text-xl text-white/70 mb-2">Total P&L</p>
                <p
                  className={`text-5xl font-black ${
                    totalPnl >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {formatNumber(totalPnl)}
                </p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
