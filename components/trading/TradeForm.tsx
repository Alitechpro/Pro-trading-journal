// app/components/trading/TradeForm.tsx
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import DatePicker from "react-datepicker";

interface TradeFormProps {
  symbol: string;
  setSymbol: (v: string) => void;
  capitalRisked: string;
  setCapitalRisked: (v: string) => void;
  entry: string;
  setEntry: (v: string) => void;
  exit: string;
  setExit: (v: string) => void;
  date: Date | null;
  setDate: (v: Date | null) => void;
  onSubmit: () => void;
  symbolInputRef: React.RefObject<HTMLInputElement>;
}

export default function TradeForm({
  symbol,
  setSymbol,
  capitalRisked,
  setCapitalRisked,
  entry,
  setEntry,
  exit,
  setExit,
  date,
  setDate,
  onSubmit,
  symbolInputRef,
}: TradeFormProps) {
  const isAddReady = symbol && capitalRisked && entry && exit && date;

  return (
    <div className="relative rounded-3xl bg-linear-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl border border-white/10 p-12 shadow-2xl overflow-visible z-10">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen blur-3xl opacity-30 animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen blur-3xl opacity-30 animate-pulse delay-1000" />

      <h2 className="text-5xl lg:text-6xl font-black text-center mb-12 bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        ADD NEXT WINNER
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto"
      >
        {/* Symbol */}
        <div className="group">
          <input
            ref={symbolInputRef}
            placeholder="BTC"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full px-6 py-7 bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl focus:border-cyan-400 outline-none text-3xl font-black text-center uppercase text-cyan-300 placeholder-cyan-600 transition-all duration-300 group-hover:border-cyan-300 shadow-2xl"
            required
          />
          <p className="text-cyan-400 text-xl text-center mt-2 opacity-70 font-medium">
            Symbol
          </p>
        </div>

        {/* Size */}
        <div className="group">
          <input
            type="number"
            placeholder="1000"
            value={capitalRisked}
            onChange={(e) => setCapitalRisked(e.target.value)}
            className="w-full px-6 py-7 bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl focus:border-emerald-400 outline-none text-3xl font-black text-center text-emerald-300 placeholder-emerald-600 transition-all duration-300 group-hover:border-emerald-300 shadow-2xl [appearance:textfield] [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
            required
          />
          <p className="text-emerald-400 text-xl text-center mt-2 opacity-70 font-medium">
            Size ($)
          </p>
        </div>

        {/* Date */}
        <div className="group">
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            customInput={
              <button
                type="button"
                className="w-full px-6 py-7 bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl hover:border-purple-300 transition-all duration-300 shadow-2xl flex items-center justify-center cursor-pointer"
              >
                <span className="text-purple-300 text-3xl font-black tracking-wider select-none">
                  {date
                    ? new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "DATE"}
                </span>
              </button>
            }
            wrapperClassName="w-full"
            popperClassName="cyberpunk-calendar"
            popperPlacement="top-start"
            showPopperArrow={false}
          />
          <p className="text-purple-400 text-xl text-center mt-2 opacity-70 font-medium">
            Date
          </p>
        </div>

        {/* Entry */}
        <div className="group">
          <input
            type="number"
            step="0.000001"
            placeholder="Entry"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="w-full px-6 py-7 bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl focus:border-yellow-400 outline-none text-3xl font-black text-center text-yellow-300 placeholder-yellow-600 transition-all duration-300 group-hover:border-yellow-300 shadow-2xl [appearance:textfield] [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
            required
          />
          <p className="text-yellow-400 text-xl text-center mt-2 opacity-70 font-medium">
            Buy
          </p>
        </div>

        {/* Exit */}
        <div className="group">
          <input
            type="number"
            step="0.000001"
            placeholder="Exit"
            value={exit}
            onChange={(e) => setExit(e.target.value)}
            className="w-full px-6 py-7 bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl focus:border-pink-400 outline-none text-3xl font-black text-center text-pink-300 placeholder-pink-600 transition-all duration-300 group-hover:border-pink-300 shadow-2xl [appearance:textfield] [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
            required
          />
          <p className="text-pink-400 text-xl text-center mt-2 opacity-70 font-medium">
            Sell
          </p>
        </div>

        {/* Submit */}
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <motion.button
            type="submit"
            whileHover={isAddReady ? { scale: 1.08 } : {}}
            whileTap={isAddReady ? { scale: 0.95 } : {}}
            disabled={!isAddReady}
            className={`relative w-full py-7 rounded-2xl font-black text-3xl shadow-2xl flex items-center justify-center gap-3 overflow-hidden transition-all duration-500 ${
              isAddReady
                ? "bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 hover:shadow-cyan-500/50 cursor-pointer"
                : "bg-linear-to-r from-gray-800 via-gray-900 to-gray-800 text-white/30 cursor-not-allowed"
            }`}
          >
            {isAddReady && (
              <div className="absolute inset-0 bg-white/20 animate-ping" />
            )}
            <span className="relative z-10 flex items-center gap-3">
              {isAddReady ? (
                <>
                  ADD TRADE <Sparkles className="w-9 h-9" />
                </>
              ) : (
                "FILL ALL FIELDS"
              )}
            </span>
          </motion.button>
        </div>
      </form>
    </div>
  );
}
