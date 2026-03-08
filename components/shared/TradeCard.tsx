// app/components/shared/TradeCard.tsx
import { Trade } from "./types";

interface TradeCardProps {
  trade: Trade;
  formatNumber: (num: number) => string;
}

export default function TradeCard({ trade, formatNumber }: TradeCardProps) {
  return (
    <div className="mb-6 p-6 bg-white/5 rounded-2xl border border-white/10">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-3xl font-black text-cyan-400">
            {trade.symbol}
          </span>
          <span className="text-white/60 mx-4">→</span>
          <span className="text-yellow-300">${trade.entry.toFixed(6)}</span>
          <span className="text-white/60 mx-2">→</span>
          <span className="text-pink-300">${trade.exit.toFixed(6)}</span>
        </div>
        <div
          className={`text-3xl font-bold ${
            trade.pnlDollar >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {trade.pnlDollar >= 0 ? "+" : ""}
          {formatNumber(trade.pnlDollar)}
        </div>
      </div>
    </div>
  );
}
