// app/page.tsx — FINAL 2025+ CYBERPUNK PRO TRADING JOURNAL WITH CLERK AUTH
// MODAL 100% FIXED — NO MORE FROZEN INPUTS — EVERYTHING WORKS FLAWLESSLY

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {
  Target,
  DollarSign,
  X,
  Sparkles,
  Trash2,
  TrendingUp,
  Plus,
  LogOut,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useClerk,
} from "@clerk/nextjs";

interface Trade {
  id: string;
  symbol: string;
  date: string;
  capitalRisked: number;
  quantity: number;
  entry: number;
  exit: number;
  pnlPercent: number;
  pnlDollar: number;
  fees: number;
}

export default function App() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialInput, setInitialInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [initial, setInitial] = useState(10000);
  const [target, setTarget] = useState(100000);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [page, setPage] = useState(1);

  const [symbol, setSymbol] = useState("");
  const [capitalRisked, setCapitalRisked] = useState("");
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const symbolInputRef = useRef<HTMLInputElement>(null);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const FEE_RATE = 0.001;

  // LOAD DATA + DECIDE IF MODAL SHOULD SHOW
  useEffect(() => {
    if (isSignedIn && user) {
      const savedTrades = localStorage.getItem(`trades_${user.id}`);
      const savedSettings = localStorage.getItem(`settings_${user.id}`);

      if (savedTrades) setTrades(JSON.parse(savedTrades));

      if (savedSettings) {
        const { i, t } = JSON.parse(savedSettings);
        setInitial(i);
        setTarget(t);
        setInitialInput(i.toString());
        setGoalInput(t.toString());
        setIsModalOpen(false);
      } else {
        setInitialInput("");
        setGoalInput("");
        setIsModalOpen(true);
      }
    }
  }, [isSignedIn, user]);

  // SAVE EVERYTHING
  useEffect(() => {
    if (isSignedIn && user) {
      localStorage.setItem(`trades_${user.id}`, JSON.stringify(trades));
      localStorage.setItem(
        `settings_${user.id}`,
        JSON.stringify({ i: initial, t: target })
      );
    }
  }, [trades, initial, target, isSignedIn, user]);

  const handleStart = () => {
    const init = parseFloat(initialInput.replace(/[^0-9]/g, "")) || 10000;
    const goal = parseFloat(goalInput.replace(/[^0-9]/g, "")) || 100000;
    if (init > 0 && goal > init) {
      setInitial(init);
      setTarget(goal);
      setIsModalOpen(false);
    }
  };

  const addTrade = () => {
    if (!symbol || !capitalRisked || !entry || !exit || !date) return;

    const capital = parseFloat(capitalRisked);
    const entryPrice = parseFloat(entry);
    const exitPrice = parseFloat(exit);
    if (isNaN(capital) || isNaN(entryPrice) || isNaN(exitPrice) || capital <= 0)
      return;

    const quantity = capital / entryPrice;
    const exitValue = quantity * exitPrice;
    const totalFees = capital * FEE_RATE * 2;
    const netPnlDollar = exitValue - capital - totalFees;
    const netPnlPercent = (netPnlDollar / capital) * 100;
    const tradeDate = date.toISOString().split("T")[0];

    const newTrade: Trade = {
      id: Date.now().toString() + Math.random(),
      symbol: symbol.toUpperCase().trim(),
      date: tradeDate,
      capitalRisked: capital,
      quantity,
      entry: entryPrice,
      exit: exitPrice,
      pnlPercent: Number(netPnlPercent.toFixed(4)),
      pnlDollar: Number(netPnlDollar.toFixed(6)),
      fees: Number(totalFees.toFixed(6)),
    };

    setTrades((prev) => [...prev, newTrade]);
    setSymbol("");
    setCapitalRisked("");
    setEntry("");
    setExit("");
    setDate(new Date());
    symbolInputRef.current?.focus();
  };

  const deleteTrade = (id: string) => {
    setTrades((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      const maxPage = Math.max(1, Math.ceil(updated.length / 6));
      if (page > maxPage) setPage(maxPage);
      return updated;
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  };

  const formatNumber = (num: number): string => {
    const abs = Math.abs(num);
    if (abs >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (abs >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (abs >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
    return `$${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const {
    chartData,
    currentCapital,
    totalReturn,
    winRate,
    totalFeesPaid,
    totalPnlDollar,
  } = useMemo(() => {
    let capital = initial;
    const data = [{ date: "Start", capital: Math.round(capital) }];
    let feesAccumulated = 0;

    const sorted = [...trades].sort((a, b) => a.date.localeCompare(b.date));
    sorted.forEach((trade) => {
      capital += trade.pnlDollar;
      feesAccumulated += trade.fees;
      data.push({
        date: `${trade.symbol} ${formatDate(trade.date)}`,
        capital: Math.round(capital),
      });
    });

    const totalReturn = initial > 0 ? ((capital - initial) / initial) * 100 : 0;
    const winners = trades.filter((t) => t.pnlDollar > 0);
    const winRate =
      trades.length > 0 ? (winners.length / trades.length) * 100 : 0;

    return {
      chartData: data,
      currentCapital: Math.round(capital),
      totalReturn,
      winRate,
      totalFeesPaid: Number(feesAccumulated.toFixed(2)),
      totalPnlDollar: Math.round(capital - initial),
    };
  }, [trades, initial]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isAddReady = symbol && capitalRisked && entry && exit && date;

  return (
    <>
      {/* GUEST SCREEN */}
      <SignedOut>
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 via-transparent to-purple-900/10" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 mix-blend-soft-light" />
        </div>

        <div className="min-h-screen flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-2xl"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-zinc-900/95 to-black/90 backdrop-blur-3xl border border-white/10 shadow-4xl p-12 lg:p-16 text-center">
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-transparent opacity-30 blur-xl" />

              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
                Pro Trading Journal
              </h1>
              <p className="text-2xl lg:text-3xl font-light text-white/70 mb-12 tracking-widest">
                Your Account Is The Scoreboard
              </p>

              <div className="space-y-12 max-w-lg mx-auto">
                <div className="group">
                  <label className="flex items-center justify-center gap-3 text-lg font-medium text-white/80 mb-3">
                    <DollarSign className="w-6 h-6 text-cyan-400" /> Starting
                    Capital
                  </label>
                  <input
                    type="text"
                    value={initialInput}
                    onChange={(e) =>
                      setInitialInput(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="w-full px-8 py-6 text-5xl font-medium text-center bg-white/5 border border-white/10 rounded-2xl focus:border-cyan-400/50 focus:bg-white/10 outline-none text-white placeholder-white/30 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
                    placeholder="10000"
                  />
                </div>

                <div className="group">
                  <label className="flex items-center justify-center gap-3 text-lg font-medium text-white/80 mb-3">
                    <Target className="w-6 h-6 text-purple-400" /> Freedom Goal
                  </label>
                  <input
                    type="text"
                    value={goalInput}
                    onChange={(e) =>
                      setGoalInput(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="w-full px-8 py-6 text-5xl font-medium text-center bg-white/5 border border-white/10 rounded-2xl focus:border-purple-400/50 focus:bg-white/10 outline-none text-white placeholder-white/30 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
                    placeholder="100000"
                  />
                </div>

                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full py-7 text-2xl font-semibold tracking-wide bg-gradient-to-r from-cyan-500 via-cyan-400 to-purple-500 rounded-2xl shadow-2xl overflow-hidden group cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Begin Journey <Sparkles className="w-8 h-8" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </motion.button>
                </SignInButton>
              </div>

              <p className="mt-12 text-sm text-white/40 font-light tracking-widest">
                COMPOUNDING IS THE 8TH WONDER
              </p>
            </div>
          </motion.div>
        </div>
      </SignedOut>

      {/* AUTHENTICATED USER */}
      <SignedIn>
        {/* USER BUTTON WITH CUSTOM "Manage Goals" INSIDE THE DROPDOWN */}
        <div className="fixed top-6 right-6 z-50">
          <UserButton afterSignOutUrl="/">
            <UserButton.MenuItems>
              {/* THIS IS THE ONLY WAY THAT WORKS IN 2025 */}
              <UserButton.Action
                label="Manage Goals"
                labelIcon={<Target className="w-5 h-5" />}
                onClick={() => {
                  setInitialInput(initial.toString());
                  setGoalInput(target.toString());
                  setIsModalOpen(true);
                }}
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>

        {/* CLERK DROPDOWN FULL COLOR CONTROL – COPY-PASTE THIS */}
        <style jsx global>{`
          /* ─────────────── CLERK CYBERPUNK 2025 – FINAL & TRULY UNBREAKABLE ─────────────── */

          /* Main popover card – covers all versions */
          .cl-userButtonPopoverCard,
          [data-clerk-user-button-popover-card] {
            background: #0f0f23 !important;
            border: 1px solid #6366f1 !important;
            backdrop-filter: blur(20px) !important;
            box-shadow: 0 0 50px rgba(139, 92, 246, 0.5) !important;
            border-radius: 16px !important;
            width: 280px !important;
            overflow: hidden !important;
          }

          /* Force white text & icons everywhere */
          .cl-userButtonPopoverCard *,
          [data-clerk-user-button-popover-card] * {
            color: white !important;
            fill: white !important;
            font-weight: 600 !important;
          }

          /* Action buttons – targets BOTH old (.cl-) and new (data-) attributes */
          .cl-userButtonPopoverActionButton,
          [data-clerk-user-button-popover-action-button] {
            background: rgba(26, 26, 46, 0.7) !important;
            border: 1px solid rgba(167, 139, 250, 0.3) !important;
            border-radius: 12px !important;
            padding: 12px 16px !important;
            margin: 6px 12px !important;
            transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1) !important;
            backdrop-filter: blur(12px) !important;
          }

          /* HOVER — INSANE GLOW (works on custom "Manage Goals" too) */
          .cl-userButtonPopoverActionButton:hover,
          [data-clerk-user-button-popover-action-button]:hover {
            background: rgba(99, 102, 241, 0.45) !important;
            border-color: #c4b5fd !important;
            box-shadow: 0 0 30px rgba(167, 139, 250, 0.7) !important;
            transform: translateY(-4px) scale(1.03) !important;
          }

          /* Icons – including your Target icon */
          .cl-userButtonPopoverActionButton svg,
          [data-clerk-user-button-popover-action-button] svg {
            color: #e0d6ff !important;
            fill: #e0d6ff !important;
            filter: drop-shadow(0 0 10px #a78bfa);
          }

          /* Avatar – neon ring of power */
          .cl-userButtonAvatarBox,
          [data-clerk-user-button-avatar] {
            border: 3px solid #a78bfa !important;
            box-shadow: 0 0 20px #a78bfa, 0 0 40px rgba(139, 92, 246, 0.6) !important;
            border-radius: 50% !important;
          }

          /* Sign out button – subtle red danger glow */
          [data-clerk-user-button-popover-action-button][aria-label="Sign out"],
          .cl-userButtonPopoverActionButton[data-sign-out] {
            color: #fda4af !important;
          }
          [data-clerk-user-button-popover-action-button][aria-label="Sign out"]:hover {
            background: rgba(239, 68, 68, 0.4) !important;
            box-shadow: 0 0 25px rgba(239, 68, 68, 0.5) !important;
          }

          /* Divider – clean & minimal */
          .cl-divider,
          hr[data-clerk] {
            border-color: rgba(167, 139, 250, 0.2) !important;
            margin: 8px 16px !important;
          }
        `}</style>

        {/* FINAL PROFESSIONAL DATEPICKER – PERFECT HOVER & READABILITY */}
        <style jsx global>{`
          .cyberpunk-calendar .react-datepicker {
            background: #0f0f23 !important;
            border: 1px solid #6366f1 !important;
            border-radius: 16px !important;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5),
              0 0 60px rgba(99, 102, 241, 0.25) !important;
            backdrop-filter: blur(16px) !important;
            font-family: "Geist Mono", "JetBrains Mono", monospace;
          }

          .cyberpunk-calendar .react-datepicker__header {
            background: linear-gradient(to bottom, #1e1b4b, #0f0f2d) !important;
            border-bottom: 1px solid #6366f1 !important;
            padding: 16px !important;
          }

          .cyberpunk-calendar .react-datepicker__current-month,
          .cyberpunk-calendar .react-datepicker__day-name {
            color: #c4b5fd !important;
            font-weight: 800 !important;
            letter-spacing: 1px;
          }

          .cyberpunk-calendar .react-datepicker__day-name {
            font-size: 0.8rem !important;
            text-transform: uppercase;
            color: #a5b4fc !important;
          }

          .cyberpunk-calendar .react-datepicker__day {
            color: #e0e7ff !important;
            font-weight: 600 !important;
            width: 44px !important;
            height: 44px !important;
            line-height: 44px !important;
            margin: 4px !important;
            border-radius: 12px !important;
            background: rgba(255, 255, 255, 0.03) !important;
            transition: all 0.25s ease !important;
            position: relative;
          }

          /* FIXED HOVER – NOW PERFECTLY VISIBLE */
          .cyberpunk-calendar .react-datepicker__day:hover {
            background: #6366f1 !important;
            color: white !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5) !important;
            font-weight: 800 !important;
          }

          .cyberpunk-calendar .react-datepicker__day--selected {
            background: linear-gradient(135deg, #10b981, #06d6a0) !important;
            color: black !important;
            font-weight: 900 !important;
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.6) !important;
          }

          .cyberpunk-calendar .react-datepicker__day--today {
            color: #10b981 !important;
            font-weight: 900 !important;
            background: rgba(16, 185, 129, 0.15) !important;
            border: 1px solid #10b981 !important;
          }

          .cyberpunk-calendar .react-datepicker__day--outside-month {
            color: #ffffff25 !important;
            background: transparent !important;
            pointer-events: none !important;
          }
        `}</style>

        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 via-transparent to-purple-900/10" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 mix-blend-soft-light" />
        </div>

        {/* REUSABLE GOALS MODAL — WORKS ON FIRST LOGIN + ANYTIME LATER */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                className="relative w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-zinc-900/95 to-black/90 backdrop-blur-3xl border border-white/10 shadow-4xl p-12 lg:p-16 text-center">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-8 right-8 text-white/40 hover:text-white transition"
                  >
                    <X className="w-7 h-7" />
                  </button>

                  <h1 className="text-5xl lg:text-6xl font-bold text-white mb-12">
                    {initial === 10000 && target === 100000
                      ? "Set Your Journey"
                      : "Update Goals"}
                  </h1>

                  <div className="space-y-8">
                    <div>
                      <p className="text-white/60 mb-2">Starting Capital</p>
                      <input
                        type="text"
                        value={initialInput}
                        onChange={(e) =>
                          setInitialInput(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        className="w-full px-8 py-6 text-5xl text-center bg-white/5 rounded-2xl border border-white/10 focus:border-cyan-400 outline-none text-white"
                        autoFocus
                      />
                    </div>

                    <div>
                      <p className="text-white/60 mb-2">Freedom Goal</p>
                      <input
                        type="text"
                        value={goalInput}
                        onChange={(e) =>
                          setGoalInput(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        className="w-full px-8 py-6 text-5xl text-center bg-white/5 rounded-2xl border border-white/10 focus:border-purple-400 outline-none text-white"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStart}
                      className="w-full py-8 text-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl shadow-2xl"
                    >
                      {initial === 10000 && target === 100000
                        ? "BEGIN COMPOUNDING"
                        : "UPDATE GOALS"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN DASHBOARD */}
        {!isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen px-6 py-16"
          >
            <div className="max-w-7xl mx-auto space-y-16">
              {/* HERO */}
              <div className="text-center py-12">
                <h1 className="text-7xl lg:text-9xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-white bg-clip-text text-transparent">
                    {formatNumber(initial)}
                  </span>
                  <span className="text-white/30 mx-6">→</span>
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-white bg-clip-text text-transparent">
                    {formatNumber(target)}
                  </span>
                </h1>
                <p className="text-4xl mt-8">
                  <span
                    className={
                      totalPnlDollar >= 0 ? "text-emerald-400" : "text-red-400"
                    }
                  >
                    {totalPnlDollar >= 0 ? "+" : "−"}
                    {formatNumber(Math.abs(totalPnlDollar))}
                  </span>
                  <span className="text-white/50 ml-4">all time</span>
                </p>
                <p className="text-2xl lg:text-3xl mt-6 text-white/50 font-light tracking-widest">
                  COMPOUND UNTIL FREEDOM
                </p>
              </div>

              {/* METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                <motion.div
                  whileHover={{ scale: 1.06, y: -8 }}
                  className="group relative rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 text-center cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <DollarSign className="w-10 h-10 text-cyan-400 mx-auto mb-4 transition-transform group-hover:scale-110" />
                  <p className="text-white/60 text-sm uppercase tracking-wider">
                    Capital
                  </p>
                  <p className="text-5xl font-bold text-cyan-400 transition-all group-hover:text-cyan-300">
                    {formatNumber(currentCapital)}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.06, y: -8 }}
                  className="group relative rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 text-center cursor-pointer overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      totalReturn >= 0
                        ? "from-emerald-500/20"
                        : "from-red-500/20"
                    } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <TrendingUp
                    className={`w-10 h-10 mx-auto mb-4 ${
                      totalReturn >= 0 ? "text-emerald-400" : "text-red-400"
                    } transition-transform group-hover:scale-110`}
                  />
                  <p className="text-white/60 text-sm uppercase tracking-wider">
                    Return
                  </p>
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

                <motion.div
                  whileHover={{ scale: 1.06, y: -8 }}
                  className="group relative rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 text-center cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Target className="w-10 h-10 text-purple-400 mx-auto mb-4 transition-transform group-hover:scale-110" />
                  <p className="text-white/60 text-sm uppercase tracking-wider">
                    Win Rate
                  </p>
                  <p className="text-5xl font-bold text-purple-400 transition-all group-hover:text-purple-300">
                    {trades.length === 0 ? "—" : `${winRate.toFixed(0)}%`}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.06, y: -8 }}
                  className="group relative rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 text-center cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <DollarSign className="w-10 h-10 text-orange-400 mx-auto mb-4 transition-transform group-hover:scale-110" />
                  <p className="text-white/60 text-sm uppercase tracking-wider">
                    Fees Paid
                  </p>
                  <p className="text-5xl font-bold text-orange-400 transition-all group-hover:text-orange-300">
                    {formatNumber(totalFeesPaid)}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.06, y: -8 }}
                  className="group relative rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 text-center cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Plus className="w-10 h-10 text-fuchsia-400 mx-auto mb-4 transition-transform group-hover:scale-110" />
                  <p className="text-white/60 text-sm uppercase tracking-wider">
                    Trades
                  </p>
                  <p className="text-5xl font-bold text-fuchsia-400 transition-all group-hover:text-fuchsia-300">
                    {trades.length}
                  </p>
                </motion.div>
              </div>

              {/* ADD TRADE */}
              <div className="relative rounded-3xl bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl border border-white/10 p-12 shadow-2xl overflow-visible z-10">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen blur-3xl opacity-30 animate-pulse" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen blur-3xl opacity-30 animate-pulse delay-1000" />
                <h2 className="text-5xl lg:text-6xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ADD NEXT WINNER
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addTrade();
                  }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto"
                >
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
                  <div className="group">
                    <DatePicker
                      selected={date}
                      onChange={(date) => setDate(date)} // date can be Date | null → TypeScript happy
                      customInput={
                        <button
                          type="button"
                          className="w-full px-6 py-7 bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl hover:border-purple-300 transition-all duration-300 shadow-2xl flex items-center justify-center cursor-pointer"
                        >
                          <span className="text-purple-300 text-3xl font-black tracking-wider select-none">
                            {date
                              ? formatDate(date.toISOString().split("T")[0])
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
                  <div className="col-span-2 md:col-span-3 lg:col-span-1">
                    <motion.button
                      type="submit"
                      whileHover={isAddReady ? { scale: 1.08 } : {}}
                      whileTap={isAddReady ? { scale: 0.95 } : {}}
                      disabled={!isAddReady}
                      className={`relative w-full py-7 rounded-2xl font-black text-3xl shadow-2xl flex items-center justify-center gap-3 overflow-hidden transition-all duration-500 ${
                        isAddReady
                          ? "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:shadow-cyan-500/50 cursor-pointer"
                          : "bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white/30 cursor-not-allowed"
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

              {/* HISTORY + EQUITY CURVE */}
              <div className="grid lg:grid-cols-2 gap-10">
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
                          {[...trades]
                            .sort((a, b) => b.date.localeCompare(a.date))
                            .slice((page - 1) * 6, page * 6)
                            .map((trade) => (
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
                                <td className="py-4">
                                  {formatNumber(trade.capitalRisked)}
                                </td>
                                <td className="py-4">
                                  ${trade.entry.toFixed(6)}
                                </td>
                                <td className="py-4">
                                  ${trade.exit.toFixed(6)}
                                </td>
                                <td
                                  className={`py-4 font-bold ${
                                    trade.pnlPercent > 0
                                      ? "text-emerald-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {trade.pnlPercent > 0 ? "+" : ""}
                                  {trade.pnlPercent.toFixed(2)}%
                                </td>
                                <td
                                  className={`py-4 font-bold ${
                                    trade.pnlDollar > 0
                                      ? "text-emerald-400"
                                      : "text-red-400"
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
                      {trades.length > 6 && (
                        <div className="flex justify-center gap-3 mt-8">
                          {Array.from(
                            { length: Math.ceil(trades.length / 6) },
                            (_, i) => (
                              <button
                                key={i + 1}
                                onClick={() => setPage(i + 1)}
                                className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${
                                  page === i + 1
                                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg scale-110"
                                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                {i + 1}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
                  <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <TrendingUp className="text-emerald-400" /> Equity Curve
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="equity" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#06ffa5"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis
                        stroke="#94a3b8"
                        tickFormatter={(v) => formatNumber(v).replace("$", "")}
                      />
                      <Tooltip
                        formatter={(v: any) => formatNumber(v)}
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
              </div>

              {/* TRADING CALENDAR — CYBERPUNK 2025 EDITION */}
              <div className="relative rounded-3xl bg-black/40 backdrop-blur-3xl border border-purple-500/40 overflow-hidden shadow-2xl">
                {/* Floating neon orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative p-10">
                  <h3 className="text-5xl lg:text-6xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                    TRADING CALENDAR
                  </h3>

                  {/* Month Navigation */}
                  <div className="flex justify-between items-center mb-10">
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          (prev) =>
                            new Date(prev.getFullYear(), prev.getMonth() - 1)
                        )
                      }
                      className="group p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
                    >
                      <span className="text-3xl font-bold text-cyan-400 group-hover:text-cyan-300">
                        ←
                      </span>
                    </button>

                    <h4 className="text-4xl font-black bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent tracking-wider">
                      {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h4>

                    <button
                      onClick={() =>
                        setCurrentMonth(
                          (prev) =>
                            new Date(prev.getFullYear(), prev.getMonth() + 1)
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
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-sm font-bold text-cyan-400 tracking-widest uppercase"
                        >
                          {day}
                        </div>
                      )
                    )}
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
                      const dateStr = `${year}-${String(month + 1).padStart(
                        2,
                        "0"
                      )}-${String(day).padStart(2, "0")}`;
                      const dayTrades = trades.filter(
                        (t) => t.date === dateStr
                      );
                      const dayPnl = dayTrades.reduce(
                        (sum, t) => sum + t.pnlDollar,
                        0
                      );
                      const isToday =
                        new Date().toISOString().split("T")[0] === dateStr;

                      return (
                        <motion.div
                          key={day}
                          whileHover={{ scale: 1.08, y: -4 }}
                          onClick={() =>
                            dayTrades.length > 0 && setSelectedDate(dateStr)
                          }
                          className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
              ${
                dayTrades.length === 0
                  ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-400/40"
                  : dayPnl >= 0
                  ? "bg-emerald-500/20 border-emerald-400 hover:bg-emerald-500/40 hover:border-emerald-300 shadow-lg shadow-emerald-500/30"
                  : "bg-red-500/20 border-red-400 hover:bg-red-500/40 hover:border-red-300 shadow-lg shadow-red-500/30"
              }
              ${
                isToday
                  ? "ring-4 ring-purple-400/70 ring-offset-4 ring-offset-black"
                  : ""
              }
            `}
                        >
                          {/* Day Number */}
                          <div className="text-3xl font-black text-white drop-shadow-lg">
                            {day}
                          </div>

                          {/* P&L */}
                          {dayTrades.length > 0 && (
                            <div
                              className={`text-xl font-bold mt-2 ${
                                dayPnl >= 0
                                  ? "text-emerald-300"
                                  : "text-red-300"
                              }`}
                            >
                              {dayPnl > 0 ? "+" : ""}
                              {formatNumber(dayPnl)}
                            </div>
                          )}

                          {/* Trade Count Badge */}
                          {dayTrades.length > 0 && (
                            <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
                              {dayTrades.length}{" "}
                              {dayTrades.length === 1 ? "trade" : "trades"}
                            </div>
                          )}

                          {/* Today Indicator */}
                          {isToday && (
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

              {/* CALENDAR DETAIL POPUP */}
              <AnimatePresence>
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl"
                    onClick={() => setSelectedDate(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 50 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 50 }}
                      className="relative max-w-2xl w-full bg-gradient-to-br from-slate-900/95 to-black/95 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-4xl p-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setSelectedDate(null)}
                        className="absolute top-6 right-6 text-white/60 hover:text-white"
                      >
                        <X className="w-8 h-8" />
                      </button>
                      <h3 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </h3>
                      {trades.filter((t) => t.date === selectedDate).length ===
                      0 ? (
                        <p className="text-center text-white/40 text-2xl py-20">
                          No trades
                        </p>
                      ) : (
                        <>
                          {trades
                            .filter((t) => t.date === selectedDate)
                            .map((trade) => (
                              <div
                                key={trade.id}
                                className="mb-6 p-6 bg-white/5 rounded-2xl border border-white/10"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-3xl font-black text-cyan-400">
                                      {trade.symbol}
                                    </span>
                                    <span className="text-white/60 mx-4">
                                      →
                                    </span>
                                    <span className="text-yellow-300">
                                      ${trade.entry.toFixed(6)}
                                    </span>
                                    <span className="text-white/60 mx-2">
                                      →
                                    </span>
                                    <span className="text-pink-300">
                                      ${trade.exit.toFixed(6)}
                                    </span>
                                  </div>
                                  <div
                                    className={`text-3xl font-bold ${
                                      trade.pnlDollar >= 0
                                        ? "text-emerald-400"
                                        : "text-red-400"
                                    }`}
                                  >
                                    {trade.pnlDollar >= 0 ? "+" : ""}
                                    {formatNumber(trade.pnlDollar)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          <div className="mt-10 p-6 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-2xl border border-white/10 text-center">
                            <p className="text-xl text-white/70 mb-2">
                              Total P&L
                            </p>
                            <p
                              className={`text-5xl font-black ${
                                trades
                                  .filter((t) => t.date === selectedDate)
                                  .reduce((s, t) => s + t.pnlDollar, 0) >= 0
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {formatNumber(
                                trades
                                  .filter((t) => t.date === selectedDate)
                                  .reduce((s, t) => s + t.pnlDollar, 0)
                              )}
                            </p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* NUKE BUTTON */}
              <button
                onClick={() =>
                  confirm("NUKE ALL DATA? This cannot be undone.") &&
                  (localStorage.clear(), location.reload())
                }
                className="fixed bottom-8 right-8 z-50 bg-red-900/50 backdrop-blur-xl border border-red-500/50 text-red-400 px-6 py-3 rounded-full text-sm font-bold hover:bg-red-900/80 transition"
              >
                NUKE DATA
              </button>
            </div>
          </motion.div>
        )}
      </SignedIn>
    </>
  );
}
