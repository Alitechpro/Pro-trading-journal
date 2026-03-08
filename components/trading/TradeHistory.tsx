// app/components/trading/TradeHistory.tsx
"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Trade } from "@/components/shared/types";

interface TradeHistoryProps {
  trades: Trade[];
  page: number;
  setPage: (page: number) => void;
  deleteTrade: (id: string) => void;
  formatNumber: (num: number) => string;
  formatDate: (dateStr: string) => string;
}

export default function TradeHistory({
  trades,
  page,
  setPage,
  deleteTrade,
  formatNumber,
}: TradeHistoryProps) {
  const tradesPerPage = 6;
  const paginatedTrades = [...trades]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice((page - 1) * tradesPerPage, page * tradesPerPage);

  const totalPages = Math.max(1, Math.ceil(trades.length / tradesPerPage));

  return (
    <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10 overflow-x-auto">
      <h3 className="text-3xl font-bold mb-6">Trade History</h3>

      {trades.length === 0 ? (
        <p className="text-center text-white/40 py-20 text-xl">
          No trades logged
        </p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead className="text-white/60 border-b border-white/10">
              <tr>
                <th className="text-left pb-4">Symbol</th>
                <th className="text-left pb-4">Size</th>
                <th className="text-left pb-4">Entry</th>
                <th className="text-left pb-4">Exit</th>
                <th className="text-left pb-4">P&L %</th>
                <th className="text-left pb-4">P&L $</th>
                <th className="text-left pb-4">Fees</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrades.map((trade) => (
                <motion.tr
                  key={trade.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/5"
                >
                  <td className="py-4 font-bold text-cyan-400">
                    {trade.symbol}
                  </td>
                  <td className="py-4">{formatNumber(trade.capitalRisked)}</td>
                  <td className="py-4">${trade.entry.toFixed(6)}</td>
                  <td className="py-4">${trade.exit.toFixed(6)}</td>
                  <td
                    className={`py-4 font-bold ${
                      trade.pnlPercent > 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {trade.pnlPercent > 0 ? "+" : ""}
                    {trade.pnlPercent.toFixed(2)}%
                  </td>
                  <td
                    className={`py-4 font-bold ${
                      trade.pnlDollar > 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {trade.pnlDollar > 0 ? "+" : ""}
                    {formatNumber(trade.pnlDollar)}
                  </td>
                  <td className="py-4 text-orange-400">
                    {formatNumber(trade.fees)}
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => deleteTrade(trade.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {trades.length > tradesPerPage && (
            <div className="flex justify-center gap-3 mt-8">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${
                    page === i + 1
                      ? "bg-linear-to-r from-cyan-500 to-purple-500 text-white shadow-lg scale-110"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
