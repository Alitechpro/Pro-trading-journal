// app/components/trading/TradingCalendar.tsx
"use client";

import { motion } from "framer-motion";
import { Trade } from "@/components/shared/types";

interface TradingCalendarProps {
  trades: Trade[];
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  setSelectedDate: (date: string | null) => void;
  formatNumber: (num: number) => string;
}

export default function TradingCalendar({
  trades,
  currentMonth,
  setCurrentMonth,
  setSelectedDate,
  formatNumber,
}: TradingCalendarProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getDayTrades = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return trades.filter((t) => t.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  return (
    <div className="relative rounded-3xl bg-black/40 backdrop-blur-3xl border border-purple-500/40 overflow-hidden shadow-2xl">
      {/* Floating neon orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative p-10">
        <h3 className="text-5xl lg:text-6xl font-black text-center mb-12 bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
          TRADING CALENDAR
        </h3>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1
                )
              )
            }
            className="group p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
          >
            <span className="text-3xl font-bold text-cyan-400 group-hover:text-cyan-300">
              ←
            </span>
          </button>

          <h4 className="text-4xl font-black bg-linear-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent tracking-wider">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h4>

          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1
                )
              )
            }
            className="group p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300"
          >
            <span className="text-3xl font-bold text-purple-400 group-hover:text-purple-300">
              →
            </span>
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-4 text-center mb-6">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-sm font-bold text-cyan-400 tracking-widest uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-5">
          {/* Empty cells */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayTrades = getDayTrades(day);
            const dayPnl = dayTrades.reduce((sum, t) => sum + t.pnlDollar, 0);
            const hasTrades = dayTrades.length > 0;
            const today = isToday(day);

            return (
              <motion.div
                key={day}
                whileHover={{ scale: 1.08, y: -4 }}
                onClick={() =>
                  hasTrades &&
                  setSelectedDate(
                    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  )
                }
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                  ${
                    !hasTrades
                      ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-400/40"
                      : dayPnl >= 0
                        ? "bg-emerald-500/20 border-emerald-400 hover:bg-emerald-500/40 hover:border-emerald-300 shadow-lg shadow-emerald-500/30"
                        : "bg-red-500/20 border-red-400 hover:bg-red-500/40 hover:border-red-300 shadow-lg shadow-red-500/30"
                  }
                  ${today ? "ring-4 ring-purple-400/70 ring-offset-4 ring-offset-black" : ""}
                `}
              >
                {/* Day Number */}
                <div className="text-3xl font-black text-white drop-shadow-lg">
                  {day}
                </div>

                {/* P&L */}
                {hasTrades && (
                  <div
                    className={`text-xl font-bold mt-2 ${
                      dayPnl >= 0 ? "text-emerald-300" : "text-red-300"
                    }`}
                  >
                    {dayPnl > 0 ? "+" : ""}
                    {formatNumber(dayPnl)}
                  </div>
                )}

                {/* Trade Count Badge */}
                {hasTrades && (
                  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
                    {dayTrades.length}{" "}
                    {dayTrades.length === 1 ? "trade" : "trades"}
                  </div>
                )}

                {/* Today Indicator */}
                {today && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-600/80 backdrop-blur text-xs font-black rounded-full">
                    TODAY
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
